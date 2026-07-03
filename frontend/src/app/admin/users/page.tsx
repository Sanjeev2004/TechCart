'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Loader2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err: any) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('User deleted');
        fetchUsers();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error deleting user');
      }
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  if (error) return <div className="text-red-500 font-bold">{error}</div>;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Users</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium text-gray-700 rounded-tl-lg">ID</th>
              <th className="p-4 font-medium text-gray-700">NAME</th>
              <th className="p-4 font-medium text-gray-700">EMAIL</th>
              <th className="p-4 font-medium text-gray-700">ADMIN</th>
              <th className="p-4 font-medium text-gray-700 rounded-tr-lg text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="p-4 font-mono text-sm text-gray-600">{user._id.substring(0, 10)}...</td>
                <td className="p-4 font-medium text-gray-900">{user.name}</td>
                <td className="p-4 text-blue-600"><a href={`mailto:${user.email}`}>{user.email}</a></td>
                <td className="p-4">
                  {user.role === 'admin' ? (
                    <CheckCircle className="w-5 h-5 text-green-500 inline" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 inline" />
                  )}
                </td>
                <td className="p-4 flex justify-end space-x-3">
                  <button onClick={() => deleteHandler(user._id)} className="text-red-600 hover:text-red-800 p-2 bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
