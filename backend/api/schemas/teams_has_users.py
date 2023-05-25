from api.schemas.teams import TeamSchema
from api.schemas.users import UserSchema
from typing import List


class TeamsWithUsers(TeamSchema):
    users: List[UserSchema] = []


class UserWithTeams(UserSchema):
    teams: List[TeamSchema] = []
