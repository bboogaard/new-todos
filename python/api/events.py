from typing import Annotated, List

from fastapi import APIRouter, Depends

from api import db_manager
from api.models import CreateEvent, ReadEvent, User
from api.auth import get_current_active_user


events = APIRouter()


@events.post('/', response_model=ReadEvent, status_code=201)
async def create_event(current_user: Annotated[User, Depends(get_current_active_user)], payload: CreateEvent):
    event_id = await db_manager.add_event(payload, current_user)
    response = {
        'id': event_id,
        **payload.dict()
    }
    return response


@events.delete('/{event_id}/', status_code=204)
async def delete_event(current_user: Annotated[User, Depends(get_current_active_user)], event_id: int):
    await db_manager.delete_event(event_id, current_user)
    return {}


@events.get('/', response_model=List[ReadEvent], status_code=200)
async def list_todos(current_user: Annotated[User, Depends(get_current_active_user)]):
    return await db_manager.list_events(current_user)
