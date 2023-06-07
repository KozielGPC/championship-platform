from typing import List, Optional, Generic, TypeVar
from pydantic import BaseModel, Field, validator
from pydantic.generics import GenericModel

T = TypeVar("T")

class MatchSchema(BaseModel):
    id: Optional[int] = None
    championship_id: Optional[int] = Field(default=None, foreign_hey="championships.id")
    team_1_id: Optional[int] = Field(default=None, foreign_key="teams.id")
    team_2_id: Optional[int] = Field(default=None, foreign_key="teams.id")
    winner_team_id: Optional[int] = Field(default=None, foreign_key="teams.id")
    bracket: Optional[int] = None
    round: Optional[int] = None
    result: Optional[str] = None
    
    class Config:
        orm_mode = True

class MatchInput(MatchSchema):
    id: int
    championship_id: int 
    game_id: int
    team_1_id: int
    team_2_id: int
    winner_team_id: int
    bracket: int 
    round: int 
    resul: str  #ver se é possivel criar partida sem resultado inicial

    @validator("resul")
    def check_empty_fields(cls, v):
        assert v != "", "Empty strings are not allowed."
        return v

    @validator("resul")
    def check_spaced_fields(cls, v):
        assert v.strip(), "Empty strings are not allowed."
        return v

    @validator("id", "championship_id", "team_1_id", "team_2_id", "winner_team_id", "game_id", "bracket", "round")
    def check_positive_numbers(cls, v):
        assert v >= 0, "Negative numbers are not allowed."
        return v

    class Config:
        orm_mode = True

class MatchUpdateRequest(BaseModel):
    winner_team_id: Optional[int] = Field(default=None, foreign_key="teams.id") #ver se fica a chave estrangeira
    result: Optional[str] = None

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