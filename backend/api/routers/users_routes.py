from api.database.config import Session, engine
from api.schemas.users import Response, UserInput, UserSchema, UserUpdateRequest
from api.models.users import User
from api.utils.auth_services import get_password_hash, oauth2_scheme, get_current_user
from fastapi import APIRouter, HTTPException, Depends
from typing import Annotated
from api.models.team_has_users import TeamsHasUsers
from api.schemas.teams_has_users import UserWithTeams
from fastapi.encoders import jsonable_encoder
from api.schemas.notifications import NotificationSchema
from api.models.notifications import Notification

router = APIRouter(
    prefix="/users",
    tags=["users"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "User Not Found"}},
)

session = Session(bind=engine)


@router.get(
    "/",
    response_model=list[UserWithTeams],
    response_description="Sucesso de resposta da aplicação.",
)
async def getAll(token: Annotated[str, Depends(oauth2_scheme)], skip: int = 0, limit: int = 100):
    return session.query(User).offset(skip).limit(limit).all()


@router.get(
    "/{id}",
    response_model=UserWithTeams,
    response_description="Sucesso de resposta da aplicação.",
)
async def getById(id: int, token: Annotated[str, Depends(oauth2_scheme)]):
    user = session.query(User).filter(User.id == id).first()
    if user == None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post(
    "/create",
    status_code=201,
    response_model=UserSchema,
    response_description="Sucesso de resposta da aplicação.",
)
async def create(data: UserInput):
    user = session.query(User).filter(User.username == data.username).first()
    if user:
        raise HTTPException(status_code=400, detail="User with this username already exists")
    hashed_password = get_password_hash(data.password)
    user_input = User(username=data.username, password=hashed_password, email=data.email)
    session.add(user_input)
    session.commit()
    session.refresh(user_input)
    response = {
        "id": user_input.id,
        "username": user_input.username,
        "email": user_input.email,
        "password": user_input.password,
    }
    return response


@router.put(
    "/update/{id}", status_code=200, response_model=UserSchema, response_description="Sucesso de resposta da aplicação."
)
async def update(id: int, update_request: UserUpdateRequest, token: Annotated[str, Depends(oauth2_scheme)]):
    logged_user = await get_current_user(token)
    user = session.query(User).filter(User.id == id).first()

    if user == None:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id != logged_user.id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if update_request.username:
        user_exists = session.query(User).filter(User.username == update_request.username).first()
        if user_exists == None:
            raise HTTPException(status_code=400, detail="User with this username already exists")

    if update_request.password:
        update_request.password = get_password_hash(update_request.password)

    update_data = update_request.dict(exclude_unset=True)
    for key, value in update_data.items():
        if getattr(user, key) != value:
            setattr(user, key, value)
    session.commit()

    return user


@router.delete(
    "/delete/{id}",
    status_code=200,
    response_model=UserSchema,
    response_description="Sucesso de resposta da aplicação.",
)
async def delete(id: int, token: Annotated[str, Depends(oauth2_scheme)]):
    user = session.query(User).filter(User.id == id).first()
    if user == None:
        raise HTTPException(status_code=404, detail="User not found")

    session.delete(user)

    session.commit()

    return user


@router.get(
    "/me/notifications",
    response_model=list[NotificationSchema],
    response_description="Sucesso de resposta da aplicação.",
)
async def getAllNotificationsFromUser(token: Annotated[str, Depends(oauth2_scheme)], skip: int = 0, limit: int = 100):
    user = await get_current_user(token)
    query = session.query(Notification)
    notifications = query.filter(Notification.reference_user_id == user.id).offset(skip).limit(limit).all()

    return jsonable_encoder(notifications)
