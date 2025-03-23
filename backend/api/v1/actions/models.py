from enum import Enum
from pydantic import BaseModel


class StartSession(BaseModel):
    table_id: str
    session_id: str


class EndSession(BaseModel):
    session_id: str