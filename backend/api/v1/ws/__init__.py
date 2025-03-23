from fastapi import WebSocket, APIRouter, WebSocketDisconnect
from pragmatic_blackjack import Table, Event
import asyncio
from .game_handler import GameHandler

router = APIRouter()


@router.websocket("/v1/ws")
async def websocket_endpoint(
        session_id: str,
        table_id: str,
        websocket: WebSocket
):
    table = Table(table_id, session_id)
    await websocket.accept()

    def transfer_messages(event: Event):
        data = event.model_dump_json()
        asyncio.create_task(websocket.send_text(data))

    table.handle_all(transfer_messages)

    handler = GameHandler()
    table.register(handler)

    asyncio.create_task(table.connect())

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        table.disconnect()