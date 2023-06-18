from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime, Text
from sqlalchemy.orm import relationship
from api.database.config import Base
import enum


class EnumFormat(enum.Enum):
    chaveamento = "chaveamento"
    pontos_corridos = "pontos_corridos"


class EnumVisibility(enum.Enum):
    publico = "publico"
    privado = "privado"

class Championship(Base):
    __tablename__ = "championships"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    start_time = Column(DateTime)
    min_teams = Column(Integer)
    max_teams = Column(Integer)
    prizes = Column(Text)
    round = Column(Integer)
    format = Column(Enum(EnumFormat))
    rules = Column(Text)
    contact = Column(Text)
    visibility = Column(Enum(EnumVisibility))
    created_at = Column(DateTime)
    admin_id = Column(Integer, ForeignKey("users.id"))
    game_id = Column(Integer, ForeignKey("games.id"))
    teams = relationship("Team", secondary="championship_has_teams", backref="teams")
    matches = relationship("Match", backref="matches")