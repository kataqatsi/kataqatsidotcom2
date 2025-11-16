from contextvars import ContextVar
from typing import Optional, Union

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.engine.url import URL
from sqlalchemy.orm import Session, sessionmaker
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.types import ASGIApp

from fastapi_sqlalchemy.exceptions import (
    MissingSessionError,
    SessionNotInitialisedError,
)

_Session: sessionmaker = None
_session: ContextVar[Optional[Session]] = ContextVar("_session", default=None)


class DBSessionMiddleware(BaseHTTPMiddleware):
    def __init__(
        self,
        app: ASGIApp,
        db_url: Optional[Union[str, URL]] = None,
        custom_engine: Optional[Engine] = None,
        engine_args: dict = None,
        session_args: dict = None,
        commit_on_exit: bool = False,
    ):
        super().__init__(app)
        global _Session
        engine_args = engine_args or {}
        self.commit_on_exit = commit_on_exit

        session_args = session_args or {}
        if not custom_engine and not db_url and not session_args.get("binds"):
            raise ValueError(
                "You need to pass a db_url, custom_engine, or binds in the session_args parameter."
            )
        if session_args.get("binds"):
            _Session = sessionmaker(**session_args)
        else:
            if db_url:
                engine = create_engine(db_url, **engine_args)
            elif custom_engine:
                engine = custom_engine
            _Session = sessionmaker(bind=engine, **session_args)

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint):
        with db(commit_on_exit=self.commit_on_exit):
            response = await call_next(request)
        return response


class DBSessionMeta(type):
    # using this metaclass means that we can access db.session as a property at a class level,
    # rather than db().session
    @property
    def session(self) -> Session:
        """Return an instance of Session local to the current async context."""
        if _Session is None:
            raise SessionNotInitialisedError

        session = _session.get()
        if session is None:
            raise MissingSessionError

        return session


class DBSession(metaclass=DBSessionMeta):
    def __init__(self, session_args: dict = None, commit_on_exit: bool = False):
        self.token = None
        self.session_args = session_args or {}
        self.commit_on_exit = commit_on_exit

    def __enter__(self):
        if not isinstance(_Session, sessionmaker):
            raise SessionNotInitialisedError
        self.token = _session.set(_Session(**self.session_args))
        return type(self)

    def __exit__(self, exc_type, exc_value, traceback):
        sess = _session.get()
        if exc_type is not None:
            sess.rollback()

        if self.commit_on_exit:
            sess.commit()

        sess.close()
        _session.reset(self.token)


db: DBSessionMeta = DBSession
