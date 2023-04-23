from sqlalchemy import Column, Integer, String
from api.database.config import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, )
    password = Column(String)
    email = Column(String)
