# Author: Member 1
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import auth, expenses, users, activity

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(expenses.router, prefix="/expenses", tags=["Expenses"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(activity.router, prefix="/activity", tags=["Activity"])

@app.get("/")
def root():
    return {"message": "Expense Tracker API is running"}
