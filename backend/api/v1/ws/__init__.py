from fastapi import FastAPI, WebSocket, APIRouter


router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        await websocket.receive_text()

        message = None  #: should be Dealer dataclass
        #: serialize message to JSON
        #: send message to client

        await websocket.send_text()


response = websocket_endpoint('/ws')

response.id


    {
        id = 123,
        name = 'dealer',
    }