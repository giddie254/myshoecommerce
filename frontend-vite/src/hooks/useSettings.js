// src/hooks/useSettings.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export const useSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/admin/settings');
        setSettings(data);
      } catch (error) {
        console.warn('Admin settings not available. Falling back to empty settings.');
        setSettings({});
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
};

