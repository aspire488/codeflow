"""
CodeFlow Backend - FastAPI Server
Lightweight backend for progress sync and user authentication
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
import json
from datetime import datetime, timedelta
from pathlib import Path

# Database imports
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    Text,
    JSON,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from jose import JWTError, jwt

# ============= CONFIGURATION =============
SECRET_KEY = os.environ.get("SECRET_KEY", "codeflow-secret-key-change-in-production")
JWT_SECRET = os.environ.get("JWT_SECRET", "jwt-secret-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./codeflow.db")

# ============= DATABASE SETUP =============
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ============= MODELS =============
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    topic_id = Column(String, index=True)
    completed = Column(Boolean, default=False)
    score = Column(Integer, default=0)
    total = Column(Integer, default=0)
    percentage = Column(Float, default=0.0)
    xp_earned = Column(Integer, default=0)
    completed_at = Column(DateTime, default=datetime.utcnow)
    extra_data = Column(JSON, default={})


class GameProgress(Base):
    __tablename__ = "game_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    level_id = Column(String, index=True)
    completed = Column(Boolean, default=False)
    xp_earned = Column(Integer, default=0)
    completed_at = Column(DateTime, default=datetime.utcnow)


# Create tables
Base.metadata.create_all(bind=engine)


# ============= Pydantic Models =============
class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class ProgressSave(BaseModel):
    topic_id: str
    completed: bool = False
    score: int = 0
    total: int = 0
    percentage: float = 0.0
    xp_earned: int = 0


class GameProgressSave(BaseModel):
    level_id: str
    completed: bool = False
    xp_earned: int = 0


# ============= SECURITY =============
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> User:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    db = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()
    db.close()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ============= DATABASE HELPERS =============
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============= LIFESPAN =============
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("[Backend] CodeFlow API starting...")
    yield
    # Shutdown
    print("[Backend] CodeFlow API shutting down...")


# ============= APP SETUP =============
app = FastAPI(
    title="CodeFlow API",
    description="Backend API for CodeFlow learning application",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============= AUTH ROUTES =============
@app.post("/api/register", response_model=Token)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing = (
        db.query(User)
        .filter((User.email == user.email) | (User.username == user.username))
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    # Create user
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email, username=user.username, hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create token
    access_token = create_access_token(data={"sub": new_user.id})
    return Token(access_token=access_token, token_type="bearer")


@app.post("/api/login", response_model=Token)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": db_user.id})
    return Token(access_token=access_token, token_type="bearer")


# ============= PROGRESS ROUTES =============
@app.post("/api/save-progress")
async def save_progress(
    progress: ProgressSave,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Check if progress exists
    existing = (
        db.query(Progress)
        .filter(Progress.user_id == user.id, Progress.topic_id == progress.topic_id)
        .first()
    )

    if existing:
        existing.completed = progress.completed
        existing.score = progress.score
        existing.total = progress.total
        existing.percentage = progress.percentage
        existing.xp_earned = progress.xp_earned
        existing.completed_at = datetime.utcnow()
    else:
        new_progress = Progress(
            user_id=user.id,
            topic_id=progress.topic_id,
            completed=progress.completed,
            score=progress.score,
            total=progress.total,
            percentage=progress.percentage,
            xp_earned=progress.xp_earned,
        )
        db.add(new_progress)

    db.commit()
    return {"status": "success", "message": "Progress saved"}


@app.get("/api/progress")
async def get_progress(
    user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    progress = db.query(Progress).filter(Progress.user_id == user.id).all()
    return {
        "topics": [
            {
                "topic_id": p.topic_id,
                "completed": p.completed,
                "score": p.score,
                "total": p.total,
                "percentage": p.percentage,
                "xp_earned": p.xp_earned,
                "completed_at": p.completed_at.isoformat() if p.completed_at else None,
            }
            for p in progress
        ]
    }


# ============= GAME PROGRESS ROUTES =============
@app.post("/api/save-game-progress")
async def save_game_progress(
    progress: GameProgressSave,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = (
        db.query(GameProgress)
        .filter(
            GameProgress.user_id == user.id, GameProgress.level_id == progress.level_id
        )
        .first()
    )

    if existing:
        existing.completed = progress.completed
        existing.xp_earned = progress.xp_earned
        existing.completed_at = datetime.utcnow()
    else:
        new_progress = GameProgress(
            user_id=user.id,
            level_id=progress.level_id,
            completed=progress.completed,
            xp_earned=progress.xp_earned,
        )
        db.add(new_progress)

    db.commit()
    return {"status": "success", "message": "Game progress saved"}


# ============= TOPICS ROUTES =============
@app.get("/api/topics")
async def get_topics():
    # Return topic list - in production, fetch from database
    # Frontend already has this data, this is for sync purposes
    return {"status": "success", "message": "Topics loaded from frontend"}


# ============= HEALTH CHECK =============
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.get("/")
async def root():
    return {"message": "CodeFlow API is running", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=5000)
