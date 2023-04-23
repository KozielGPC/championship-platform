from typing import List, Optional
from pydantic import BaseModel 
from datetime import datetime
 
class GameSchema(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    created_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True
