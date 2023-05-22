from typing import List, Optional, Generic, TypeVar
from pydantic import BaseModel, Field, validator
from pydantic.generics import GenericModel
from datetime import datetime, timedelta, timezone
from enum import Enum


T = TypeVar("T")


class EnumFormat(str, Enum):
    chaveamento = "chaveamento"
    pontos_corridos = "pontos_corridos"


class EnumVisibility(str, Enum):
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

    @validator("name")
    def name_length(cls, v):
        if len(v) < 5 or len(v) > 100:
            raise ValueError("Championship name must be between 5 and 100 characters long")
        if not v.strip():
            raise ValueError("The championship name cannot be composed only of blank spaces")
        return v

    @validator("start_time")
    def start_time_not_past(cls, v):
        if v.replace(tzinfo=timezone(offset=timedelta())) < datetime.now().replace(tzinfo=timezone(offset=timedelta())):
            raise ValueError("Championship start date cannot be in the past")
        return v

    @validator("min_teams")
    def min_teams_greater_than_zero(cls, v):
        if v <= 1:
            raise ValueError("The minimum number of teams must be greater than one")
        return v

    @validator("max_teams")
    def max_teams_greater_than_min_teams(cls, v, values):
        if "min_teams" in values and v < values["min_teams"]:
            raise ValueError("The maximum number of teams must be greater than or equal to the minimum number of teams")
        return v

    @validator("format")
    def format_is_chaveamento_when_max_teams_is_not_power_of_two(cls, v, values):
        if "max_teams" in values and (
            not (values["max_teams"] & (values["max_teams"] - 1) == 0) and v == EnumFormat.chaveamento
        ):
            raise ValueError(
                "The championship format must be keyed when the maximum number of times is not a power of two"
            )
        return v

    class Config:
        orm_mode = True
        use_enum_values = True


class ChampionshipUpdateRequest(BaseModel):
    name: Optional[str] = None
    start_time: Optional[datetime] = None
    min_teams: Optional[int] = None
    max_teams: Optional[int] = None
    prizes: Optional[str] = None
    format: Optional[EnumFormat] = None
    rules: Optional[str] = None
    contact: Optional[str] = None
    visibility: Optional[EnumVisibility] = None

    @validator("prizes", "rules", "contact", "name")
    def check_empty_fields(cls, v):
        assert v != "", "Empty strings are not allowed."
        return v

    @validator("prizes", "rules", "contact", "name")
    def check_spaced_fields(cls, v):
        assert v.strip(), "Empty strings are not allowed."
        return v

    @validator("format")
    def check_format_enum(cls, v):
        allowed_formats = [f.value for f in EnumFormat]
        if v is not None:
            assert v in allowed_formats, "Invalid value for format field."
        return v

    @validator("visibility")
    def check_visibility_enum(cls, v):
        allowed_visibilities = [v.value for v in EnumVisibility]
        if v is not None:
            assert v in allowed_visibilities, "Invalid value for visibility field."
        return v

    @validator("min_teams")
    def min_teams_greater_than_zero(cls, v):
        if v <= 1:
            raise ValueError("The minimum number of teams must be greater than one")
        return v

    @validator("max_teams")
    def max_teams_greater_than_min_teams(cls, v, values):
        print(values)
        if values["min_teams"] != None and v < values["min_teams"]:
            raise ValueError("The maximum number of teams must be greater than or equal to the minimum number of teams")
        return v

    @validator("start_time")
    def start_time_not_past(cls, v):
        if v.replace(tzinfo=timezone(offset=timedelta())) < datetime.now().replace(tzinfo=timezone(offset=timedelta())):
            raise ValueError("Championship start date cannot be in the past")
        return v

    class Config:
        extra = "forbid"


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
