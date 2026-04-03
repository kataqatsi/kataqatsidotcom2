from enum import Enum


class RoleEnum(str, Enum):
    default = "default"
    admin = "admin"


class ErrorCodeEnum(str, Enum):
    item_not_found = "item_not_found"
    user_already_exists = "user_already_exists"
    otp_code_already_sent = "otp_code_already_sent"
    invalid_otp_code = "invalid_otp_code"


class TestEnum(str, Enum):
    this = "this"
    that = "that"


class AdminPermsEnum(str, Enum):
    test_value = "test_value"


class TenantEnum(str, Enum):
    default = "default"
