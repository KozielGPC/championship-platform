from typing import List, Optional, Generic, TypeVar
from pydantic import BaseModel, Field, validator
from pydantic.generics import GenericModel
from datetime import datetime

T = TypeVar("T")


class TeamSchema(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    password: Optional[str] = None
    owner_id: Optional[int] = Field(default=None, foreign_key="users.id")
    game_id: Optional[int] = Field(default=None, foreign_key="games.id")
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True





class TeamInput(TeamSchema):
    name: str
    password: str
    game_id: int

    @validator("name", "password")
    def check_empty_fields(cls, v):
        assert v != "", "Empty strings are not allowed."
        return v

    @validator("name", "password")
    def check_spaced_fields(cls, v):
        assert v.strip(), "Empty strings are not allowed."
        return v

    @validator("game_id")
    def check_positive_numbers(cls, v):
        assert v >= 0, "Negative numbers are not allowed."
        return v

    class Config:
        orm_mode = True


class TeamUpdateRequest(BaseModel):
    name: Optional[str] = None
    password: Optional[str] = None

    @validator("*")
    def check_empty_fields(cls, v):
        assert v != "", "Empty strings are not allowed."
        return v

    @validator("*")
    def check_spaced_fields(cls, v):
        assert v.strip(), "Empty strings are not allowed."
        return v

    class Config:
        extra = "forbid"


class Response(GenericModel, Generic[T]):
    code: str
    status: str
    message: str
    result: Optional[T]
