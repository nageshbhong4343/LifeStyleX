# pyrefly: ignore [missing-import]
from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.posts import router as posts_router
from app.api.stories import router as stories_router
from app.api.messages import router as messages_router
from app.api.notifications import router as notifications_router

api_router = APIRouter(prefix="/api")
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(posts_router)
api_router.include_router(stories_router)
api_router.include_router(messages_router)
api_router.include_router(notifications_router)
