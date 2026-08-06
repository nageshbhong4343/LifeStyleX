from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db, get_current_user
from app.models.message import Message
from app.models.user import User
from app.schemas.message import MessageCreate, MessageResponse
from app.schemas.user import UserResponse

router = APIRouter(prefix="/messages", tags=["Messages"])

@router.get("/conversations", response_model=List[UserResponse])
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Find all users current_user has exchanged messages with
    sent = db.query(Message.receiver_id).filter(Message.sender_id == current_user.id).distinct().all()
    received = db.query(Message.sender_id).filter(Message.receiver_id == current_user.id).distinct().all()

    user_ids = set([s[0] for s in sent] + [r[0] for r in received])
    users = db.query(User).filter(User.id.in_(user_ids)).all()
    return [UserResponse.model_validate(u) for u in users]

@router.get("/{other_user_id}", response_model=List[MessageResponse])
def get_messages_with_user(
    other_user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    messages = db.query(Message).filter(
        ((Message.sender_id == current_user.id) & (Message.receiver_id == other_user_id)) |
        ((Message.sender_id == other_user_id) & (Message.receiver_id == current_user.id))
    ).order_by(Message.created_at.asc()).all()

    # Mark received as read
    for m in messages:
        if m.receiver_id == current_user.id and not m.is_read:
            m.is_read = True
    db.commit()

    res = []
    for m in messages:
        sender = db.query(User).filter(User.id == m.sender_id).first()
        m_resp = MessageResponse(
            id=m.id,
            sender_id=m.sender_id,
            receiver_id=m.receiver_id,
            text=m.text,
            is_read=m.is_read,
            created_at=m.created_at,
            sender=UserResponse.model_validate(sender)
        )
        res.append(m_resp)
    return res

@router.post("/", response_model=MessageResponse)
def send_message(
    msg_in: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    receiver = db.query(User).filter(User.id == msg_in.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver user not found")

    message = Message(
        sender_id=current_user.id,
        receiver_id=msg_in.receiver_id,
        text=msg_in.text
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    return MessageResponse(
        id=message.id,
        sender_id=message.sender_id,
        receiver_id=message.receiver_id,
        text=message.text,
        is_read=message.is_read,
        created_at=message.created_at,
        sender=UserResponse.model_validate(current_user)
    )
