from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from api.utils.auth_services import get_password_hash, oauth2_scheme, get_current_user
from typing import Annotated
from api.websocket.connection_manager import ws_manager as manager

router = APIRouter(
    prefix="/ws",
    tags=["websocket"],
    # dependencies=[Depends(get_token_header)],
)


#  token: Annotated[str, Depends(oauth2_scheme)]
@router.websocket("/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"You wrote: {data}", websocket)
            await manager.broadcast(f"Client #{client_id} says: {data}", client_id)
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
        await manager.broadcast(f"Client #{client_id} left the chat", client_id)
