from api.database.config import Session, engine
from api.schemas.championships import Response, ChampionshipInput, ChampionshipSchema, FindManyChampionshipFilters
from api.models.championships import Championship
from api.models.games import Game
from api.utils.auth_services import get_password_hash, oauth2_scheme, get_current_user
from fastapi import APIRouter, HTTPException, Depends
from typing import Annotated
from fastapi.encoders import jsonable_encoder


router = APIRouter(
    prefix="/championships",
    tags=["championships"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Championships Not Found"}},
)

session = Session(bind=engine)


@router.get(
    "/",
    response_model=list[ChampionshipSchema],
    response_description="Sucesso de resposta da aplicação.",
)
async def getAll(filters: FindManyChampionshipFilters | None=None, skip: int = 0, limit: int = 100):
    query = session.query(Championship)
    
    """if filters is not None:
        if filters.game_id is not None:
            query.filter(Championship.game_id  == filters.game_id) 
        if filters.max_teams is not None:
            query.filter(Championship.max_teams <= filters.max_teams)      
        if filters.min_teams is not None:
            query.filter(Championship.min_teams >= filters.min_teams) 
        if filters.format is not None:
            query.filter(Championship.format == filters.format)  """
            
    for i, filt in enumerate(filters, 1):
        if filt is not None:
            d = {'filter{}'.format(i): filt}
            query = query.filter(**d)
            
    print("INICIO\n\n\n\n")
    print (query) 
    print("FIM\n\n\n\n")                  
    championships = query.offset(skip).limit(limit).all()

    return jsonable_encoder(championships)

@router.get(
    "/{id}",
    response_model=ChampionshipSchema,
    response_description="Sucesso de resposta da aplicação.",
)
async def getById(id: int):
    championship = session.query(Championship).filter(Championship.id == id).first()
    if championship == None:
        raise HTTPException(status_code=404, detail="Championship not found")
    return jsonable_encoder(championship)


@router.post(
    "/create",
    status_code=201,
    response_model=ChampionshipSchema,
    response_description="Sucesso de resposta da aplicação.",
)
async def create(data: ChampionshipInput, token: Annotated[str, Depends(oauth2_scheme)]):
    # Falta fazer as validações para criar o time
    # if user:
    #    raise HTTPException(status_code=400, detail="Championship with this name already exists")
    user = await get_current_user(token)
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
        "prizes": championship_input.prizes
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
        raise HTTPException(
            status_code=404, detail="Championship not found or You aren't the admin of the championship"
        )

    session.delete(championship)
    session.commit()

    return jsonable_encoder(championship)
