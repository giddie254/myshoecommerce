// src/pages/admin/pages/AdminHomepageSections.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const sectionLabels = {
  featured: 'Featured Products',
  newArrivals: 'New Arrivals',
  bestSellers: 'Best Sellers',
  hero: 'Hero Slider',
  categories: 'Categories Grid',
};

const AdminHomepageSections = () => {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSections = async () => {
    try {
      const { data } = await axios.get('/api/homepage/sections');
      setSections(data);
    } catch (err) {
      console.error('Failed to load homepage sections', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (section) => {
    try {
      const updated = {
        ...sections,
        [section]: !sections[section],
      };
      setSections(updated);
      await axios.put('/api/homepage/sections', updated);
    } catch (err) {
      alert('Failed to update section status');
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary dark:text-white">Homepage Sections</h1>
        <Button variant="outline" onClick={fetchSections} size="sm">
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading sections...</p>
        ) : (
          Object.keys(sectionLabels).map((section) => (
            <div
              key={section}
              className="flex justify-between items-center border-b last:border-none pb-3"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {sectionLabels[section]}
              </span>
              <Switch
                checked={sections[section]}
                onCheckedChange={() => updateSection(section)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminHomepageSections;
