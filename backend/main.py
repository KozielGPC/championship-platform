from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from api.routers import routes
from dotenv import load_dotenv
import uvicorn
import os

from api.websocket.connection_manager import ws_manager

from tests.websocket_test_chat import router as websocket_test_routes
from api.websocket.websocket_endpoint import router as websocket_routes

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


for route in routes.routes:
    app.include_router(route)

app.include_router(websocket_test_routes)
app.include_router(websocket_routes)


@app.get("/")
async def index():
    return {"api_status": "ok"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
