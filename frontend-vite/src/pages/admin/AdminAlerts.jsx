// src/pages/admin/AdminAlerts.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, Trash2, BellRing } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';

const AdminAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  // Secure socket connection with auth token
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token },
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected for Admin Alerts');
    });

    socket.on('adminAlert', (alert) => {
      setAlerts((prev) => [alert, ...prev]);
      toast.success(`🛎️ ${alert.title}`);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket connection failed:', err.message);
      toast.error('Real-time alert connection failed');
    });

    return () => socket.disconnect();
  }, [token]);

  // Load alerts from backend
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data } = await axios.get('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlerts(data || []);
      } catch (err) {
        toast.error('Failed to load alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [token]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, read: true } : a))
      );
    } catch {
      toast.error('Could not mark as read');
    }
  };

  const deleteAlert = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlerts((prev) => prev.filter((a) => a._id !== id));
    } catch {
      toast.error('Failed to delete alert');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-text-primary">🔔 Admin Alerts</h2>

      {loading ? (
        <p className="text-sm text-gray-500">Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <p className="text-sm text-gray-400 text-center">No alerts yet.</p>
      ) : (
        <ul className="space-y-4">
          {alerts.map((alert) => (
            <li
              key={alert._id}
              className={`flex items-start gap-4 p-4 border rounded-lg shadow-sm transition ${
                alert.read
                  ? 'bg-gray-50 dark:bg-gray-800'
                  : 'bg-white dark:bg-gray-700 border-primary'
              }`}
            >
              <BellRing className="w-5 h-5 mt-1 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-text-primary mb-1">
                  {alert.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {alert.message}
                </p>
                <span className="block text-xs mt-1 text-gray-400">
                  {new Date(alert.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {!alert.read && (
                  <button
                    onClick={() => markAsRead(alert._id)}
                    className="text-xs text-green-600 hover:underline flex items-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => deleteAlert(alert._id)}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminAlerts;

