# Author: Member 1
from pydantic import BaseModel
from datetime import date
from typing import Optional

# -------------------------
# AUTH SCHEMAS
# -------------------------

class UserRegister(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


# -------------------------
# EXPENSE SCHEMAS
# -------------------------

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str
    date: date


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    date: Optional[date] = None
