from typing import Optional
from pydantic import BaseModel, Field


class NotificationSchema(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    text: Optional[str] = None
    reference_user_id: Optional[int] = Field(default=None, foreign_key="users.id")
    visualized: Optional[bool] = None

    class Config:
        orm_mode = True
