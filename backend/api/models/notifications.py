from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from api.database.config import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    team_name = Column(String)
    reference_user_id = Column(Integer, ForeignKey("users.id"))
    sender_name = Column(Text)
    team_id = Column(Integer)
    visualized = Column(Boolean)
