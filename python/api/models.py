import datetime
from typing import List, Union

from pydantic import BaseModel, Field, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Union[str, None] = None


class User(BaseModel):
    username: str = Field(..., min_length=1)
    email: Union[EmailStr, None] = None
    full_name: Union[str, None] = None
    disabled: Union[bool,  None] = None
    widgets: List[str] = None


class ReadUserInfo(BaseModel):
    email: Union[EmailStr, None] = None
    full_name: Union[str, None] = None


class UpdateUserInfo(ReadUserInfo):
    password: str = None


class UserInfo(UpdateUserInfo):
    username: str

    @property
    def name(self):
        return self.full_name or self.username


class CreateUser(User):
    password: str = Field(..., min_length=1)


class UpdateUser(BaseModel):
    email: Union[EmailStr, None] = None
    full_name: Union[str, None] = None
    disabled: Union[bool,  None] = None
    widgets: List[str] = None
    password: str = None


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


class CreateUpdateEvent(BaseModel):
    text: str = Field(..., min_length=1)
    datetime: datetime.datetime


class ReadEvent(CreateUpdateEvent):
    id: int
