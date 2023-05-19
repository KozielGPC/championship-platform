from typing import List, Optional, Generic, TypeVar
from pydantic import BaseModel, Field, validator
from pydantic.generics import GenericModel
from datetime import datetime
from enum import Enum


T = TypeVar("T")


class EnumFormat(str, Enum):
    chaveamento = "chaveamento"
    pontos_corridos = "pontos_corridos"


class EnumVisibility(Enum):
    publico = "publico"
    privado = "privado"


class ChampionshipSchema(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    start_time: Optional[datetime] = None
    created_at: Optional[datetime] = None
    min_teams: Optional[int] = None
    max_teams: Optional[int] = None
    prizes: Optional[str] = None
    format: EnumFormat
    rules: Optional[str] = None
    contact: Optional[str] = None
    visibility: EnumVisibility
    game_id: Optional[int] = Field(default=None, foreign_key="games.id")
    admin_id: Optional[int] = Field(default=None, foreign_key="users.id")

    class Config:
        orm_mode = True
        use_enum_values = True





class ChampionshipInput(ChampionshipSchema):
    name: str
    start_time: datetime
    min_teams: int
    max_teams: int
    prizes: str
    format: EnumFormat
    rules: str
    contact: str
    visibility: EnumVisibility
    game_id: int

    class Config:
        orm_mode = True
        use_enum_values = True


class AddTeamToChampionshipInput(BaseModel):
    team_id: int
    championship_id: int

    @validator("*")
    def check_positive_numbers(cls, v):
        assert v >= 0, "Negative numbers are not allowed."
        return v

    class Config:
        orm_mode = True


class AddTeamToChampionshipReturn(BaseModel):
    team_id: int
    championship_id: int

    class Config:
        orm_mode = True


class Response(GenericModel, Generic[T]):
    code: str
    status: str
    message: str
    result: Optional[T]


class FindManyChampionshipFilters(BaseModel):
    game_id: Optional[int]
    format: Optional[EnumFormat]
    min_teams: Optional[int]
    max_teams: Optional[int]

    class Config:
        orm_mode = True
        use_enum_values = True
