# Author: Midhun Sai
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from security import get_current_user
from schemas import ExpenseCreate, ExpenseUpdate, ExpenseOut
import models
from typing import List
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[ExpenseOut])
def get_expenses(search: str = Query(""), db: Session = Depends(get_db),
                 current_user: models.User = Depends(get_current_user)):
    query = db.query(models.ExpenseItem).filter(models.ExpenseItem.user_id == current_user.id)
    if search:
        query = query.filter(models.ExpenseItem.title.ilike(f"%{search}%") |
                             models.ExpenseItem.category.ilike(f"%{search}%"))
    return query.order_by(models.ExpenseItem.date.desc()).all()

@router.post("/", response_model=ExpenseOut)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db),
                   current_user: models.User = Depends(get_current_user)):
    new_expense = models.ExpenseItem(**expense.dict(), user_id=current_user.id)
    db.add(new_expense)
    db.add(models.UserActivity(user_id=current_user.id, action=f"created expense: {expense.title}", timestamp=datetime.utcnow()))
    db.commit()
    db.refresh(new_expense)
    return new_expense

@router.put("/{expense_id}", response_model=ExpenseOut)
def update_expense(expense_id: int, expense: ExpenseUpdate, db: Session = Depends(get_db),
                   current_user: models.User = Depends(get_current_user)):
    item = db.query(models.ExpenseItem).filter(
        models.ExpenseItem.id == expense_id,
        models.ExpenseItem.user_id == current_user.id).first()
    if not item:
        raise HTTPException(404, "Expense not found")
    for k, v in expense.dict(exclude_none=True).items():
        setattr(item, k, v)
    db.add(models.UserActivity(user_id=current_user.id, action=f"updated expense: {item.title}", timestamp=datetime.utcnow()))
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db),
                   current_user: models.User = Depends(get_current_user)):
    item = db.query(models.ExpenseItem).filter(
        models.ExpenseItem.id == expense_id,
        models.ExpenseItem.user_id == current_user.id).first()
    if not item:
        raise HTTPException(404, "Expense not found")
    db.add(models.UserActivity(user_id=current_user.id, action=f"deleted expense: {item.title}", timestamp=datetime.utcnow()))
    db.delete(item)
    db.commit()
    return {"message": "Deleted"}