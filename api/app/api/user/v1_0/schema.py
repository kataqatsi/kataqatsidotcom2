from typing import Optional
from datetime import datetime
import uuid
from app.shared.schemas.orm_schema import CamelModel, ORMCamelModel
from app.shared.schemas.shared_schema import SuccessErrorResponse


class User(ORMCamelModel):
    id: uuid.UUID
    email: str
    created_at: datetime
    updated_at: Optional[datetime] = None


class GetUserRequest(CamelModel):
    user_id: uuid.UUID


class GetUserResponse(SuccessErrorResponse):
    user: Optional[User] = None
