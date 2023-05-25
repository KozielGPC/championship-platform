from api.database.config import Session, engine
from api.schemas.teams import Response, TeamInput, TeamSchema, TeamUpdateRequest
from api.models.teams import Team
from api.models.games import Game
from api.utils.auth_services import get_password_hash, oauth2_scheme, get_current_user
from fastapi import APIRouter, HTTPException, Depends
from typing import Annotated
from sqlalchemy.orm import joinedload
from api.schemas.championships_has_teams import TeamsWithChampionships

from fastapi.encoders import jsonable_encoder

router = APIRouter(
    prefix="/teams",
    tags=["teams"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Team Not Found"}},
)

session = Session(bind=engine)


@router.get(
    "/",
    response_model=list[TeamsWithChampionships],
    response_description="Sucesso de resposta da aplicação.",
)
async def getAll(skip: int = 0, limit: int = 100):
    teams = session.query(Team).options(joinedload(Team.championships)).offset(skip).limit(limit).all()
    return jsonable_encoder(teams)


@router.get(
    "/{id}",
    response_model=TeamsWithChampionships,
    response_description="Sucesso de resposta da aplicação.",
)
async def getById(id: int):
    team = session.query(Team).options(joinedload(Team.championships)).filter(Team.id == id).first()
    if team == None:
        raise HTTPException(status_code=404, detail="Team not found")
    return jsonable_encoder(team)


@router.post(
    "/create",
    status_code=201,
    response_model=TeamSchema,
    response_description="Sucesso de resposta da aplicação.",
)
async def create(data: TeamInput, token: Annotated[str, Depends(oauth2_scheme)]):
    team = session.query(Team).filter(Team.name == data.name).first()
    if team != None:
        raise HTTPException(status_code=400, detail="Team with this name already exists")

    game = session.query(Game).filter(Game.id == data.game_id).first()
    if game == None:
        raise HTTPException(status_code=404, detail="Game not Found")

    hashed_password = get_password_hash(data.password)
    user = await get_current_user(token)
    team_input = Team(name=data.name, password=hashed_password, owner_id=user.id, game_id=data.game_id)
    session.add(team_input)
    session.commit()
    session.refresh(team_input)
    return team_input


@router.put(
    "/update/{id}", status_code=200, response_model=TeamSchema, response_description="Sucesso de resposta da aplicação."
)
async def update(id: int, update_request: TeamUpdateRequest, token: Annotated[str, Depends(oauth2_scheme)]):
    user = await get_current_user(token)
    team = session.query(Team).filter(Team.id == id, user.id == Team.owner_id).first()

    if team == None:
        raise HTTPException(status_code=404, detail="Team not found or You aren't the owner of the team")

    if update_request.name:
        team_exists = session.query(Team).filter(Team.name == update_request.name, Team.id != id).first()
        if team_exists != None:
            raise HTTPException(status_code=400, detail="Team with this name already exists")

    if update_request.password:
        update_request.password = get_password_hash(update_request.password)

    update_data = update_request.dict(exclude_unset=True)
    for key, value in update_data.items():
        if getattr(team, key) != value:
            setattr(team, key, value)
    session.commit()

    return team


@router.delete(
    "/delete/{id}",
    status_code=200,
    response_model=TeamSchema,
    response_description="Sucesso de resposta da aplicação.",
)
async def delete(id: int, token: Annotated[str, Depends(oauth2_scheme)]):
    user = await get_current_user(token)
    team = session.query(Team).filter(Team.id == id, user.id == Team.owner_id).first()
    if team == None:
        raise HTTPException(status_code=404, detail="Team not found or You aren't the owner of the team")

    session.delete(team)
    session.commit()

    return user
