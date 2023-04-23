from sqlalchemy import Column, Integer, String, DateTime
from api.database.config import Base


class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    created_at = Column(DateTime)