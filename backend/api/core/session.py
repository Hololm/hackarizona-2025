from pydantic import BaseModel
from fastapi import WebSocket
from pragmatic_blackjack import Table


class Session(BaseModel):
    table: Table
    websocket: WebSocket = None

active_sessions: dict[str, Session] = {}