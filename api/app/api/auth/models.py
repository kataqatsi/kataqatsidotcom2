from app.shared.bases.base_model import (
    Base,
    CreatedStamp,
    UpdatedStamp,
    UuidPk,
)
from sqlalchemy.orm import Mapped, mapped_column
from app.shared.middleware.session_handler import db
from app.api.user.models import User


class OTPCode(Base):
    __tablename__ = "otp_code"
    id: Mapped[UuidPk] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(index=True, unique=True)
    code: Mapped[str]
    created_at: Mapped[CreatedStamp]
    updated_at: Mapped[UpdatedStamp]
