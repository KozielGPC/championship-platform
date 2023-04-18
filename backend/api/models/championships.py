from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from api.database.config import Base


class Championship(Base):
    __tablename__ = "championships"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    start_time = Column(DateTime)
    min_teams = Column(Integer)
    max_teams = Column(Integer)
    prizes = Column(Text)
    format = Column(Enum('chaveamento','pontos_corridos'))
    rules = Column(Text)
    contact = Column(Text)
    visibility = Column(Enum('publico','privado'))
    created_at = Column(DateTime)
    admin_id = Column(Integer, ForeignKey("users.id"))
    game_id = Column(Integer, ForeignKey("games.id")) 
 