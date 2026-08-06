from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.dependencies import get_db, get_current_user, get_optional_current_user
from app.models.user import User
from app.models.follow import Follow
from app.models.post import Post
from app.models.notification import Notification
from app.schemas.user import UserResponse, UserUpdate
from app.utils.uploads import save_upload_file

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/search", response_model=List[UserResponse])
def search_users(
    query: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    if not query:
        return []
    users = db.query(User).filter(
        (User.username.ilike(f"%{query}%")) | (User.full_name.ilike(f"%{query}%"))
    ).limit(20).all()

    result = []
    for u in users:
        u_resp = UserResponse.model_validate(u)
        if current_user:
            is_following = db.query(Follow).filter(
                Follow.follower_id == current_user.id,
                Follow.following_id == u.id
            ).first() is not None
            u_resp.is_following = is_following
        result.append(u_resp)
    return result

@router.get("/suggested", response_model=List[UserResponse])
def get_suggested_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get users that current_user is NOT following and not self
    following_ids = db.query(Follow.following_id).filter(Follow.follower_id == current_user.id).all()
    following_ids = [f[0] for f in following_ids] + [current_user.id]

    suggested = db.query(User).filter(User.id.notin_(following_ids)).limit(10).all()
    res = []
    for u in suggested:
        u_resp = UserResponse.model_validate(u)
        u_resp.is_following = False
        res.append(u_resp)
    return res

@router.get("/{username}", response_model=UserResponse)
def get_user_profile(
    username: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    followers_count = db.query(Follow).filter(Follow.following_id == user.id).count()
    following_count = db.query(Follow).filter(Follow.follower_id == user.id).count()
    posts_count = db.query(Post).filter(Post.user_id == user.id).count()

    is_following = False
    if current_user:
        is_following = db.query(Follow).filter(
            Follow.follower_id == current_user.id,
            Follow.following_id == user.id
        ).first() is not None

    u_resp = UserResponse.model_validate(user)
    u_resp.followers_count = followers_count
    u_resp.following_count = following_count
    u_resp.posts_count = posts_count
    u_resp.is_following = is_following
    return u_resp

@router.post("/{user_id}/follow")
def follow_unfollow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")

    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    existing_follow = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.following_id == user_id
    ).first()

    if existing_follow:
        db.delete(existing_follow)
        db.commit()
        return {"following": False, "message": "Unfollowed user"}
    else:
        new_follow = Follow(follower_id=current_user.id, following_id=user_id)
        db.add(new_follow)

        # Notification
        notif = Notification(
            user_id=user_id,
            sender_id=current_user.id,
            type="follow"
        )
        db.add(notif)
        db.commit()
        return {"following": True, "message": "Followed user"}

@router.put("/profile", response_model=UserResponse)
def update_profile(
    full_name: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    avatar_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if full_name is not None:
        current_user.full_name = full_name
    if bio is not None:
        current_user.bio = bio
    if avatar_file:
        avatar_url = save_upload_file(avatar_file)
        current_user.avatar = avatar_url

    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)
