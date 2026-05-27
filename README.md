# Expense Tracker

Ever lost track of where your money went? Expense Tracker is a web app that helps you log, organize, and visualize your daily spending — all in one place.

Built as a university group project using FastAPI, React, and PostgreSQL.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) + TailwindCSS |
| Backend | FastAPI (Python) |
| Database | PostgreSQL + SQLAlchemy |
| Auth | JWT + bcrypt |
| Charts | Recharts |

---

## What Can You Do With It?

- Sign up and log in securely — passwords are hashed, sessions use JWT tokens
- Add expenses with a title, amount, category, and optional description
- Edit or delete any expense instantly
- Search in real time — just start typing and the list filters as you go
- Filter by category — only want to see Food expenses? Done
- Sort by newest, oldest, highest or lowest amount
- See your spending broken down in a pie chart by category
- Track this month vs all time spending at a glance
- Admin users can see all registered users and their full activity history

---

## Project Structure
expense_tracker/
├── backend/
│   ├── main.py              # App entry point, routes registered here
│   ├── database.py          # PostgreSQL connection via SQLAlchemy
│   ├── models.py            # Three DB tables: User, ExpenseItem, UserActivity
│   ├── schemas.py           # Request/response validation with Pydantic
│   ├── security.py          # Password hashing and JWT logic
│   ├── seed_admin.py        # Run once to create the admin account
│   ├── requirements.txt     # All Python dependencies
│   └── routers/
│       ├── auth.py          # /register and /login endpoints
│       ├── expenses.py      # Full CRUD for expenses with live search
│       └── users.py         # Admin-only: view users and activity logs
└── frontend/
└── src/
├── App.jsx                    # Routes defined here
├── api/axios.js               # API client with auto JWT header
├── context/AuthContext.jsx    # Stores login state across the app
├── components/
│   ├── Navbar.jsx             # Top navigation with role-aware links
│   └── ProtectedRoute.jsx     # Redirects if not logged in
└── pages/
├── Login.jsx              # Login form
├── Register.jsx           # Registration form
├── Dashboard.jsx          # Main page with expenses, chart, search
└── AdminPanel.jsx         # Admin view of all users and activity

---

## How to Run It Locally

### What You Need First
- Python 3.10+
- Node.js 18+
- PostgreSQL 18

### 1. Set Up the Database

Open pgAdmin or psql and run:

```sql
CREATE DATABASE expense_tracker;
```

### 2. Start the Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside the `/backend` folder:
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/expense_tracker
SECRET_KEY=supersecretkey123changethis
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

Replace YOUR_PASSWORD with your PostgreSQL password, then run:

```bash
uvicorn main:app --reload
```

To create the admin account, run this once:

```bash
python seed_admin.py
```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173 in your browser.

---

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin123 |

You can register new regular user accounts from the Register page.

---

## Workload Allocation

## Workload Allocation

| Member | Files |
|--------|-------|
| Shiva Prasad Devarakonda | `backend/main.py`, `backend/database.py`, `backend/models.py`, `backend/schemas.py`, `backend/security.py`, `backend/seed_admin.py`, `backend/routers/auth.py`, `backend/routers/users.py`, `README.md` |
| Midhun Sai Morampudi | `backend/routers/expenses.py`, `frontend/src/api/axios.js`, `frontend/src/context/AuthContext.jsx`, `frontend/src/App.jsx`, `frontend/src/components/Navbar.jsx`, `frontend/src/components/ProtectedRoute.jsx`, `frontend/src/pages/Login.jsx`, `frontend/src/pages/Register.jsx`, `frontend/src/pages/Dashboard.jsx`, `frontend/src/pages/AdminPanel.jsx` |

---

## Database Export

The database schema and seed data can be found in `database_export.sql` in the root folder.