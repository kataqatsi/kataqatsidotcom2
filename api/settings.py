import os
import json
from dotenv import load_dotenv

load_dotenv(override=True)


class Config:
    environment: str = os.getenv("ENVIRONMENT", "local")
    database_connection: str = os.getenv("DATABASE_CONNECTION")
    redis_connection: str = os.getenv("REDIS_CONNECTION")
    fastapi_host: str = os.getenv("FASTAPI_HOST", "127.0.0.1")
    fastapi_port: int = int(os.getenv("FASTAPI_PORT", 8000))
    fastapi_workers: int = int(os.getenv("FASTAPI_WORKERS", 1))
    fastapi_key: str = os.getenv("FASTAPI_KEY", "")
    json_variable: dict = json.loads(os.getenv("JSON_VARIABLE"))
