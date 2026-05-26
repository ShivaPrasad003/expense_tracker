// Author: Member 2
import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Health', 'Bills', 'Other'];

const CATEGORY_COLORS = {
  Food: 'bg-green-100 text-green-700',
  Transport: 'bg-blue-100 text-blue-700',
  Shopping: 'bg-purple-100 text-purple-700',
  Health: 'bg-red-100 text-red-700',
  Bills: 'bg-yellow-100 text-yellow-700',
  Other: 'bg-gray-100 text-gray-700',
};

const PIE_COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#ef4444', '#eab308', '#6b7280'];

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', amount: '', category: 'Food', description: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date_desc');

  const fetchExpenses = async () => {
    const { data } = await api.get(`/expenses/?search=${search}`);
    setExpenses(data);
  };

  useEffect(() => { fetchExpenses(); }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/expenses/${editId}`, { ...form, amount: parseFloat(form.amount) });
        toast.success('Expense updated!');
        setEditId(null);
      } else {
        await api.post('/expenses/', { ...form, amount: parseFloat(form.amount) });
        toast.success('Expense added!');
      }
      setForm({ title: '', amount: '', category: 'Food', description: '' });
      fetchExpenses();
    } catch {
      toast.error('Failed to save expense.');
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      toast.success('Expense deleted!');
      fetchExpenses();
    } catch {
      toast.error('Failed to delete.');
    }
  };

  const startEdit = (expense) => {
    setEditId(expense.id);
    setForm({ title: expense.title, amount: expense.amount, category: expense.category, description: expense.description });
  };

  // Filter by category
  const filtered = filterCategory === 'All'
    ? expenses
    : expenses.filter(e => e.category === filterCategory);

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'amount_asc') return a.amount - b.amount;
    if (sortBy === 'amount_desc') return b.amount - a.amount;
    if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
    return new Date(b.date) - new Date(a.date);
  });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Monthly summary
  const now = new Date();
  const thisMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Pie chart data
  const chartData = CATEGORIES.map(cat => ({
    name: cat,
    value: parseFloat(expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0).toFixed(2))
  })).filter(d => d.value > 0);

  return (
    <div>
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-4">My Expenses</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <p className="text-sm text-indigo-500 font-medium">All Time Total</p>
          <p className="text-2xl font-bold text-indigo-700">${total.toFixed(2)}</p>
          <p className="text-xs text-indigo-400">{expenses.length} expenses</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-500 font-medium">This Month</p>
          <p className="text-2xl font-bold text-green-700">${thisMonthTotal.toFixed(2)}</p>
          <p className="text-xs text-green-400">{thisMonthExpenses.length} expenses</p>
        </div>
      </div>

      {/* Pie Chart */}
      {chartData.length > 0 && (
        <div className="mb-6 border rounded-xl p-4">
          <h3 className="font-semibold mb-2 text-gray-700">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Search */}
      <input className="border p-2 rounded w-full mb-4" placeholder="Search by title or category..."
        value={search} onChange={e => setSearch(e.target.value)} />

      {/* Filter + Sort */}
      <div className="flex gap-3 mb-4">
        <select className="border p-2 rounded flex-1" value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="border p-2 rounded flex-1" value={sortBy}
          onChange={e => setSortBy(e.target.value)}>
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="amount_desc">Highest Amount</option>
          <option value="amount_asc">Lowest Amount</option>
        </select>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mb-6 p-4 border rounded-xl">
        <input className="border p-2 rounded" placeholder="Title" value={form.title}
          onChange={e => setForm({...form, title: e.target.value})} required />
        <input className="border p-2 rounded" type="number" placeholder="Amount" value={form.amount}
          onChange={e => setForm({...form, amount: e.target.value})} required />
        <select className="border p-2 rounded" value={form.category}
          onChange={e => setForm({...form, category: e.target.value})}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <input className="border p-2 rounded" placeholder="Description (optional)" value={form.description}
          onChange={e => setForm({...form, description: e.target.value})} />
        <button disabled={loading}
          className="col-span-2 bg-indigo-600 text-white py-2 rounded font-medium disabled:opacity-50">
          {loading ? 'Saving...' : editId ? 'Update Expense' : 'Add Expense'}
        </button>
        {editId && (
          <button type="button" className="col-span-2 border py-2 rounded"
            onClick={() => { setEditId(null); setForm({ title: '', amount: '', category: 'Food', description: '' }); }}>
            Cancel
          </button>
        )}
      </form>

      {/* Expense List */}
      <div className="flex flex-col gap-3">
        {sorted.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">💸</p>
            <p>No expenses found.</p>
          </div>
        )}
        {sorted.map(e => (
          <div key={e.id} className="flex justify-between items-center border p-3 rounded-lg hover:shadow-sm transition">
            <div>
              <p className="font-medium">{e.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[e.category] || 'bg-gray-100 text-gray-700'}`}>
                  {e.category}
                </span>
                <span className="text-xs text-gray-400">{new Date(e.date).toLocaleDateString()}</span>
              </div>
              {e.description && <p className="text-sm text-gray-400 mt-1">{e.description}</p>}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-indigo-600">${e.amount.toFixed(2)}</span>
              <button onClick={() => startEdit(e)}
                className="text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">Edit</button>
              <button onClick={() => deleteExpense(e.id)}
                className="text-sm bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}