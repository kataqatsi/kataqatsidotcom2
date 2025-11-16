from typing import Optional
from app.shared.schemas.orm_schema import CamelModel, ORMCamelModel
from app.shared.enums.enums import (
    ErrorCodeEnum,
)


class BaseErrorResponse(CamelModel):
    msg: str
    code: Optional[ErrorCodeEnum] = None
    data: Optional[dict] = None


class SuccessErrorResponse(CamelModel):
    success: bool
    error: Optional[BaseErrorResponse] = None
