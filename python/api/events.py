from typing import Annotated, List

from fastapi import APIRouter, Depends

from api import db_manager
from api.auth import get_current_active_user
from api.decorators import require_allowed_for_widget, Widget
from api.models import CreateUpdateEvent, ReadEvent, User


events = APIRouter()


@events.post('/', response_model=ReadEvent, status_code=201)
@require_allowed_for_widget(Widget.EVENTS)
async def create_event(current_user: Annotated[User, Depends(get_current_active_user)], payload: CreateUpdateEvent):
    event_id = await db_manager.add_event(payload, current_user)
    CreateUpdateEvent.validate(payload)
    return {
        'id': event_id,
        **payload.dict()
    }


@events.get('/{event_id}/', response_model=ReadEvent, status_code=200)
@require_allowed_for_widget(Widget.EVENTS)
async def get_event(current_user: Annotated[User, Depends(get_current_active_user)], event_id: int):
    return await db_manager.get_event(event_id, current_user)


@events.put('/{event_id}/', response_model=ReadEvent, status_code=200)
@require_allowed_for_widget(Widget.EVENTS)
async def update_event(current_user: Annotated[User, Depends(get_current_active_user)], event_id: int,
                       payload: CreateUpdateEvent):
    CreateUpdateEvent.validate(payload)
    await db_manager.update_event(event_id, payload, current_user)
    return {
        'id': event_id,
        **payload.dict()
    }


@events.delete('/{event_id}/', status_code=204)
@require_allowed_for_widget(Widget.EVENTS)
async def delete_event(current_user: Annotated[User, Depends(get_current_active_user)], event_id: int):
    await db_manager.delete_event(event_id, current_user)
    return {}


@events.get('/', response_model=List[ReadEvent], status_code=200)
@require_allowed_for_widget(Widget.EVENTS)
async def list_events(current_user: Annotated[User, Depends(get_current_active_user)]):
    return await db_manager.list_events(current_user)
