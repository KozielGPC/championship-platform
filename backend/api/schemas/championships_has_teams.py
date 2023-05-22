from api.schemas.teams import TeamSchema
from api.schemas.championships import ChampionshipSchema
from typing import List


class TeamsWithChampionships(TeamSchema):
    championships: List[ChampionshipSchema] = []


class ChampionshipWithTeams(ChampionshipSchema):
    teams: List[TeamSchema] = []
