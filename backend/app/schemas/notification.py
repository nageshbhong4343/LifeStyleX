from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.user import UserResponse

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    sender_id: int
    type: str
    post_id: Optional[int] = None
    is_read: bool
    created_at: datetime
    sender: UserResponse

    class Config:
        from_attributes = True
