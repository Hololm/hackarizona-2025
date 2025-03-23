from fastapi import FastAPI, APIRouter
from .models import StakeLogin, WebAppLogin

router = APIRouter(prefix="/login", tags=["login"])

@router.post('/auth')
async def login(auth: StakeLogin):
    return {'success': True}


@router.post('/stake')
async def login(auth: WebAppLogin):
    return {'success': True}




