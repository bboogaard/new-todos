from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException

from api import db_manager
from api.models import CreateUpdateTodo, ReadTodo, User
from api.auth import get_current_active_user


todos = APIRouter()


@todos.post('/', response_model=ReadTodo, status_code=201)
async def create_todo(current_user: Annotated[User, Depends(get_current_active_user)], payload: CreateUpdateTodo):
    todo_id = await db_manager.add_todo(payload, current_user)
    response = {
        'id': todo_id,
        **payload.dict()
    }
    return response


@todos.get('/{todo_id}/', response_model=ReadTodo)
async def get_todo(current_user: Annotated[User, Depends(get_current_active_user)], todo_id: int):
    todo = await db_manager.get_todo(todo_id, current_user)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@todos.put('/{todo_id}/', status_code=200)
async def update_todo(current_user: Annotated[User, Depends(get_current_active_user)], todo_id: int,
                      payload: CreateUpdateTodo):
    await db_manager.update_todo(todo_id, payload, current_user)
    return {}


@todos.delete('/{todo_id}/', status_code=204)
async def delete_todo(current_user: Annotated[User, Depends(get_current_active_user)], todo_id: int):
    await db_manager.delete_todo(todo_id, current_user)
    return {}


@todos.get('/', response_model=List[ReadTodo], status_code=200)
async def list_todos(current_user: Annotated[User, Depends(get_current_active_user)]):
    return await db_manager.list_todos(current_user)
