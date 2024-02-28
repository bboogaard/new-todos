import html
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from api import db_manager
from api.models import CreateUpdateNote, ReadNote, User
from api.auth import get_current_active_user


notes = APIRouter()


@notes.post('/', status_code=200)
async def save_note(current_user: Annotated[User, Depends(get_current_active_user)], payload: CreateUpdateNote):
    await db_manager.save_note(payload, current_user)
    return {}


@notes.get('/', response_model=ReadNote)
async def get_note(current_user: Annotated[User, Depends(get_current_active_user)]):
    note = await db_manager.get_note(current_user)
    note = note or ReadNote(text='')
    note.text = html.escape(note.text).replace('\n', '&#10;')
    return note
