# Author: Member 1
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from security import hash_password, verify_password, create_token
from schemas import UserRegister, UserLogin
import models
from datetime import datetime

router = APIRouter()

@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(400, "Email already registered")
    new_user = models.User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    return {"message": "Registered successfully"}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(401, "Invalid credentials")
    db.add(models.UserActivity(user_id=db_user.id, action="login", timestamp=datetime.utcnow()))
    db.commit()
    token = create_token({"sub": str(db_user.id), "role": db_user.role})
    return {"access_token": token, "token_type": "bearer", "role": db_user.role, "username": db_user.username}