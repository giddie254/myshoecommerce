// src/pages/admin/pages/AdminSettings.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    storeName: '',
    supportEmail: '',
    mpesaPaybill: '',
    facebookLink: '',
    instaLink: '',
    twitterLink: '',
    footerText: '',
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get('/api/admin/settings');
      setSettings(prev => ({ ...prev, ...data }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put('/api/admin/settings', settings);
      alert('Settings saved successfully');
    } catch {
      alert('Error saving settings');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary dark:text-white">Site Settings</h1>
        <Button variant="outline" size="sm" onClick={fetchSettings}>
          <RefreshCw className="w-4 h-4 mr-1" /> Reload
        </Button>
      </div>

      {loading ? (
        <p>Loading settings...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Store Name" value={settings.storeName} onChange={e => setSettings({ ...settings, storeName: e.target.value })} />
          <Input label="Support Email" value={settings.supportEmail} type="email" onChange={e => setSettings({ ...settings, supportEmail: e.target.value })} />
          <Input label="M-PESA Paybill" value={settings.mpesaPaybill} onChange={e => setSettings({ ...settings, mpesaPaybill: e.target.value })} />
          <Input label="Facebook URL" value={settings.facebookLink} onChange={e => setSettings({ ...settings, facebookLink: e.target.value })} />
          <Input label="Instagram URL" value={settings.instaLink} onChange={e => setSettings({ ...settings, instaLink: e.target.value })} />
          <Input label="Twitter URL" value={settings.twitterLink} onChange={e => setSettings({ ...settings, twitterLink: e.target.value })} />
          <Textarea label="Footer Text" value={settings.footerText} onChange={e => setSettings({ ...settings, footerText: e.target.value })} className="md:col-span-2" />
          <Button onClick={handleSave} className="md:col-span-2">Save Settings</Button>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
