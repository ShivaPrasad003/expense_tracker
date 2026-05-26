# Author: Member 1
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User, Activity
from security import decode_token

router = APIRouter()

# Helper: extract user from Authorization header
def get_user(authorization: str, db: Session):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")

    token = authorization.split(" ")[1]
    payload = decode_token(token)

    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


# -------------------------
# ADMIN: View activity logs for a user
# -------------------------
@router.get("/{user_id}")
def get_activity(
    user_id: int,
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_user(authorization, db)

    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")

    logs = db.query(Activity).filter(Activity.user_id == user_id).order_by(Activity.timestamp.desc()).all()
    return logs
