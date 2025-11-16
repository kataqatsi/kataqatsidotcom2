from enum import Enum


class RoleEnum(str, Enum):
    default = "default"
    admin = "admin"


class ErrorCodeEnum(str, Enum):
    item_not_found = "item_not_found"


class TestEnum(str, Enum):
    this = "this"
    that = "that"


class AdminPermsEnum(str, Enum):
    test_value = "test_value"
