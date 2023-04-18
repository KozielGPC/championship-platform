from typing import List, Optional, Generic, TypeVar
from pydantic import BaseModel, Field
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
    start_time: datetime = datetime
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


class Response(GenericModel, Generic[T]):
    code: str
    status: str
    message: str
    result: Optional[T]
