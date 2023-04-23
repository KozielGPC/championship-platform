from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from api.database.config import Base



class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    password = Column(String)
    game_id = Column(Integer, ForeignKey("games.id"))
    owner_id = Column(Integer, ForeignKey("users.id"))
