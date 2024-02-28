import datetime

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None


class UserInDB(User):
    hashed_password: str


class CreateUpdateTodo(BaseModel):
    text: str


class ReadTodo(CreateUpdateTodo):
    id: int


class CreateUpdateNote(BaseModel):
    text: str


class ReadNote(CreateUpdateNote):
    ...


class CreateFile(BaseModel):
    filename: str


class ReadFile(CreateFile):
    id: int


class CreateEvent(BaseModel):
    text: str
    datetime: datetime.datetime


class ReadEvent(CreateEvent):
    id: int
