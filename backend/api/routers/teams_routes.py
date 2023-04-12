from api.schemas.users import Response, UserInput, UserSchema
from api.models.users import User
from fastapi import APIRouter, HTTPException

from fastapi.encoders import jsonable_encoder

router = APIRouter(
    prefix="/teams",
    tags=["teams"],
    responses={404: {"description": "Team Not Found"}},
)



@router.get(
    "/",
    response_model=list[UserSchema],
    response_description="Sucesso de resposta da aplicação.",
)
async def getAll(skip: int = 0, limit: int = 100):
    return session.query(User).offset(skip).limit(limit).all()


@router.get(
    "/{id}",
    response_model=UserSchema,
    response_description="Sucesso de resposta da aplicação.",
)
async def getById(id: int):
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
    user_input = User(username=data.username, password=data.password)
    session.add(user_input)
    session.commit()
    session.refresh(user_input)
    response = {"id": user_input.id, "username": user_input.username, "password": user_input.password}
    return response


@router.delete(
    "/delete/{id}",
    status_code=200,
    response_model=UserSchema,
    response_description="Sucesso de resposta da aplicação.",
)
async def delete(id: int):
    user = session.query(User).filter(User.id == id).first()
    if user == None:
        raise HTTPException(status_code=404, detail="User not found")

    session.delete(user)

    session.commit()

    return user
