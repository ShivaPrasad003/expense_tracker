# Author: Shiva Prasad
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: str
    created_at: datetime
    class Config: from_attributes = True

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str
    description: Optional[str] = ""

class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    description: Optional[str] = None

class ExpenseOut(BaseModel):
    id: int
    title: str
    amount: float
    category: str
    description: str
    date: datetime
    user_id: int
    class Config: from_attributes = True

class ActivityOut(BaseModel):
    id: int
    action: str
    timestamp: datetime
    class Config: from_attributes = True