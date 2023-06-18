from sqlalchemy import Column, Integer, String, ForeignKey
from api.database.config import Base


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, autoincrement=True)
    championship_id = Column(Integer, ForeignKey("championships.id"))
    team_1_id = Column(Integer, ForeignKey("teams.id"))
    team_2_id = Column(Integer, ForeignKey("teams.id"))
    winner_team_id = Column(Integer, ForeignKey("teams.id"))
    bracket = Column(Integer)
    round = Column(Integer)
    result = Column(String)
    