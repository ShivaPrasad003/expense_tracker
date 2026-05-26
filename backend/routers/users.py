# Author: Member 1
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from security import require_admin
from schemas import UserOut, ActivityOut
import models
from typing import List

router = APIRouter()

@router.get("/all", response_model=List[UserOut])
def get_all_users(db: Session = Depends(get_db), admin=Depends(require_admin)):
    return db.query(models.User).all()

@router.get("/{user_id}/activity", response_model=List[ActivityOut])
def get_user_activity(user_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    return db.query(models.UserActivity).filter(
        models.UserActivity.user_id == user_id
    ).order_by(models.UserActivity.timestamp.desc()).all()