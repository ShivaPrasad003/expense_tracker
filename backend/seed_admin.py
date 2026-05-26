# Author: Member 1
from database import SessionLocal
from models import User
from security import hash_password

db = SessionLocal()

existing = db.query(User).filter(User.email == "admin@test.com").first()
if existing:
    print("Admin already exists!")
else:
    admin = User(
        username="admin",
        email="admin@test.com",
        password=hash_password("admin123"),
        role="admin"
    )
    db.add(admin)
    db.commit()
    print("Admin created: admin@test.com / admin123")

db.close()