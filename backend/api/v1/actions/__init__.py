from fastapi import FastAPI, APIRouter
from pydantic import BaseModel
from .models import StartSession, EndSession
import uuid

router = APIRouter()

@router.post('/start')
async def start(data: StartSession):
    #: use grpc to send off start job for

    return {'session_id': str(uuid.uuid4())}


@router.post('/end')
async def end(data: EndSession):
    # if session id from data is in mem cache:
    # return success true
    # otherwise return false
    return {'success': True}




