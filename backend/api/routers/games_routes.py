from api.database.config import Session, engine
from api.schemas.games import GameSchema
from api.models.games import Game
from fastapi import APIRouter, HTTPException, Depends
from fastapi.encoders import jsonable_encoder

router = APIRouter(
    prefix="/games",
    tags=["games"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Games Not Found"}},
)

session = Session(bind=engine)

@router.get(
    "/",
    response_model=list[GameSchema],
    response_description="Sucesso de resposta da aplicação.",
)

async def getAll(skip: int = 0, limit: int = 100):
    query = session.query(Game)
    games = query.offset(skip).limit(limit).all()

    return jsonable_encoder(games)
    
@router.get(
    "/{id}",
    response_model=GameSchema,
    response_description="Sucesso de resposta da aplicação.",
)
async def getById(id: int):
    game = session.query(Game).filter(Game.id == id).first()
    if game == None:
        raise HTTPException(status_code=404, detail="Game not found")
    return jsonable_encoder(game)

