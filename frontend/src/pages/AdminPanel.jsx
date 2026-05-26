// Author: Member 1
import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    api.get('/users/all').then(r => setUsers(r.data));
  }, []);

  const viewActivity = async (user) => {
    setSelectedUser(user);
    const { data } = await api.get(`/users/${user.id}/activity`);
    setHistory(data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <table className="w-full border rounded-lg text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            {['Username', 'Email', 'Role', 'Joined', 'Actions'].map(h =>
              <th key={h} className="p-2 text-left">{h}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.username}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">{new Date(u.created_at).toLocaleDateString()}</td>
              <td className="p-2">
                <button onClick={() => viewActivity(u)}
                  className="text-indigo-600 underline text-sm">
                  View Activity
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div>
          <h3 className="font-semibold mb-2">Activity for {selectedUser.username}</h3>
          <div className="flex flex-col gap-2">
            {history.length === 0 && <p className="text-gray-400">No activity yet.</p>}
            {history.map(h => (
              <div key={h.id} className="border p-2 rounded text-sm flex justify-between">
                <span>{h.action}</span>
                <span className="text-gray-400">{new Date(h.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}