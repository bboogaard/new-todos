import os

from dotenv import load_dotenv
from sqlalchemy import (Column, Integer, MetaData, Boolean, String, Table,
                        create_engine, ForeignKey, DateTime)

from databases import Database

load_dotenv()

DATABASE_URI = os.getenv('DATABASE_URI')

engine = create_engine(DATABASE_URI)
metadata = MetaData()

users = Table(
    'users',
    metadata,
    Column('username', String, primary_key=True),
    Column('email', String),
    Column('full_name', String),
    Column('disabled', Boolean),
    Column('hashed_password', String),
)
todos = Table(
    'todos',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('username', String, ForeignKey('users.username')),
    Column('text', String(255)),
)
notes = Table(
    'notes',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('username', String, ForeignKey('users.username'), unique=True),
    Column('text', String(4000)),
)
files = Table(
    'files',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('username', String, ForeignKey('users.username')),
    Column('filename', String),
)
events = Table(
    'events',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('username', String, ForeignKey('users.username')),
    Column('text', String(255)),
    Column('datetime', DateTime),
)


database = Database(DATABASE_URI)
