// src/pages/admin/pages/AdminEmailTool.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Send, RefreshCw } from 'lucide-react';

const AdminEmailTool = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/emails/send', { subject, message, image, filter });
      fetchHistory();
      setSubject('');
      setMessage('');
      setImage('');
      alert('Email campaign sent!');
    } catch {
      alert('Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get('/api/emails/history');
      setHistory(data);
    } catch {
      console.error('Failed to fetch campaign history');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Marketing Email Tool</h1>
        <Button variant="outline" size="sm" onClick={fetchHistory}>
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      {/* Form */}
      <form
        onSubmit={sendEmail}
        className="space-y-4 bg-white dark:bg-gray-900 p-4 rounded shadow"
      >
        <input
          type="text"
          placeholder="Email Subject"
          className="w-full p-2 border rounded"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <textarea
          rows="6"
          placeholder="Message (HTML or plain text)"
          className="w-full p-2 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="Optional image URL to include"
          className="w-full p-2 border rounded"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="all">All Users</option>
          <option value="newsletter">Newsletter Subscribers</option>
          <option value="buyers">Recent Buyers</option>
        </select>

        <Button type="submit" disabled={loading}>
          <Send className="w-4 h-4 mr-1" /> {loading ? 'Sending...' : 'Send Campaign'}
        </Button>
      </form>

      {/* History */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Past Campaigns</h2>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">No campaigns sent yet.</p>
        ) : (
          <div className="space-y-3">
            {history.map((c) => (
              <div
                key={c._id}
                className="border p-3 rounded bg-gray-50 dark:bg-gray-800"
              >
                <p className="font-semibold text-sm">{c.subject}</p>
                <p className="text-xs text-gray-500">Sent to {c.sentCount} users • {new Date(c.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEmailTool;
