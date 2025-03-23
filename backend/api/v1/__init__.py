from fastapi import APIRouter
from .actions import router as actions_router


router = APIRouter()
router.include_router(actions_router)