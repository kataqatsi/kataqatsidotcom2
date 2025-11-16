from fastapi import APIRouter, Depends, Request

import app.api.user.v1_0.schema as schema
from app.api.user.models import get_user

from app.shared.schemas.shared_schema import SuccessErrorResponse
from app.shared.enums.enums import ErrorCodeEnum
from app.shared.middleware.auth import JWTBearer

router = APIRouter(
    prefix="/user",
    tags=["user"],
)


@router.post("/one")
def get_user_endpoint(context: schema.GetUserRequest) -> schema.GetUserResponse:
    response = get_user(context.user_id)
    if not response:
        return schema.GetUserResponse(
            success=False,
            error={"msg": "User not found", "code": ErrorCodeEnum.item_not_found},
        )
    return schema.GetUserResponse(success=True, user=response)


@router.post("/private", dependencies=[Depends(JWTBearer())])
def get_user_private(context: schema.GetUserRequest) -> schema.GetUserResponse:
    response = get_user(context.user_id)
    if not response:
        return schema.GetUserResponse(
            success=False,
            error={"msg": "User not found", "code": ErrorCodeEnum.item_not_found},
        )
    return schema.GetUserResponse(success=True, user=response)


@router.get("/me", dependencies=[Depends(JWTBearer())])
def get_me(request: Request) -> schema.GetUserResponse:
    user_id = request.user.id
    response = get_user(user_id)

    if not response:
        return schema.GetUserResponse(
            success=False,
            error={"msg": "User not found", "code": ErrorCodeEnum.item_not_found},
        )
    return schema.GetUserResponse(success=True, user=response)
