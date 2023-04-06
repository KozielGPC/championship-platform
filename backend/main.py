from fastapi import FastAPI, APIRouter

from api.models import users
from api.database.config import engine

users.Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
async def first():
    return "hello world"


# app.include_router(router.router, prefix="/user", tags=["user"])
