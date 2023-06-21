from typing import Optional
from pydantic import BaseModel, Field


class NotificationSchema(BaseModel):
    id: Optional[int] = None
    team_name: Optional[str] = None
    sender_name: Optional[str] = None
    reference_user_id: Optional[int] = Field(default=None, foreign_key="users.id")
    team_id: Optional[int] = None
    visualized: Optional[bool] = None

    class Config:
        orm_mode = True
