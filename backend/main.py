from fastapi import FastAPI, APIRouter
from models import models
from database.config import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
async def first():
    return "hello world"


app.include_router(router.router, prefix="/user", tags=["user"])
