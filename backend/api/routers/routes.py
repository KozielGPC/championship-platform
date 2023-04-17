from .users_routes import router as users_router
from .teams_routes import router as teams_router

routes = [users_router, teams_router]
