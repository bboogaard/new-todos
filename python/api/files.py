import os
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.responses import FileResponse

from api import db_manager
from api.models import CreateFile, ReadFile, User
from api.auth import get_current_active_user


MEDIA_ROOT = os.getenv('MEDIA_ROOT')


files = APIRouter()


def save_file(file: UploadFile, filename: str):
    if os.path.exists(filename):
        os.unlink(filename)
    with open(filename, 'wb') as fh:
        fh.write(file.file.read())


@files.post('/', response_model=ReadFile, status_code=201)
async def create_file(current_user: Annotated[User, Depends(get_current_active_user)], file: UploadFile):
    file_id = await db_manager.add_file(CreateFile(filename=file.filename), current_user)
    save_file(file, os.path.join(MEDIA_ROOT, file.filename))
    response = {
        'id': file_id,
        'username': current_user.username,
        'filename': file.filename
    }
    return response


@files.get('/{file_id}/', response_class=FileResponse)
async def get_file(current_user: Annotated[User, Depends(get_current_active_user)], file_id: int):
    file = await db_manager.get_file(file_id, current_user)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(os.path.join(MEDIA_ROOT, file.filename), filename=file.filename)


@files.delete('/{file_id}/', status_code=204)
async def delete_file(current_user: Annotated[User, Depends(get_current_active_user)], file_id: int):
    await db_manager.delete_file(file_id, current_user)
    return {}


@files.get('/', response_model=List[ReadFile], status_code=200)
async def list_files(current_user: Annotated[User, Depends(get_current_active_user)]):
    return await db_manager.list_files(current_user)
