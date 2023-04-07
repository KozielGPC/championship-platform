from fastapi import FastAPI, APIRouter

from api.models import users
from api.database.config import engine
from api.routers import routes


users.Base.metadata.create_all(bind=engine)

app = FastAPI()
for route in routes.routes:
    app.include_router(route)
