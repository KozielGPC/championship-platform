from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime, Text
from sqlalchemy.orm import relationship
from api.database.config import Base


class ChampionshipsHasTeams(Base):
    __tablename__ = "championship_has_teams"

    championship_id = Column(Integer, ForeignKey("championships.id"), primary_key=True)
    team_id = Column(Integer, ForeignKey("teams.id"), primary_key=True)
