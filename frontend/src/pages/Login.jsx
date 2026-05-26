// Author: Member 2
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input className="border p-2 rounded" type="email" placeholder="Email"
          value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <input className="border p-2 rounded" type="password" placeholder="Password"
          value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        <button className="bg-indigo-600 text-white py-2 rounded font-medium">Login</button>
      </form>
      <p className="mt-3 text-sm">No account? <Link to="/register" className="text-indigo-600 underline">Register</Link></p>
    </div>
  );
}