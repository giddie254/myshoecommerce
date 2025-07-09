import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Send, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminMarketingEmail = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const { data } = await axios.get('/api/emails/history');
      setCampaigns(data);
    } catch (err) {
      toast.error('Failed to load email history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      return toast.error('Please fill in subject and message');
    }

    try {
      await axios.post('/api/emails/send', { subject, message });
      toast.success('Emails sent successfully!');
      setSubject('');
      setMessage('');
      fetchCampaigns();
    } catch (err) {
      toast.error('Failed to send email campaign');
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary dark:text-white">Email Marketing</h1>
        <Button onClick={fetchCampaigns} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Email Form */}
      <form onSubmit={handleSend} className="space-y-4 bg-gray-50 dark:bg-gray-900 p-6 rounded-md shadow">
        <input
          type="text"
          placeholder="Email Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border px-3 py-2 rounded dark:bg-gray-800"
        />
        <textarea
          placeholder="Email Message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border px-3 py-2 rounded dark:bg-gray-800"
        />
        <Button type="submit">
          <Send className="w-4 h-4 mr-2" />
          Send Campaign
        </Button>
      </form>

      {/* Campaign History */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold mt-6">Recent Campaigns</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : campaigns.length === 0 ? (
          <p className="text-gray-500">No past campaigns yet.</p>
        ) : (
          <ul className="space-y-2">
            {campaigns.map((campaign) => (
              <li key={campaign._id} className="p-3 rounded bg-white dark:bg-gray-800 shadow">
                <div className="text-sm font-semibold text-primary">{campaign.subject}</div>
                <div className="text-xs text-gray-500">Sent: {new Date(campaign.createdAt).toLocaleString()}</div>
                <div className="text-sm mt-1">{campaign.message.slice(0, 100)}...</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminMarketingEmail;
