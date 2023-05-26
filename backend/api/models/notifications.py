from sqlalchemy import Column, Integer, String, DateTime
from api.database.config import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    reference_user_id = Column(Integer, ForeignKey("users.id"))
    text = Column(Text)
    visualized = Column(Boolean)
