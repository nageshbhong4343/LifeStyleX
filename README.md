# 🚀 LifeStyleX - Full-Stack Social Web Application

LifeStyleX is a full-stack social network web application built with a **FastAPI** backend and a **React 18 + Vite** frontend.

![LifeStyleX](https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80)

## ✨ Features
- **Authentic Social Media UI**: Sleek left sidebar navigation, mobile-inspired authentication pages, and dark/light mode themes.
- **100+ Seeded Posts & Indian Content**: Pre-populated with travel, culture, monuments, food, and festival posts across 11 creator accounts.
- **Stories Bar**: 24-hour expiring stories with gradient avatar rings and fullscreen story player with progress bar.
- **Double-Tap to Like**: Heart bounce animation when double-tapping posts.
- **Social Sharing**: Share posts to WhatsApp, Twitter/X, Facebook, copy link, or send as direct messages.
- **Direct Messaging (DM)**: Chat interface with contact search and real-time feel message exchange.
- **Search & Notifications**: Slide-out drawers for user lookup and notifications.
- **Profile Management**: Profile pages with follower metrics, posts/saved/tagged grid tabs, and bio editor.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Python FastAPI
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT & Passlib / Direct bcrypt hashing
- **Static Storage**: Static uploads endpoint for user avatars & posts

### Frontend
- **Framework**: React 18 + Vite
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **Styling**: Modern CSS design system with CSS variables

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python seed.py
python -m uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

### Demo Login:
- **Username**: `demo_user`
- **Password**: `password123`
