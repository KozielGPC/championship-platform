from api.database.config import Session, engine
from typing import List
from api.schemas.championships import (
    Response,
    ChampionshipInput,
    ChampionshipSchema,
    AddTeamToChampionshipInput,
    AddTeamToChampionshipReturn,
    ChampionshipUpdateRequest,
)
from api.models.championships import Championship
from api.models.championships_has_teams import ChampionshipsHasTeams
from api.models.games import Game
from api.models.teams import Team
from api.utils.auth_services import get_password_hash, oauth2_scheme, get_current_user
from fastapi import APIRouter, HTTPException, Depends
from typing import Annotated
from fastapi.encoders import jsonable_encoder
from sqlalchemy import Enum, func
from sqlalchemy.orm import joinedload
from api.schemas.championships_has_teams import ChampionshipWithTeams
from api.schemas.matches import MatchSchema
from api.models.matches import Match


router = APIRouter(
    prefix="/championships",
    tags=["championships"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Championships Not Found"}},
)

session = Session(bind=engine)


@router.get(
    "/",
    response_model=list[ChampionshipWithTeams],
    response_description="Sucesso de resposta da aplicação.",
)
async def getAll(
    game_id: int = None,
    admin_id: int = None,
    max_teams: int = None,
    min_teams: int = None,
    format: str = None,
    name: str = None,
    skip: int = 0,
    limit: int = 100,
):
    query = session.query(Championship)

    if game_id is not None:
        query = query.filter(Championship.game_id == game_id)
    if max_teams is not None and isinstance(max_teams, int):
        query = query.filter(Championship.max_teams == max_teams)
    if min_teams is not None and isinstance(min_teams, int):
        query = query.filter(Championship.min_teams == min_teams)
    if format is not None and isinstance(format, str):
        query = query.filter(Championship.format == format)
    if admin_id is not None and isinstance(admin_id, int):
        query = query.filter(Championship.admin_id == admin_id)
    if name is not None:
        query = query.filter(func.lower(Championship.name).like(f"%{name.lower()}%"))

    championships = query.options(joinedload(Championship.teams), joinedload(Championship.matches)).offset(skip).limit(limit).all()

    return jsonable_encoder(championships)


@router.get(
    "/{id}",
    response_model=ChampionshipWithTeams,
    response_description="Sucesso de resposta da aplicação.",
)
async def getById(id: int):
    championship = (
        session.query(Championship).options(joinedload(Championship.teams), joinedload(Championship.matches)).filter(Championship.id == id).first()
    )
    if championship == None:
        raise HTTPException(status_code=404, detail="Championship not found")
    return jsonable_encoder(championship)


@router.get(
    "/{id}/matches",
    response_model=List[MatchSchema],
    response_description="Success response from the application."
)
async def getMatches(id: int,  skip: int = 0, limit: int = 100):
    session = Session()

    championship = (
        session.query(Championship)
        .filter(Championship.id == id)
        .first()
    )
    if championship is None:
        raise HTTPException(status_code=404, detail="Championship not found")

    matches = (
        session.query(Match)
        .filter(Match.championship_id == id)
        .offset(skip)
        .limit(limit)
        .all()
    )

    if not matches:
        raise HTTPException(status_code=404, detail="Matches not found")
    return matches

@router.post(
    "/create",
    status_code=201,
    response_model=ChampionshipSchema,
    response_description="Sucesso de resposta da aplicação.",
)
async def create(data: ChampionshipInput, token: Annotated[str, Depends(oauth2_scheme)]):
    camp = session.query(Championship).filter(Championship.name == data.name).first()
    if camp != None:
        raise HTTPException(status_code=400, detail="Championship with this name already exists")
    user = await get_current_user(token)
    game = session.query(Game).filter(Game.id == data.game_id).first()
    if game == None:
        raise HTTPException(status_code=404, detail="Game not found")

    championship_input = Championship(
        name=data.name,
        start_time=data.start_time,
        min_teams=data.min_teams,
        max_teams=data.max_teams,
        format=data.format,
        rules=data.rules,
        contact=data.contact,
        visibility=data.visibility,
        admin_id=user.id,
        game_id=data.game_id,
        prizes=data.prizes,
    )
    session.add(championship_input)
    session.commit()
    session.refresh(championship_input)
    response = {
        "id": championship_input.id,
        "name": championship_input.name,
        "start_time": championship_input.start_time,
        "min_teams": championship_input.min_teams,
        "max_teams": championship_input.max_teams,
        "format": championship_input.format,
        "rules": championship_input.rules,
        "contact": championship_input.contact,
        "visibility": championship_input.visibility,
        "admin_id": championship_input.admin_id,
        "game_id": championship_input.game_id,
        "prizes": championship_input.prizes,
    }
    return jsonable_encoder(response)


@router.delete(
    "/delete/{id}",
    status_code=200,
    response_model=ChampionshipSchema,
    response_description="Sucesso de resposta da aplicação.",
)
async def delete(id: int, token: Annotated[str, Depends(oauth2_scheme)]):
    user = await get_current_user(token)
    championship = session.query(Championship).filter(Championship.id == id, user.id == Championship.admin_id).first()
    if championship == None:
        raise HTTPException(status_code=404, detail="Championship not found or You isn't the admin of the championship")

    session.delete(championship)
    session.commit()

    return jsonable_encoder(championship)


@router.put(
    "/update/{id}",
    status_code=200,
    response_model=ChampionshipSchema,
    response_description="Sucesso de resposta da aplicação.",
)
async def update(id: int, update_request: ChampionshipUpdateRequest, token: Annotated[str, Depends(oauth2_scheme)]):
    user = await get_current_user(token)
    championship = session.query(Championship).filter(Championship.id == id, user.id == Championship.admin_id).first()

    if championship is None:
        raise HTTPException(
            status_code=404, detail="Championship not found or You aren't the admin of the championship"
        )

    if update_request.name:
        championship_exists = (
            session.query(Championship).filter(Championship.name == update_request.name, Championship.id != id).first()
        )
        if championship_exists:
            raise HTTPException(status_code=400, detail="Championship with this name already exists")

    if update_request.max_teams and update_request.min_teams is not None:
        if championship.min_teams > update_request.max_teams:
            raise HTTPException(status_code=400, detail="Max Teams cannot be less than Min Teams")

    if update_request.min_teams and update_request.max_teams is not None:
        if championship.max_teams < update_request.min_teams:
            raise HTTPException(status_code=400, detail="Min Teams cannot be greater than Max Teams")

    update_data = update_request.dict(exclude_unset=True)

    enum_fields = [f.name for f in Championship.__table__.columns if isinstance(f.type, Enum)]
    for key, value in update_data.items():
        if key in enum_fields:
            enum_class = type(getattr(Championship, key).property.columns[0].type)
            update_data[key] = enum_class(value)

        setattr(championship, key, value)

    session.commit()
    session.refresh(championship)

    return jsonable_encoder(championship)


@router.post(
    "/add-team",
    status_code=200,
    response_model=AddTeamToChampionshipReturn,
    response_description="Sucesso de resposta da aplicação.",
)
async def addTeamToChampionship(
    input: AddTeamToChampionshipInput,
    token: Annotated[str, Depends(oauth2_scheme)]
):
    user = await get_current_user(token)
    championship = session.query(Championship).filter(Championship.id == input.championship_id).first()
    if championship is None:
        raise HTTPException(status_code=404, detail="Championship not found")
    
    team = session.query(Team).filter(Team.id == input.team_id).first()
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")

    if team.owner_id != user.id and championship.admin_id != user.id:
        raise HTTPException(status_code=401, detail="User is not the admin of the Team or the Championship")
    
    if team.game_id != championship.game_id:
        raise HTTPException(status_code=400, detail="Team is not from the same Game as the Championship")
    
    quant = (
        session.query(ChampionshipsHasTeams)
        .filter(
            ChampionshipsHasTeams.championship_id == input.championship_id
        )
        .count()
    )
    if quant >= championship.max_teams:
        raise HTTPException(status_code=400, detail="Championship is already full")

    championship_has_team = (
        session.query(ChampionshipsHasTeams)
        .filter(
            ChampionshipsHasTeams.championship_id == input.championship_id,
            ChampionshipsHasTeams.team_id == input.team_id,
        )
        .first()
    )
    if championship_has_team is not None:
        raise HTTPException(status_code=400, detail="Team is already registered in this Championship")

    data = ChampionshipsHasTeams(
        championship_id=input.championship_id,
        team_id=input.team_id,
    )
    session.add(data)
    session.commit()
    session.refresh(data)

    return data



@router.post(
    "/remove-team",
    status_code=200,
    response_model=AddTeamToChampionshipReturn,
    response_description="Sucesso de resposta da aplicação.",
)
async def addTeamToChampionship(input: AddTeamToChampionshipInput, token: Annotated[str, Depends(oauth2_scheme)]):
    user = await get_current_user(token)
    championship = session.query(Championship).filter(Championship.id == input.championship_id).first()
    if championship == None:
        raise HTTPException(status_code=404, detail="Championship not found")
    team = session.query(Team).filter(Team.id == input.team_id).first()
    if team == None:
        raise HTTPException(status_code=404, detail="Team not found")
    if team.owner_id != user.id and championship.admin_id != user.id:
        raise HTTPException(status_code=401, detail="User is not admin of Team or of the Championship")
    if team.game_id != championship.game_id:
        raise HTTPException(status_code=400, detail="Team is not of the same Game as the Championship")

    championship_has_team = (
        session.query(ChampionshipsHasTeams)
        .filter(
            ChampionshipsHasTeams.championship_id == input.championship_id,
            ChampionshipsHasTeams.team_id == input.team_id,
        )
        .first()
    )
    if championship_has_team == None:
        raise HTTPException(status_code=404, detail="Team isn't registered in this Championship")

    session.delete(championship_has_team)
    session.commit()

    return championship_has_team
