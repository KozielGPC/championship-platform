from api.database.config import Session, engine
from api.schemas.users import Response, UserInput, UserSchema
from api.models.users import User
from fastapi import APIRouter, Depends, status

from fastapi.encoders import jsonable_encoder

router = APIRouter(
    prefix="/users",
    tags=["users"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "User Not Found"}},
)

session = Session(bind=engine)


@router.get(
    "/",
    response_model=list[UserSchema],
    response_description="Sucesso de resposta da aplicação.",
)
async def getUsers(skip: int = 0, limit: int = 100):
    return session.query(User).offset(skip).limit(limit).all()


@router.post(
    "/create",
    status_code=status.HTTP_201_CREATED,
    response_model=UserSchema,
    response_description="Sucesso de resposta da aplicação.",
)
async def createUser(data: UserInput):
    user_input = User(username=data.username, password=data.password)
    session.add(user_input)
    session.commit()
    session.refresh(user_input)
    response = {"id": user_input.id, "username": user_input.username, "password": user_input.password}
    return response
