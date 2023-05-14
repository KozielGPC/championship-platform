from typing import List, Optional, Generic, TypeVar
from pydantic import BaseModel, Field, validator
from pydantic.generics import GenericModel
from datetime import datetime, timedelta, timezone
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

    @validator('name')
    def name_length(cls, v):
        if len(v) < 5 or len(v) > 100:
            raise ValueError('O nome do campeonato deve ter entre 5 e 100 caracteres')
        if not v.strip():
            raise ValueError('O nome do campeonato não pode ser composto apenas por espaços em branco')
        return v

    @validator('start_time')
    def start_time_not_past(cls, v):
        if v.replace(tzinfo=timezone(offset=timedelta())) < datetime.now().replace(tzinfo=timezone(offset=timedelta())):
            raise ValueError('A data de início do campeonato não pode ser no passado')
        return v

    @validator('min_teams')
    def min_teams_greater_than_zero(cls, v):
        if v <= 1:
            raise ValueError('O número mínimo de times deve ser maior que um')
        return v

    @validator('max_teams')
    def max_teams_greater_than_min_teams(cls, v, values):
        if 'min_teams' in values and v < values['min_teams']:
            raise ValueError('O número máximo de times deve ser maior ou igual ao número mínimo de times')
        return v

    @validator('format')
    def format_is_chaveamento_when_max_teams_is_not_power_of_two(cls, v, values):
        if 'max_teams' in values and (not (values['max_teams'] & (values['max_teams'] - 1) == 0) and v == EnumFormat.chaveamento):
            raise ValueError('O formato do campeonato deve ser chaveamento quando o número máximo de times não é potência de dois')
        return v

    class Config:
        orm_mode = True
        use_enum_values = True
    

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