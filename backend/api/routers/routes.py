from .users_routes import router as users_router
from .teams_routes import router as teams_router
from .auth_routes import router as auth_routes
from .championships_routes import router as championships_routes
from .games_routes import router as games_routes
from .matches_routes import router as matches_routes
routes = [users_router, teams_router, auth_routes, championships_routes, games_routes, matches_routes]
