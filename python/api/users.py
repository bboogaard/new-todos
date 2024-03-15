import os
from datetime import timedelta
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from api import db_manager
from api.auth import authenticate_user, create_access_token, get_current_active_user
from api.decorators import require_allowed_for_widget, Widget
from api.models import CreateUser, UpdateUser, ReadUserInfo, Token, UpdateUserInfo, User, UserInfo


ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES'))


users = APIRouter()


@users.post("/tokens/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    await db_manager.create_admin()
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@users.post('/', response_model=User, status_code=201)
@require_allowed_for_widget(Widget.USERS)
async def create_user(current_user: Annotated[User, Depends(get_current_active_user)], payload: CreateUser):
    User.validate(payload)
    await db_manager.add_user(payload)
    return payload.dict()


@users.get('/permissions/user/', response_model=List[str], status_code=200)
async def get_permissions(current_user: Annotated[User, Depends(get_current_active_user)]):
    return current_user.widgets


@users.get('/userinfo/me/', response_model=UserInfo, status_code=200)
async def get_userinfo(current_user: Annotated[User, Depends(get_current_active_user)]):
    userinfo = UserInfo(
        username=current_user.username,
        email=current_user.email,
        full_name=current_user.full_name
    )
    return userinfo.dict()


@users.put('/userinfo/me/', response_model=ReadUserInfo, status_code=200)
async def update_userinfo(current_user: Annotated[User, Depends(get_current_active_user)], payload: UpdateUserInfo):
    UpdateUserInfo.validate(payload)
    await db_manager.update_userinfo(current_user.username, payload)
    return {
        'username': current_user.username,
        **payload.dict()
    }


@users.delete('/{username}/', status_code=204)
@require_allowed_for_widget(Widget.USERS)
async def delete_user(current_user: Annotated[User, Depends(get_current_active_user)], username: str):
    await db_manager.delete_user(username)
    return {}


@users.get('/{username}/', response_model=User, status_code=200)
@require_allowed_for_widget(Widget.USERS)
async def get_user(current_user: Annotated[User, Depends(get_current_active_user)], username: str):
    return await db_manager.get_user(username)


@users.put('/{username}/', response_model=User, status_code=200)
@require_allowed_for_widget(Widget.USERS)
async def update_user(current_user: Annotated[User, Depends(get_current_active_user)], username: str,
                      payload: UpdateUser):
    UpdateUser.validate(payload)
    await db_manager.update_user(username, payload)
    return {
        'username': username,
        **payload.dict()
    }


@users.get('/', response_model=List[User], status_code=200)
@require_allowed_for_widget(Widget.USERS)
async def list_users(current_user: Annotated[User, Depends(get_current_active_user)]):
    return await db_manager.list_users()
