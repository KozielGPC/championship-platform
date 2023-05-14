from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime, Text
from sqlalchemy.orm import relationship
from api.database.config import Base
import enum
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, validator

class EnumFormat(enum.Enum):
    chaveamento = "chaveamento"
    pontos_corridos = "pontos_corridos"

class EnumVisibility(enum.Enum):
    publico = "publico"
    privado = "privado"

class ChampionshipInput(BaseModel):
    name: str
    start_time: datetime
    min_teams: int
    max_teams: int
    prizes: Optional[str]
    format: EnumFormat
    rules: Optional[str]
    contact: Optional[str]
    visibility: EnumVisibility
    admin_id: int
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
        if v < datetime.now():
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
        if 'max_teams' in values and (not (values['max_teams'] & (values['max_teams'] - 1) == 0) and v != EnumFormat.chaveamento):
            raise ValueError('O formato do campeonato deve ser chaveamento quando o número máximo de times não é potência de dois')
        return v

class ChampionshipSchema(BaseModel):
    id: int
    name: str
    start_time: datetime
    min_teams: int
    max_teams: int
    prizes: Optional[str]
    format: EnumFormat
    rules: Optional[str]
    contact: Optional[str]
    visibility: EnumVisibility
    created_at: datetime
    admin_id: int
    game_id: int

class FindManyChampionshipFilters(BaseModel):
    game_id: Optional[int]
    max_teams: Optional[int]
    min_teams: Optional[int]
    format: Optional[EnumFormat]
    visibility: Optional[EnumVisibility]

class Championship(Base):
    __tablename__ = "championships"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    start_time = Column(DateTime)
    min_teams = Column(Integer)
    max_teams = Column(Integer)
    prizes = Column(Text)
    format = Column(Enum(EnumFormat))
    rules = Column(Text)
    contact = Column(Text)
    visibility = Column(Enum(EnumVisibility))
    created_at = Column(DateTime)
    admin_id = Column(Integer, ForeignKey("users.id"))
    game_id = Column(Integer, ForeignKey("games.id"))
 