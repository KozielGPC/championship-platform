from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime, Text
from sqlalchemy.orm import relationship
from api.database.config import Base
import enum
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

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
 