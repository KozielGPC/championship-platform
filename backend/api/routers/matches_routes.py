from typing import List
from api.database.config import Session, engine

from api.schemas.matches import Response, MatchInput, MatchSchema, MatchUpdateRequest
from api.models.matches import Match
from api.models.championships import Championship
from api.models.teams import Team
from api.utils.auth_services import get_password_hash, oauth2_scheme, get_current_user
from fastapi import APIRouter, HTTPException, Depends
from typing import Annotated
from fastapi.encoders import jsonable_encoder
from sqlalchemy import Enum, func
from sqlalchemy.orm import joinedload


router = APIRouter(
    prefix="/matches",
    tags=["matches"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Matches Not Found"}},
)

session = Session(bind=engine)


@router.get(
    "/",
    response_model=list[MatchSchema],
    response_description="Sucesso de resposta da aplicação.",
)
async def getAll(
    id: int = None,
    championship_id: int = None,
    team_1_id: int = None,
    team_2_id: int = None,
    winner_team_id: int = None,
    bracket: int = None,
    round: int = None,
    result: str = None,
    skip: int = 0,
    limit: int = 100,
):
    query = session.query(Match)

    if id is not None:
        query = query.filter(Match.id == id)
    if championship_id is not None:
        query = query.filter(Match.championship_id == championship_id)
    if team_1_id is not None:
        query = query.filter(Match.team_1_id == team_1_id)
    if team_2_id is not None:
        query = query.filter(Match.team_2_id == team_2_id)
    if winner_team_id is not None:
        query = query.filter(Match.winner_team_id == winner_team_id)
    if result is not None:
        query = query.filter(func.lower(Match.result).like(f"%{result.lower()}%"))
    if round is not None:
        query = query.filter(Match.round == round)
    if bracket is not None:
        query = query.filter(Match.bracket == bracket)

    Matches = query.offset(skip).limit(limit).all()

    return jsonable_encoder(Matches)


@router.get(
    "/{id}",
    response_model=MatchSchema,
    response_description="Sucesso de resposta da aplicação.",
)
async def getById(id: int):
    match = (
        session.query(Match)
        .options(joinedload(Match.team_1_id), joinedload(Match.team_2_id))
        .filter(Match.id == id)
        .first()
    )
    if match == None:
        raise HTTPException(status_code=404, detail="Match not found")
    return jsonable_encoder(match)


@router.post(
    "/create",
    status_code=201,
    response_model=MatchSchema,
    response_description="Sucesso de resposta da aplicação.",
)
async def create(data: MatchInput, token: Annotated[str, Depends(oauth2_scheme)]):
    part = session.query(Match).filter(Match.id == data.id).first()
    if part != None:
        raise HTTPException(status_code=400, detail="Match with this ID already exists")
    user = await get_current_user(token)
    time1 = session.query(Team).filter(Team.id == data.team_1_id).first()
    if time1 == None:
        raise HTTPException(status_code=404, detail="Team 1 not found")
    time2 = session.query(Team).filter(Team.id == data.team_2_id).first()
    if time2 == None:
        raise HTTPException(status_code=404, detail="Team 2 not found")
    championship = session.query(Championship).filter(Championship.id == data.championship_id).first()
    if championship == None:
        raise HTTPException(status_code=404, detail="Championship not found")

    match_input = Match(
        id=data.id,
        championship_id=data.championship_id,
        team_1_id=data.team_1_id,
        team_2_id=data.team_2_id,
        winner_team_id=data.winner_team_id,
        bracket=data.bracket,
        round=data.round,
        result=data.result,
    )
    session.add(match_input)
    session.commit()
    session.refresh(match_input)
    response = {
        "id": match_input.id,
        "championship_id": match_input.championship_id,
        "team_1_id": match_input.team_1_id,
        "team_2_id": match_input.team_2_id,
        "winner_team_id": match_input.winner_team_id,
        "bracket": match_input.bracket,
        "round": match_input.round,
        "result": match_input.result,
    }
    return jsonable_encoder(response)


# Vou deixar o delete comentado pq o Rafa disse que nao ia precisar, mas se no futuro precisar ja ta pronto
# @router.delete(
#    "/delete/{id}",
#    status_code=200,
#    response_model=MatchSchema,
#    response_description="Sucesso de resposta da aplicação.",
# )
# async def delete(id: int):
#   match = session.query(Match).filter(Match.id == id).first()
#    if match == None:
#        raise HTTPException(status_code=404, detail="Match not found")

#    session.delete(match)
#    session.commit()

#    return jsonable_encoder(match)


@router.put(
    "/update/{id}",
    status_code=200,
    response_model=MatchSchema,
    response_description="Sucesso de resposta da aplicação.",
)
async def update(id: int, update_request: MatchUpdateRequest, token: Annotated[str, Depends(oauth2_scheme)]):
    user = await get_current_user(token)
    match = session.query(Match).filter(Match.id == id).first()

    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")
    # winner round result
    #venc = (
    #    session.query(Team)
    #    .filter(Match.team_1_id == update_request.winner_team_id and Match.team_2_id == update_request.winner_team_id)
    #    .first()
    #)

    #if venc is None:
    #   raise HTTPException(status_code=404, detail="Team not found")

    if update_request.result == None:
        raise HTTPException(status_code=400, detail="Result cannot be None")

    update_data = update_request.dict(exclude_unset=True)
    for key, value in update_data.items():
        if getattr(match, key) != value:
            setattr(match, key, value)

    session.commit()
    session.refresh(match)

    return jsonable_encoder(match)
