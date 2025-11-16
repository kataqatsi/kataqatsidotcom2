import uuid
import bcrypt
from sqlalchemy.orm import Mapped, mapped_column
from app.shared.bases.base_model import (
    Base,
    UuidPk,
    ForeignKey,
    UserForeignKey,
    PostgresUUID,
    BoolTrue,
    CreatedStamp,
    UpdatedStamp,
    belongs_to,
)
from app.shared.middleware.session_handler import db


class Role(Base):
    __tablename__ = "user_role"
    id: Mapped[str] = mapped_column(primary_key=True, index=True)
    description: Mapped[str]
    created_at: Mapped[CreatedStamp]
    updated_at: Mapped[UpdatedStamp]


class Permission(Base):
    __tablename__ = "user_permission"
    id: Mapped[str] = mapped_column(primary_key=True, index=True)
    description: Mapped[str]
    created_at: Mapped[CreatedStamp]
    updated_at: Mapped[UpdatedStamp]


class RolePermission(Base):
    __tablename__ = "user_role_permission"
    role_id: Mapped[str] = mapped_column(
        ForeignKey("user_role.id", ondelete="CASCADE"), primary_key=True
    )
    permission_id: Mapped[str] = mapped_column(
        ForeignKey("user_permission.id", ondelete="CASCADE"), primary_key=True
    )
    created_at: Mapped[CreatedStamp]
    updated_at: Mapped[UpdatedStamp]


class Tenant(Base):
    __tablename__ = "tenant"
    id: Mapped[str] = mapped_column(primary_key=True, index=True)
    full_name: Mapped[str]
    created_at: Mapped[CreatedStamp]
    updated_at: Mapped[UpdatedStamp]


class User(Base):
    __tablename__ = "user"

    id: Mapped[UuidPk]
    email: Mapped[str] = mapped_column(unique=True, index=True)
    password: Mapped[str]
    active: Mapped[BoolTrue] = mapped_column(default=True, index=True)
    tenant_id: Mapped[str] = mapped_column(
        ForeignKey("tenant.id", ondelete="CASCADE"),
    )
    role_id: Mapped[str] = mapped_column(
        ForeignKey("user_role.id", ondelete="CASCADE"),
    )
    created_at: Mapped[CreatedStamp]
    updated_at: Mapped[UpdatedStamp]


@belongs_to(User)
def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


@belongs_to(User)
def verify_password(password1: str, password2: str) -> bool:
    """Verify a password against the stored hash"""
    return bcrypt.checkpw(password1.encode("utf-8"), password2.encode("utf-8"))


@belongs_to(User)
def get_user(user_id: uuid.UUID):
    user = db.session.query(User).filter_by(id=user_id).first()
    return user


@belongs_to(User)
def login(email: str, password: str):
    user = db.session.query(User).filter_by(email=email).first()
    if user and verify_password(password, user.password):
        return user
    return None


@belongs_to(User)
def user_claims(user_id: str):
    """Generate user claims for JWT token"""
    try:
        # Validate that user_id is a valid UUID and convert to UUID object
        user_uuid = uuid.UUID(user_id)
        user = db.session.query(User).filter_by(id=user_uuid).first()
        if user:
            return {
                "user_id": str(user.id),
                "tenant_id": str(user.tenant_id),
                "role_id": str(user.role_id),
            }
        else:
            return {"error": {"msg": "User not found"}}
    except (ValueError, TypeError):
        return {"error": {"msg": "Invalid user ID"}}
