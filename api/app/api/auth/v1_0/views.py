from fastapi import APIRouter, Depends, Request
import app.api.auth.v1_0.schema as auth_schemas
import app.api.user.models as user_models
import app.api.auth.models as auth_models
import app.shared.schemas.shared_schema as shared_schemas
from app.shared.email.resend import send_otp_email
from app.shared.auth.auth_handler import sign_jwt
from app.shared.middleware.auth import JWTBearer
from fastapi.exceptions import HTTPException
from app.shared.auth.auth_handler import decode_jwt
from app.shared.middleware.session_handler import db
from app.shared.enums.enums import ErrorCodeEnum, TenantEnum, RoleEnum
import random
import datetime
from datetime import timedelta


router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post("/login")
def login(context: auth_schemas.LoginRequest) -> auth_schemas.TokenResponse:
    user = user_models.login(context.email, context.password)
    if not user:
        return auth_schemas.TokenResponse(
            success=False, error={"msg": "Invalid credentials"}
        )
    # Generate JWT token
    token_result = sign_jwt(claim=str(user.id))
    if token_result.get("error"):
        return auth_schemas.TokenResponse(
            success=False, error={"msg": "Token generation failed"}
        )
    return auth_schemas.TokenResponse(
        success=True,
        access_token=token_result["access_token"],
        refresh_token=token_result["refresh_token"],
    )


@router.post("/signup/start")
def signup_start(
    context: auth_schemas.SignupStartRequest,
) -> shared_schemas.SuccessErrorResponse:
    existing_user = (
        db.session.query(user_models.User).filter_by(email=context.email).first()
    )
    if existing_user:
        return shared_schemas.SuccessErrorResponse(
            success=False,
            error={
                "msg": "Email already in use",
                "code": ErrorCodeEnum.user_already_exists,
            },
        )
    existing_otp_code = (
        db.session.query(auth_models.OTPCode)
        .filter(auth_models.OTPCode.email == context.email)
        .first()
    )
    if existing_otp_code:
        if existing_otp_code.created_at >= datetime.datetime.now() - timedelta(
            minutes=10
        ):
            return shared_schemas.SuccessErrorResponse(
                success=False,
                error={
                    "msg": "OTP code already sent in the last 10 minutes",
                    "code": ErrorCodeEnum.otp_code_already_sent,
                },
            )
        db.session.delete(existing_otp_code)
        db.session.commit()

    code = str(random.randint(100000, 999999))
    otp_code = auth_models.OTPCode(email=context.email, code=code)
    db.session.add(otp_code)
    db.session.commit()

    # send email to user
    send_otp_email(context.email, code)

    return shared_schemas.SuccessErrorResponse(
        success=True,
        error=None,
    )


@router.post("/signup/verify")
def signup_verify(
    context: auth_schemas.SignupVerifyRequest,
) -> auth_schemas.TokenResponse:
    existing_user = (
        db.session.query(user_models.User).filter_by(email=context.email).first()
    )
    if existing_user:
        return auth_schemas.TokenResponse(
            success=False,
            error={
                "msg": "User already exists",
                "code": ErrorCodeEnum.user_already_exists,
            },
        )
    otp_code = (
        db.session.query(auth_models.OTPCode)
        .filter_by(email=context.email, code=context.code)
        .first()
    )
    if not otp_code:
        return auth_schemas.TokenResponse(
            success=False,
            error={
                "msg": "Invalid OTP code",
                "code": ErrorCodeEnum.invalid_otp_code,
            },
        )
    user = user_models.User(
        email=context.email,
        password=user_models.hash_password(context.password),
        tenant_id=TenantEnum.default,
        role_id=RoleEnum.default,
    )
    db.session.add(user)
    db.session.commit()

    token_result = sign_jwt(claim=str(user.id))
    if token_result.get("error"):
        return auth_schemas.TokenResponse(
            success=False, error={"msg": "Token generation failed"}
        )
    db.session.delete(otp_code)
    db.session.commit()
    return auth_schemas.TokenResponse(
        success=True,
        error=None,
        access_token=token_result["access_token"],
        refresh_token=token_result["refresh_token"],
    )


@router.get("/refresh", dependencies=[Depends(JWTBearer())])
def refresh(request: Request) -> auth_schemas.RefreshResponse:
    _, credentials = request.headers.get("Authorization").split()
    if credentials == "APPLICATIONH4X" or credentials == "APPLICATION4DM1NH4X":
        return auth_schemas.RefreshResponse(success=False, error={"msg": "Really?"})
    token = decode_jwt(credentials)
    if token and token.get("refreshable"):
        response = sign_jwt(claim=request.user.id)
        return auth_schemas.RefreshResponse(
            success=True,
            error=None,
            access_token=response["access_token"],
            refresh_token=response["refresh_token"],
        )
    return auth_schemas.RefreshResponse(
        success=False, error={"msg": "Invalid token or expired token."}
    )
