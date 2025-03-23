from fastapi import FastAPI, APIRouter
from pydantic import BaseModel
from .models import BettingAggressiveness

router = APIRouter()


@router.post('/start')
async def start(
    betting_style: BettingAggressiveness
):
    return {'success': True}


@router.post('/end')
async def end():
    return {'success': True}




