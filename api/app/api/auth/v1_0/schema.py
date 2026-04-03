from typing import Optional
from datetime import datetime
import uuid
from app.shared.schemas.orm_schema import CamelModel
from app.shared.schemas.shared_schema import SuccessErrorResponse


class LoginRequest(CamelModel):
    email: str
    password: str


class TokenResponse(SuccessErrorResponse):
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None


class RefreshResponse(SuccessErrorResponse):
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None


class SignupStartRequest(CamelModel):
    email: str


class SignupVerifyRequest(CamelModel):
    email: str
    password: str
    code: str
