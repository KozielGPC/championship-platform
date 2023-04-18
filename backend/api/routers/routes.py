from .users_routes import router as users_router
from .teams_routes import router as teams_router
from .auth_routes import router as auth_routes
from .championships_routes import router as championships_routes

routes = [users_router, teams_router, auth_routes, championships_routes]
