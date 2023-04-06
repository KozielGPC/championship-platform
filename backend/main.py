from fastapi import FastAPI, APIRouter

from api.models import users
from api.database.config import engine
from api.controllers import route_users


users.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(route_users.router)


@app.get("/")
async def first():
    return "hello world"


# app.include_router(router.router, prefix="/user", tags=["user"])
