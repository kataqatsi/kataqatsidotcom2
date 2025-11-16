from sqlalchemy import func, ForeignKey, Text, Enum, Column
from typing import Annotated
from sqlalchemy.orm import mapped_column
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
import uuid
import datetime
from typing import Optional

PostgresUUID = Annotated[uuid.UUID, True]
ArrayUUID = Annotated[list[uuid.UUID], True]
UuidPk = Annotated[
    PostgresUUID, mapped_column(primary_key=True, index=True, default=uuid.uuid4)
]
UserForeignKey = Annotated[
    PostgresUUID, mapped_column(ForeignKey("user.id", ondelete="CASCADE"), index=True)
]
BoolTrue = Annotated[bool, mapped_column(default=True)]
BoolFalse = Annotated[bool, mapped_column(default=False)]
IBoolTrue = Annotated[bool, mapped_column(default=True, index=True)]
IBoolFalse = Annotated[bool, mapped_column(default=False, index=True)]
CreatedStamp = Annotated[
    datetime.datetime, mapped_column(default=datetime.datetime.utcnow)
]
UpdatedStamp = Annotated[
    Optional[datetime.datetime], mapped_column(onupdate=datetime.datetime.utcnow)
]


class Base(declarative_base()):
    __abstract__ = True

    type_annotation_map = {
        PostgresUUID: UUID(as_uuid=True),
        ArrayUUID: ARRAY(UUID(as_uuid=True)),
        str: Text,
        dict: JSONB,
    }


def belongs_to(class_name):
    """Decorator to indicate which class a function belongs to."""

    def decorator(func):
        func._belongs_to = class_name
        func._belongs_to_name = class_name.__name__
        return func

    return decorator
