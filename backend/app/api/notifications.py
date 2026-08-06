from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db, get_current_user
from app.models.notification import Notification
from app.models.user import User
from app.schemas.notification import NotificationResponse
from app.schemas.user import UserResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/", response_model=List[NotificationResponse])
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notifs = db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).limit(30).all()
    res = []
    for n in notifs:
        sender = db.query(User).filter(User.id == n.sender_id).first()
        res.append(NotificationResponse(
            id=n.id,
            user_id=n.user_id,
            sender_id=n.sender_id,
            type=n.type,
            post_id=n.post_id,
            is_read=n.is_read,
            created_at=n.created_at,
            sender=UserResponse.model_validate(sender)
        ))
    return res

@router.post("/read")
def mark_notifications_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.query(Notification).filter(Notification.user_id == current_user.id, Notification.is_read == False).update({"is_read": True})
    db.commit()
    return {"message": "Notifications marked as read"}
