from fastapi import FastAPI
from app.api.auth.v1_0.views import router as auth_router
from app.api.user.v1_0.views import router as user_router


def add_routes(app: FastAPI):
    app.include_router(auth_router)
    app.include_router(user_router)
