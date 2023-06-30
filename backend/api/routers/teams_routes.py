from api.database.config import Session, engine

from api.schemas.teams import (
    Response,
    TeamInput,
    TeamSchema,
    AddUserToTeamInput,
    AddUserToTeamReturn,
    TeamUpdateRequest,
    AcceptTeamInviteInput,
)
from api.schemas.notifications import NotificationSchema
from api.models.teams import Team
from api.models.users import User
from api.models.games import Game
from api.models.notifications import Notification
from api.models.team_has_users import TeamsHasUsers
from api.utils.auth_services import get_password_hash, oauth2_scheme, get_current_user
from fastapi import APIRouter, HTTPException, Depends
from typing import Annotated
from sqlalchemy.orm import joinedload
from api.schemas.championships_has_teams import TeamsWithRelations, ChampionshipWithTeams
from api.schemas.teams_has_users import UserWithTeams
from fastapi.encoders import jsonable_encoder
from api.websocket.connection_manager import ws_manager
from api.schemas.teams import RemoveUserFromTeamReturn

router = APIRouter(
    prefix="/teams",
    tags=["teams"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Team Not Found"}},
)

session = Session(bind=engine)


@router.get(
    "/",
    response_model=list[TeamsWithRelations],
    response_description="Sucesso de resposta da aplicação.",
)
async def getAll(skip: int = 0, limit: int = 100):
    teams = (
        session.query(Team)
        .options(joinedload(Team.championships), joinedload(Team.users))
        .offset(skip)
        .limit(limit)
        .all()
    )
    return jsonable_encoder(teams)


@router.get(
    "/{id}",
    response_model=TeamsWithRelations,
    response_description="Sucesso de resposta da aplicação.",
)
async def getById(id: int):
    team = (
        session.query(Team)
        .options(joinedload(Team.championships), joinedload(Team.users))
        .filter(Team.id == id)
        .first()
    )
    if team == None:
        raise HTTPException(status_code=404, detail="Team not found")
    return jsonable_encoder(team)


@router.post(
    "/create",
    status_code=201,
    response_model=TeamsWithRelations,
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

    admin_input = TeamsHasUsers(team_id=team_input.id, user_id=user.id)
    session.add(admin_input)
    session.commit()
    session.refresh(admin_input)

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
    "/accept-invite",
    status_code=200,
    response_model=AddUserToTeamReturn,
    response_description="Sucesso de resposta da aplicação.",
)
async def addUserToTeam(input: AcceptTeamInviteInput, token: Annotated[str, Depends(oauth2_scheme)]):
    user = await get_current_user(token)
    notification = session.query(Notification).filter(Notification.id == input.notification_id).first()
    if notification == None:
        raise HTTPException(status_code=404, detail="Notification not found")
    if notification.reference_user_id != user.id:
        raise HTTPException(status_code=401, detail="Notification is not from this user")

    if input.accepted == True:
        player = session.query(User).filter(User.id == notification.reference_user_id).first()
        if player == None:
            raise HTTPException(status_code=404, detail="Player not found")
        team = session.query(Team).filter(Team.id == notification.team_id).first()
        if team == None:
            raise HTTPException(status_code=404, detail="Team not found")
        team_has_user = (
            session.query(TeamsHasUsers)
            .filter(
                TeamsHasUsers.user_id == notification.reference_user_id,
                TeamsHasUsers.team_id == notification.team_id,
            )
            .first()
        )
        if team_has_user != None:
            raise HTTPException(status_code=400, detail="Player is already registered in this Team")

        data = TeamsHasUsers(
            user_id=notification.reference_user_id,
            team_id=notification.team_id,
        )

        notification.visualized = True

        session.add(data)
        session.commit()
        session.refresh(notification)
        session.refresh(data)

        return notification

    else:
        notification.visualized = True
        session.commit()
        return notification


@router.post(
    "/invite-user",
    status_code=200,
    response_model=NotificationSchema,
    response_description="Sucesso de resposta da aplicação.",
)
async def inviteUserToTeam(input: AddUserToTeamInput, token: Annotated[str, Depends(oauth2_scheme)]):
    user = await get_current_user(token)
    player = session.query(User).filter(User.id == input.user_id).first()
    if player == None:
        raise HTTPException(status_code=404, detail="Player not found")
    team = session.query(Team).filter(Team.id == input.team_id).first()
    if team == None:
        raise HTTPException(status_code=404, detail="Team not found")
    if team.owner_id != user.id:
        raise HTTPException(status_code=401, detail="User is not admin of Team")
    team_has_user = (
        session.query(TeamsHasUsers)
        .filter(
            TeamsHasUsers.user_id == input.user_id,
            TeamsHasUsers.team_id == input.team_id,
        )
        .first()
    )
    if team_has_user != None:
        raise HTTPException(status_code=400, detail="Player is already registered in this Team")

    data = Notification(
        team_name=team.name,
        sender_name=user.username,
        reference_user_id=player.id,
        team_id=team.id,
        visualized=False,
    )

    ws_manager.send_personal_message("new-notification", input.user_id)
    session.add(data)
    session.commit()
    session.refresh(data)

    return data


@router.post(
    "/remove-user",
    status_code=200,
    response_model=RemoveUserFromTeamReturn,
    response_description="Sucesso de resposta da aplicação.",
)
async def addUserToTeam(input: AddUserToTeamInput, token: Annotated[str, Depends(oauth2_scheme)]):
    user = await get_current_user(token)
    player = session.query(User).filter(User.id == input.user_id).first()
    if player == None:
        raise HTTPException(status_code=404, detail="Player not found")
    team = session.query(Team).filter(Team.id == input.team_id).first()
    if team == None:
        raise HTTPException(status_code=404, detail="Team not found")
    if team.owner_id != user.id and player.id != user.id:
        raise HTTPException(status_code=401, detail="User is not the team admin or is not the user to be deleted")

    team_has_user = (
        session.query(TeamsHasUsers)
        .filter(
            TeamsHasUsers.user_id == input.user_id,
            TeamsHasUsers.team_id == input.team_id,
        )
        .first()
    )
    if team_has_user == None:
        raise HTTPException(status_code=404, detail="User isn't registered in this Team")

    session.delete(team_has_user)
    session.commit()

    return team_has_user
