# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from typing import List, Optional
from app.dependencies import get_db, get_current_user, get_optional_current_user
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.models.like import Like
from app.models.bookmark import Bookmark
from app.models.follow import Follow
from app.models.notification import Notification
from app.schemas.post import PostResponse
from app.schemas.comment import CommentResponse, CommentCreate
from app.utils.uploads import save_upload_file

router = APIRouter(prefix="/posts", tags=["Posts"])

def build_post_response(post: Post, current_user: Optional[User], db: Session) -> PostResponse:
    likes_count = db.query(Like).filter(Like.post_id == post.id).count()
    comments_count = db.query(Comment).filter(Comment.post_id == post.id).count()
    
    is_liked = False
    is_bookmarked = False
    if current_user:
        is_liked = db.query(Like).filter(Like.post_id == post.id, Like.user_id == current_user.id).first() is not None
        is_bookmarked = db.query(Bookmark).filter(Bookmark.post_id == post.id, Bookmark.user_id == current_user.id).first() is not None

    recent_comments_objs = db.query(Comment).filter(Comment.post_id == post.id).order_by(Comment.created_at.desc()).limit(3).all()
    recent_comments = [CommentResponse.model_validate(c) for c in reversed(recent_comments_objs)]

    resp = PostResponse.model_validate(post)
    resp.likes_count = likes_count
    resp.comments_count = comments_count
    resp.is_liked = is_liked
    resp.is_bookmarked = is_bookmarked
    resp.recent_comments = recent_comments
    return resp

@router.post("/", response_model=PostResponse)
def create_post(
    caption: str = Form(""),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image_url = save_upload_file(file)
    post = Post(
        user_id=current_user.id,
        image_url=image_url,
        caption=caption
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return build_post_response(post, current_user, db)

@router.get("/feed", response_model=List[PostResponse])
def get_feed_posts(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    if current_user:
        following_ids = db.query(Follow.following_id).filter(Follow.follower_id == current_user.id).all()
        following_ids = [f[0] for f in following_ids] + [current_user.id]
        posts = db.query(Post).filter(Post.user_id.in_(following_ids)).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
        if len(posts) < 5:
            # Fallback to all recent posts if feed is thin
            posts = db.query(Post).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    else:
        posts = db.query(Post).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

    return [build_post_response(p, current_user, db) for p in posts]

@router.get("/explore", response_model=List[PostResponse])
def get_explore_posts(
    skip: int = 0,
    limit: int = 30,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    posts = db.query(Post).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    return [build_post_response(p, current_user, db) for p in posts]

@router.get("/user/{username}", response_model=List[PostResponse])
def get_user_posts(
    username: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    posts = db.query(Post).filter(Post.user_id == user.id).order_by(Post.created_at.desc()).all()
    return [build_post_response(p, current_user, db) for p in posts]

@router.get("/saved", response_model=List[PostResponse])
def get_saved_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bookmarks = db.query(Bookmark).filter(Bookmark.user_id == current_user.id).order_by(Bookmark.created_at.desc()).all()
    post_ids = [b.post_id for b in bookmarks]
    posts = db.query(Post).filter(Post.id.in_(post_ids)).all()
    return [build_post_response(p, current_user, db) for p in posts]

@router.get("/{post_id}", response_model=PostResponse)
def get_post_by_id(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return build_post_response(post, current_user, db)

@router.post("/{post_id}/like")
def toggle_like_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_like = db.query(Like).filter(Like.post_id == post_id, Like.user_id == current_user.id).first()

    if existing_like:
        db.delete(existing_like)
        db.commit()
        likes_count = db.query(Like).filter(Like.post_id == post_id).count()
        return {"liked": False, "likes_count": likes_count}
    else:
        new_like = Like(post_id=post_id, user_id=current_user.id)
        db.add(new_like)

        if post.user_id != current_user.id:
            notif = Notification(
                user_id=post.user_id,
                sender_id=current_user.id,
                type="like",
                post_id=post_id
            )
            db.add(notif)

        db.commit()
        likes_count = db.query(Like).filter(Like.post_id == post_id).count()
        return {"liked": True, "likes_count": likes_count}

@router.post("/{post_id}/bookmark")
def toggle_bookmark_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing = db.query(Bookmark).filter(Bookmark.post_id == post_id, Bookmark.user_id == current_user.id).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"bookmarked": False}
    else:
        new_bookmark = Bookmark(post_id=post_id, user_id=current_user.id)
        db.add(new_bookmark)
        db.commit()
        return {"bookmarked": True}

@router.get("/{post_id}/comments", response_model=List[CommentResponse])
def get_post_comments(
    post_id: int,
    db: Session = Depends(get_db)
):
    comments = db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.asc()).all()
    return [CommentResponse.model_validate(c) for c in comments]

@router.post("/{post_id}/comments", response_model=CommentResponse)
def create_comment(
    post_id: int,
    comment_in: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comment = Comment(
        post_id=post_id,
        user_id=current_user.id,
        text=comment_in.text
    )
    db.add(comment)

    if post.user_id != current_user.id:
        notif = Notification(
            user_id=post.user_id,
            sender_id=current_user.id,
            type="comment",
            post_id=post_id
        )
        db.add(notif)

    db.commit()
    db.refresh(comment)
    return CommentResponse.model_validate(comment)

@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")

    db.delete(post)
    db.commit()
    return {"message": "Post deleted successfully"}
