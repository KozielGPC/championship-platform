from fastapi import FastAPI, APIRouter
from api.routers import routes

app = FastAPI()
for route in routes.routes:
    app.include_router(route)

if __name__ == "__main__":
    app.run()
