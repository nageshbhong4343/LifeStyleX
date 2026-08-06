from pydantic import BaseModel
from datetime import datetime
from app.schemas.user import UserResponse

class StoryResponse(BaseModel):
    id: int
    user_id: int
    image_url: str
    created_at: datetime
    expires_at: datetime
    user: UserResponse

    class Config:
        from_attributes = True
