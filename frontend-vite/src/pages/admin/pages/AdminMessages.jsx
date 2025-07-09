import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Trash2, MailOpen, Loader2 } from 'lucide-react';
import { formatDate } from '../../../utils/formatDate';

const AdminMessages = () => {
  const { token } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get('/api/admin/messages', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await axios.delete(`/api/admin/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error('Failed to delete message', err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-text-primary dark:text-white">Customer Messages</h1>

      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="mx-auto animate-spin text-primary" />
          <p className="mt-2 text-sm text-gray-500">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <p className="text-center text-gray-500">No messages found.</p>
      ) : (
        <div className="overflow-auto rounded shadow bg-white dark:bg-gray-900">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {messages.map((msg) => (
                <tr key={msg._id}>
                  <td className="px-4 py-3">{msg.name}</td>
                  <td className="px-4 py-3 text-primary">{msg.email}</td>
                  <td className="px-4 py-3">{formatDate(msg.createdAt)}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => setSelected(msg)}
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <MailOpen className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="text-sm text-red-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded max-w-lg w-full space-y-4 shadow-lg">
            <h2 className="text-lg font-semibold text-text-primary">Message from {selected.name}</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Email:</strong> {selected.email}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {selected.message}
            </p>
            <button
              onClick={() => setSelected(null)}
              className="btn-primary w-full py-2 text-sm mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
