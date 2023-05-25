from api.database.config import Session, engine
from api.schemas.teams import (
    Response,
    TeamInput,
    TeamSchema,
    TeamUpdateRequest,
    AddPlayerToTeamReturn,
    AddPlayerToTeamInput,
)
from api.models.teams import Team
from api.models.games import Game
from api.models.users import User
from api.utils.auth_services import get_password_hash, oauth2_scheme, get_current_user
from fastapi import APIRouter, HTTPException, Depends
from typing import Annotated
from sqlalchemy.orm import joinedload
from api.schemas.championships_has_teams import TeamsWithChampionships
from api.websocket.connection_manager import sio_server

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


@router.post(
    "/add-player",
    status_code=200,
    response_model=bool,
    response_description="Sucesso de resposta da aplicação.",
)
async def addPlayerToTeam(input: AddPlayerToTeamInput, token: Annotated[str, Depends(oauth2_scheme)]):
    user = await get_current_user(token)
    team = session.query(Team).filter(Team.id == input.team_id).first()
    # if team == None:
    #     raise HTTPException(status_code=404, detail="Team not found")
    # player = session.query(User).filter(User.id == input.player_id).first()
    # if player == None:
    #     raise HTTPException(status_code=404, detail="Player not found")

    # if team.owner_id != user.id:
    #     raise HTTPException(status_code=401, detail="User is not Team owner")

    # Verificar se usuario ja está na equipe
    # championship_has_team = (
    #     session.query(ChampionshipsHasTeams)
    #     .filter(
    #         ChampionshipsHasTeams.championship_id == input.championship_id,
    #         ChampionshipsHasTeams.team_id == input.team_id,
    #     )
    #     .first()
    # )
    # if championship_has_team != None:
    #     raise HTTPException(status_code=400, detail="Team is already registered in this Championship")

    # data = ChampionshipsHasTeams(
    #     championship_id=input.championship_id,
    #     team_id=input.team_id,
    # )
    # session.add(data)
    # session.commit()
    # session.refresh(data)

    message = {"message": "Hello!"}
    user_id = 1

    await sio_server.emit("teste")
    return True
