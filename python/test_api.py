import json
import os
from contextlib import contextmanager
from io import BytesIO

import pytest
from fastapi.testclient import TestClient
from freezegun import freeze_time

from api.files import MEDIA_ROOT
from main import start_app


def get_token(client: TestClient):
    data = {
        'username': 'admin',
        'password': os.getenv('ADMIN_PASSWORD')
    }
    response = client.post("/api/v1/users/token", data=data)
    return response.json()['access_token']


@contextmanager
def pytest_client():
    app = start_app(keep_db=False)
    with TestClient(app) as client:
        yield client


@pytest.mark.asyncio
async def test_create_todo():
    with pytest_client() as client:
        token = get_token(client)
        data = json.dumps({
            'text': 'Do something'
        })
        response = client.post("/api/v1/todos/", content=data, headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 201
        data = response.json()
        assert data["text"] == "Do something"


@pytest.mark.asyncio
async def test_get_todo():
    with pytest_client() as client:
        token = get_token(client)
        data = json.dumps({
            'text': 'Do something'
        })
        response = client.post("/api/v1/todos/", content=data, headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 201
        data = response.json()
        todo_id = data['id']
        response = client.get(f"/api/v1/todos/{todo_id}", headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 200
        data = response.json()
        assert data["text"] == "Do something"


@pytest.mark.asyncio
async def test_update_todo():
    with pytest_client() as client:
        token = get_token(client)
        data = json.dumps({
            'text': 'Do something'
        })
        response = client.post("/api/v1/todos/", content=data, headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 201
        data = response.json()
        todo_id = data['id']
        data = json.dumps({
            'text': 'Some task'
        })
        response = client.put(f"/api/v1/todos/{todo_id}", content=data, headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 200
        response = client.get(f"/api/v1/todos/{todo_id}", headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 200
        data = response.json()
        assert data["text"] == "Some task"


@pytest.mark.asyncio
async def test_delete_todo():
    with pytest_client() as client:
        token = get_token(client)
        data = json.dumps({
            'text': 'Do something'
        })
        response = client.post("/api/v1/todos/", content=data, headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 201
        data = response.json()
        todo_id = data['id']
        response = client.delete(f"/api/v1/todos/{todo_id}", headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 204
        response = client.get(f"/api/v1/todos/{todo_id}", headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 404


@pytest.mark.asyncio
async def test_list_todos():
    with pytest_client() as client:
        token = get_token(client)
        data = json.dumps({
            'text': 'Do something'
        })
        response = client.post("/api/v1/todos/", content=data, headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 201
        data = response.json()
        response = client.get(f"/api/v1/todos/", headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 200
        list_data = response.json()
        assert data in list_data


@pytest.mark.asyncio
async def test_notes_round_trip():
    with pytest_client() as client:
        token = get_token(client)
        data = json.dumps({
            'text': 'Lorem ipsum dolor sit amet<br>Consectetur idipisci'
        })
        response = client.post("/api/v1/notes/", content=data, headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 200
        response = client.get("/api/v1/notes/", headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 200
        data = response.json()
        assert data['text'] == 'Lorem ipsum dolor sit amet<br>Consectetur idipisci'
        data = json.dumps({
            'text': 'Foo Bar Baz'
        })
        response = client.post("/api/v1/notes/", content=data, headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 200


@pytest.fixture
def clean_files():
    yield
    os.unlink(os.path.join(MEDIA_ROOT, 'test.txt'))


@pytest.mark.asyncio
async def test_create_file(clean_files):
    with pytest_client() as client:
        token = get_token(client)
        fh = BytesIO(b'Lorem')
        response = client.post("/api/v1/files/", files={"file": ("test.txt", fh, "text/plain")}, headers={
            'Authorization': f'Bearer {token}'
        })
        assert response.status_code == 201
        data = response.json()
        assert data["filename"] == "test.txt"
        assert os.path.exists(os.path.join(MEDIA_ROOT, 'test.txt'))


@pytest.mark.asyncio
async def test_get_file(clean_files):
    with pytest_client() as client:
        token = get_token(client)
        fh = BytesIO(b'Lorem')
        response = client.post("/api/v1/files/", files={"file": ("test.txt", fh, "text/plain")}, headers={
            'Authorization': f'Bearer {token}'
        })
        assert response.status_code == 201
        data = response.json()
        file_id = data['id']
        response = client.get(f"/api/v1/files/{file_id}", headers={
            'Authorization': f'Bearer {token}'
        })
        assert response.status_code == 200
        data = response.content
        assert data == b'Lorem'


@pytest.mark.asyncio
async def test_list_files(clean_files):
    with pytest_client() as client:
        token = get_token(client)
        fh = BytesIO(b'Lorem')
        response = client.post("/api/v1/files/", files={"file": ("test.txt", fh, "text/plain")}, headers={
            'Authorization': f'Bearer {token}'
        })
        assert response.status_code == 201
        response = client.get(f"/api/v1/files/", headers={
            'Authorization': f'Bearer {token}'
        })
        assert response.status_code == 200
        list_data = response.json()
        assert len(list_data) == 1
        data = list_data[0]
        assert data['filename'] == 'test.txt'


@pytest.mark.asyncio
@freeze_time('2023-12-01')
async def test_create_event():
    with pytest_client() as client:
        token = get_token(client)
        data = json.dumps({
            'text': 'Do something',
            'datetime': '2023-12-02T08:00'
        })
        response = client.post("/api/v1/events/", content=data, headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 201
        data = response.json()
        assert data["text"] == "Do something"


@pytest.mark.asyncio
@freeze_time('2023-12-01')
async def test_delete_event():
    with pytest_client() as client:
        token = get_token(client)
        data = json.dumps({
            'text': 'Do something',
            'datetime': '2023-12-02T08:00'
        })
        response = client.post("/api/v1/events/", content=data, headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 201
        data = response.json()
        event_id = data['id']
        response = client.delete(f"/api/v1/events/{event_id}", headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 204


@pytest.mark.asyncio
@freeze_time('2023-12-01')
async def test_list_events():
    with pytest_client() as client:
        token = get_token(client)
        data = json.dumps({
            'text': 'Do something',
            'datetime': '2023-12-02T08:00'
        })
        response = client.post("/api/v1/events/", content=data, headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 201
        data = response.json()
        response = client.get(f"/api/v1/events/", headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
        assert response.status_code == 200
        list_data = response.json()
        assert data in list_data
