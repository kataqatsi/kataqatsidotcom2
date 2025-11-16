from humps import camelize
from pydantic import BaseModel, ConfigDict


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=camelize, populate_by_name=True)


class ORMCamelModel(CamelModel):
    model_config = ConfigDict(from_attributes=True)
