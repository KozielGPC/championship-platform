from fastapi import APIRouter, HTTPException, Path, Depends
from .config import SessionLocal
from sqlalchemy.orm import Session
from .schemas import *
from . import *

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
async def get(db: Session = Depends(get_db)):
    _users = crud.get_users(db, 0, 100)
    return Response(code=200, status="Ok", message="Success", result=_users).dict(exclude_none=True)
