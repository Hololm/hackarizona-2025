from fastapi import FastAPI, APIRouter
from pragmatic_blackjack import Table
from pydantic import BaseModel
from .models import StartSession, EndSession
from ...core.session import Session, active_sessions
import uuid

router = APIRouter()

@router.post('/start')
async def start(data: StartSession):
    #: TODO: integrate ml model and other handles to play game, can register such receiving handles in .ws/__init__.py
    table = Table(data.table_id, data.session_id)
    new_session_id = str(uuid.uuid4())

    active_sessions[new_session_id] = Session(table=table)

    return {'session_id': new_session_id}


@router.post('/end')
async def end(data: EndSession):
    if data.session_id not in active_sessions:
        return {'success': False, 'message': 'Session not found.'}

    del active_sessions[data.session_id]
    #: TODO: end table (standup or disconnect)

    return {'success': True}




