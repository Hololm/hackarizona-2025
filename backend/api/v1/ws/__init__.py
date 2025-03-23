from fastapi import WebSocket, APIRouter, WebSocketDisconnect, BackgroundTasks
from pragmatic_blackjack import Table, Event
import asyncio
from .game_handler import GameHandler, HandlerBase
import threading

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(
        session_id: str,
        table_id: str,
        websocket: WebSocket,
        background_task: BackgroundTasks,
        min_bet: int=5,
        max_bet: int=5,
):
    table = Table(table_id, session_id)
    await websocket.accept()

    def transfer_messages(event: Event):
        data = {
            "event": HandlerBase.__mapping__[type(event)],
            "data": event.model_dump()
        }
        asyncio.create_task(websocket.send_json(data))


    table.handle_all(transfer_messages)

    handler = GameHandler(table, websocket, min_bet, max_bet)
    table.register(handler)

    threading.Thread(target=table.connect).start()

    try:
        while True:
                await websocket.receive_text()
    except WebSocketDisconnect:
        table.disconnect()