from api.schemas.teams import TeamSchema
from api.schemas.championships import ChampionshipSchema
from api.schemas.users import UserSchema
from typing import List


class TeamsWithRelations(TeamSchema):
    championships: List[ChampionshipSchema] = []
    users: List[UserSchema] = []


class ChampionshipWithTeams(ChampionshipSchema):
    teams: List[TeamSchema] = []
