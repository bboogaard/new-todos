from enum import Enum
from functools import wraps

from fastapi import HTTPException

from api.models import User


class Widget(Enum):
    USERS = 'users'
    NOTES = 'notes'
    TODOS = 'todos'
    FILES = 'files'
    EVENTS = 'events'

    @classmethod
    def all(cls):
        return [m.value for m in cls]


def require_allowed_for_widget(widget: Widget):

    def decorator(func):

        @wraps(func)
        async def wrapped_func(*args, **kwargs):
            # current user should be first arg
            try:
                assert isinstance(args[0], User)
                current_user = args[0]
            except (AssertionError, IndexError):
                current_user = kwargs.get('current_user')
            if current_user is None:
                raise NotImplementedError()
            if widget.value not in (current_user.widgets or []):
                raise HTTPException(status_code=401, detail='Widget not allowed for user')
            return await func(*args, **kwargs)

        return wrapped_func

    return decorator
