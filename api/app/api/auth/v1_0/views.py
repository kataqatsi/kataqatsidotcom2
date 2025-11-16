from fastapi import APIRouter, Depends, Request
import app.api.auth.v1_0.schema as schema
import app.api.user.models as user_models
from app.shared.schemas.shared_schema import SuccessErrorResponse
from app.shared.auth.auth_handler import sign_jwt
from app.shared.middleware.auth import JWTBearer
from fastapi.exceptions import HTTPException
from app.shared.auth.auth_handler import decode_jwt
from app.shared.middleware.session_handler import db

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post("/login")
def login(context: schema.LoginRequest) -> schema.LoginResponse:
    user = user_models.login(context.email, context.password)
    if not user:
        return schema.LoginResponse(success=False, error={"msg": "Invalid credentials"})
    # Generate JWT token
    token_result = sign_jwt(claim=str(user.id))
    if token_result.get("error"):
        return schema.LoginResponse(
            success=False, error={"msg": "Token generation failed"}
        )
    return schema.LoginResponse(
        success=True,
        access_token=token_result["access_token"],
        refresh_token=token_result["refresh_token"],
    )


@router.get("/refresh", dependencies=[Depends(JWTBearer())])
def refresh(request: Request) -> schema.RefreshResponse:
    _, credentials = request.headers.get("Authorization").split()
    if credentials == "APPLICATIONH4X" or credentials == "APPLICATION4DM1NH4X":
        return {"error": {"msg": "Really?"}, "success": False}
    token = decode_jwt(credentials)
    if token and token.get("refreshable"):
        response = sign_jwt(claim=request.user.id)
        return response
    raise HTTPException(status_code=401, detail="Invalid token or expired token.")
