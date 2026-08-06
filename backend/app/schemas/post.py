from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.user import UserResponse
from app.schemas.comment import CommentResponse

class PostCreate(BaseModel):
    caption: Optional[str] = ""

class PostResponse(BaseModel):
    id: int
    user_id: int
    image_url: str
    caption: Optional[str] = ""
    created_at: datetime
    user: UserResponse
    likes_count: int = 0
    comments_count: int = 0
    is_liked: bool = False
    is_bookmarked: bool = False
    recent_comments: List[CommentResponse] = []

    class Config:
        from_attributes = True
