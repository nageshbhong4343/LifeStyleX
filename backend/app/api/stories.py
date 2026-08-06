# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.dependencies import get_db, get_current_user, get_optional_current_user
from app.models.story import Story
from app.models.user import User
from app.models.follow import Follow
from app.schemas.story import StoryResponse
from app.utils.uploads import save_upload_file

router = APIRouter(prefix="/stories", tags=["Stories"])

@router.get("/", response_model=List[StoryResponse])
def get_active_stories(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    now = datetime.utcnow()
    # Get active stories (expires_at > now)
    stories = db.query(Story).filter(Story.expires_at > now).order_by(Story.created_at.desc()).all()
    return [StoryResponse.model_validate(s) for s in stories]

@router.post("/", response_model=StoryResponse)
def create_story(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image_url = save_upload_file(file)
    story = Story(
        user_id=current_user.id,
        image_url=image_url
    )
    db.add(story)
    db.commit()
    db.refresh(story)
    return StoryResponse.model_validate(story)
