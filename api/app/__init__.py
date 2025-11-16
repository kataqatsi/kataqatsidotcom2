from fastapi import FastAPI
from app.endpoints import routes
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.authentication import AuthenticationMiddleware
from app.shared.middleware.session_handler import DBSessionMiddleware
from app.shared.middleware.auth import JWTBearer
from app.shared.bases.base_model import Base
from sqlalchemy import create_engine
from settings import Config
from app.seed import seed_database
import os


tags_meta = [
    {
        "name": "auth",
        "description": "Authentication routes",
    },
]

fastapi_app = FastAPI(
    title=f"[{Config.environment}] Application",
    version="0.0.1",
    openapi_version="3.2.0",
    description="Application",
    tags=tags_meta,
)
routes.add_routes(fastapi_app)

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add authentication middleware
fastapi_app.add_middleware(AuthenticationMiddleware, backend=JWTBearer())

engine_args = {
    "pool_size": 10,
    "max_overflow": 20,
    "echo": Config.environment == "local",
}

fastapi_app.add_middleware(
    DBSessionMiddleware,
    session_args={
        "binds": {
            Base: create_engine(
                f"postgresql+psycopg2://{Config.database_connection}",
                **engine_args,
            ),
        },
    },
    engine_args=engine_args,
)


@fastapi_app.on_event("startup")
async def startup_event():
    seed_database()


@fastapi_app.get("/robots.txt")
def robots():
    return "User-agent: *\nDisallow: /"


@fastapi_app.get("/")
def read_root():
    return {"message": "Application API"}


handler = Mangum(fastapi_app)
