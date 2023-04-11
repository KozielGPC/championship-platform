from api.database.config import Session, engine
from api.schemas.users import Token
from api.models.users import User
from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from api.utils.auth_services import create_access_token

ACCESS_TOKEN_EXPIRE_MINUTES = 30

from fastapi.encoders import jsonable_encoder

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "User Not Found"}},
)

session = Session(bind=engine)


@router.post("/token/{id}", response_model=Token)
async def getUserAccessToken(id: int):
    user = session.query(User).filter(User.id == id).first()
    if user == None:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}
