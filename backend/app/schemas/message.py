from pydantic import BaseModel
from datetime import datetime
from app.schemas.user import UserResponse

class MessageCreate(BaseModel):
    receiver_id: int
    text: str

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    text: str
    is_read: bool
    created_at: datetime
    sender: UserResponse

    class Config:
        from_attributes = True
