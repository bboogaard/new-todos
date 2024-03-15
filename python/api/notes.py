import html
from typing import Annotated

from fastapi import APIRouter, Depends

from api import db_manager
from api.auth import get_current_active_user
from api.decorators import require_allowed_for_widget, Widget
from api.models import CreateUpdateNote, ReadNote, User


notes = APIRouter()


@notes.post('/', status_code=200)
@require_allowed_for_widget(Widget.NOTES)
async def save_note(current_user: Annotated[User, Depends(get_current_active_user)], payload: CreateUpdateNote):
    CreateUpdateNote.validate(payload)
    note_id = await db_manager.save_note(payload, current_user)
    return {
        'id': note_id,
        **payload.dict()
    }


@notes.get('/', response_model=ReadNote)
@require_allowed_for_widget(Widget.NOTES)
async def get_note(current_user: Annotated[User, Depends(get_current_active_user)]):
    note = await db_manager.get_note(current_user)
    note = note or ReadNote(text='')
    note.text = html.escape(note.text).replace('\n', '&#10;')
    return note
