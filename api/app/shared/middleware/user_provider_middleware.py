from typing import Optional
from uuid import UUID
from contextvars import ContextVar

from starlette.authentication import UnauthenticatedUser
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from sqlalchemy import bindparam


_requesting_user_id: ContextVar[Optional[UUID]] = ContextVar(
    "_requesting_user_id", default=None
)


def get_requesting_user_id():
    return _requesting_user_id.get()


SQL_REQUESTING_USER_ID = bindparam(
    "requesting_user_id", callable_=get_requesting_user_id
)


# Needed to simulate a request token id for when pytest tests methods without hitting an endpoint
class PatchRequestID:
    def __init__(self, patch_id: str):
        self.token = _requesting_user_id.set(patch_id)

    def __enter__(self):
        pass

    def __exit__(self, type, value, traceback):
        _requesting_user_id.reset(self.token)


class UserProviderMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint):
        if isinstance(request.user, UnauthenticatedUser):
            return await call_next(request)
        token = _requesting_user_id.set(request.user.id)
        response = await call_next(request)
        _requesting_user_id.reset(token)
        return response
