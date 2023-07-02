from typing import List, Optional
from pydantic import BaseModel, Field, validator
from datetime import datetime


class GameSchema(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class GameInput(GameSchema):
    id: int
    name: str

    @validator("name")
    def check_empty_fields(cls, v):
        assert v != "", "Empty strings are not allowed."
        return v

    @validator("name")
    def check_spaced_fields(cls, v):
        assert v.strip(), "Empty strings are not allowed."
        return v

    class Config:
        orm_mode = True
