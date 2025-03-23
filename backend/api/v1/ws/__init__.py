from fastapi import FastAPI, WebSocket, APIRouter
from ...core.session import active_sessions

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(
        session_id: str,
        websocket: WebSocket
):
    await websocket.accept()

    if session_id not in active_sessions:
        await websocket.close()
        return

    session = active_sessions[session_id]
    session.websocket = websocket

    while True:
        await websocket.receive_text()

        message = None  #: should be Dealer dataclass
        #: serialize message to JSON
        #: send message to client

        await websocket.send_text()