import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.db import database, engine, metadata
from api.events import events
from api.files import files
from api.notes import notes
from api.todos import todos
from api.users import users


@asynccontextmanager
async def lifespan(ap: FastAPI):
    await database.connect()
    yield
    await database.disconnect()


def start_app(keep_db: bool = True):
    _app = FastAPI(lifespan=lifespan, openapi_url="/api/v1/openapi.json", docs_url="/api/v1/docs")
    _app.include_router(notes, prefix='/api/v1/notes', tags=['notes'])
    _app.include_router(todos, prefix='/api/v1/todos', tags=['todos'])
    _app.include_router(files, prefix='/api/v1/files', tags=['files'])
    _app.include_router(events, prefix='/api/v1/events', tags=['events'])
    _app.include_router(users, prefix='/api/v1/users', tags=['users'])
    if not keep_db:
        metadata.drop_all(engine)
    metadata.create_all(engine)
    _app.add_middleware(
        CORSMiddleware,
        allow_origins=os.getenv('ALLOWED_ORIGINS').split(','),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return _app


app = start_app()
