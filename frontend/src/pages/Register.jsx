// Author: Member 2
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch {
      setError('Registration failed. Email may already be in use.');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input className="border p-2 rounded" placeholder="Username"
          value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
        <input className="border p-2 rounded" type="email" placeholder="Email"
          value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <input className="border p-2 rounded" type="password" placeholder="Password"
          value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        <button className="bg-indigo-600 text-white py-2 rounded font-medium">Register</button>
      </form>
      <p className="mt-3 text-sm">Have an account? <Link to="/login" className="text-indigo-600 underline">Login</Link></p>
    </div>
  );
}