from fastapi import APIRouter, HTTPException, Path, Depends
from .config import Session
from sqlalchemy.orm import Session
from .schemas import *

router = APIRouter()


def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()
