from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.user import UserResponse

class CommentCreate(BaseModel):
    text: str

class CommentResponse(BaseModel):
    id: int
    post_id: int
    user_id: int
    text: str
    created_at: datetime
    user: UserResponse

    class Config:
        from_attributes = True
