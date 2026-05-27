// Author: Midhun Sai Morampudi
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-indigo-600 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/dashboard" className="font-bold text-lg">💸 ExpenseTracker</Link>
      <div className="flex gap-4 items-center">
        {user && <>
          <span className="text-sm">Hi, {user.username}</span>
          {user.role === 'admin' && <Link to="/admin" className="text-sm underline">Admin</Link>}
          <button onClick={() => { logout(); navigate('/login'); }}
            className="bg-white text-indigo-600 px-3 py-1 rounded text-sm font-medium">
            Logout
          </button>
        </>}
      </div>
    </nav>
  );
}