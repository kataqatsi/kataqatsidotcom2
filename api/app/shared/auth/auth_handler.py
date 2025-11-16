import time
from datetime import timedelta

import jwt
from fastapi.exceptions import HTTPException

import app.api.user.models as user_models
from app.shared.middleware.json_encoders import (
    ModelEncoder,
)
from settings import Config
from fastapi.logger import logger


JWT_SECRET = Config.fastapi_key
JWT_ALGORITHM = "HS256"


def sign_jwt(
    claim: str,
    #  device_id: str
):
    payload = user_models.user_claims(user_id=claim)
    # payload contains
    # {user_id: id, tenant_id: id}

    if payload.get("error"):
        return payload

    if Config.environment == "local":
        # For testing
        # payload["expires"] = time.time() + timedelta(seconds=10).total_seconds()
        payload["expires"] = time.time() + timedelta(minutes=525960).total_seconds()

    else:
        payload["expires"] = time.time() + timedelta(minutes=10).total_seconds()
    # payload["device_id"] = device_id
    access_token = jwt.encode(
        payload, JWT_SECRET, algorithm=JWT_ALGORITHM, json_encoder=ModelEncoder
    )

    if "roles" in payload:
        del payload["roles"]

    # refresh_token: 7 days
    payload["expires"] = time.time() + timedelta(minutes=10080).total_seconds()
    # For testing
    # payload["expires"] = time.time() + timedelta(seconds=30).total_seconds()

    payload["refreshable"] = True
    refresh_token = jwt.encode(
        payload, JWT_SECRET, algorithm=JWT_ALGORITHM, json_encoder=ModelEncoder
    )

    return {
        "success": True,
        "access_token": access_token,
        "refresh_token": refresh_token,
    }


def decode_jwt(token: str) -> dict:
    try:
        claims = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return (
            claims
            if claims["expires"] >= time.time()
            # and claims.get("device_id")
            else None
        )
    except Exception as e:
        logger.info(e)
        return {}
