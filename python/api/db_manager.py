import datetime
import os

from api.db import database, events, files, notes, todos, users
from api.models import CreateEvent, CreateFile, CreateUpdateNote, CreateUpdateTodo, User, UserInDB


ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')


async def add_todo(payload: CreateUpdateTodo, user: User):
    query = todos.insert().values(**{**payload.dict(), 'username': user.username})
    return await database.execute(query=query)


async def get_todo(todo_id: int, user: User):
    query = todos.select((todos.c.id == todo_id) & (todos.c.username == user.username))
    return await database.fetch_one(query=query)


async def list_todos(user: User):
    query = todos.select(todos.c.username == user.username).order_by(todos.c.id.desc())
    return await database.fetch_all(query=query)


async def update_todo(todo_id: int, payload: CreateUpdateTodo, user: User):
    query = todos.update((todos.c.id == todo_id) & (todos.c.username == user.username)).values(**payload.dict())
    return await database.execute(query=query)


async def delete_todo(todo_id: int, user: User):
    query = todos.delete((todos.c.id == todo_id) & (todos.c.username == user.username))
    return await database.execute(query=query)


async def save_note(payload: CreateUpdateNote, user: User):
    note = await get_note(user)
    return await update_note(payload, user) if note else await add_note(payload, user)


async def add_note(payload: CreateUpdateNote, user: User):
    query = notes.insert().values(**{**payload.dict(), 'username': user.username})
    return await database.execute(query=query)


async def update_note(payload: CreateUpdateNote, user: User):
    query = notes.update(notes.c.username == user.username).values(**payload.dict())
    return await database.execute(query=query)


async def get_note(user: User):
    query = notes.select(notes.c.username == user.username)
    return await database.fetch_one(query=query)


async def add_file(payload: CreateFile, user: User):
    query = files.insert().values(**{**payload.dict(), 'username': user.username})
    return await database.execute(query=query)


async def get_file(file_id: int, user: User):
    query = files.select((files.c.id == file_id) & (files.c.username == user.username))
    return await database.fetch_one(query=query)


async def delete_file(file_id: int, user: User):
    query = files.delete((files.c.id == file_id) & (files.c.username == user.username))
    return await database.execute(query=query)


async def list_files(user: User):
    query = files.select(files.c.username == user.username).order_by(files.c.id.desc())
    return await database.fetch_all(query=query)


async def add_event(payload: CreateEvent, user: User):
    query = events.insert().values(**{**payload.dict(), 'username': user.username})
    return await database.execute(query=query)


async def list_events(user: User):
    offset = datetime.date.today()
    query = events.select(
        (events.c.username == user.username) & (events.c.datetime >= offset)
    ).order_by(events.c.datetime)
    return await database.fetch_all(query=query)


async def delete_event(event_id: int, user: User):
    query = events.delete((events.c.id == event_id) & (events.c.username == user.username))
    return await database.execute(query=query)


async def create_admin():
    from api.auth import get_password_hash

    user = await get_user('admin')
    if user:
        return

    user = UserInDB(
        username='admin',
        email='admin@localhost.tld',
        full_name='Admin',
        disabled=False,
        hashed_password=get_password_hash(ADMIN_PASSWORD)
    )
    query = users.insert().values(**user.dict())
    return await database.execute(query=query)


async def get_user(username: str):
    query = users.select(users.c.username == username)
    return await database.fetch_one(query=query)
