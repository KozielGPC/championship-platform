from typing import List, Optional, Generic, TypeVar
from pydantic import BaseModel, Field
from pydantic.generics import GenericModel

T = TypeVar("T")

 
class TeamSchema(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    password: Optional[str] = None
    owner_id: Optional[int] = Field(default=None, foreign_key="users.id")
    game_id: Optional[int] = Field(default=None, foreign_key="games.id")

    class Config:
        orm_mode = True


class TeamInput(TeamSchema):
    name: str
    password: str
    owner_id: int
    game_id: int

    class Config:
        orm_mode = True


class Response(GenericModel, Generic[T]):
    code: str
    status: str
    message: str
    result: Optional[T]
