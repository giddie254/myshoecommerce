// src/pages/admin/AdminHomepage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import toast from 'react-hot-toast';

const AdminHomepage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get('/api/homepage');
      setSettings(data);
    } catch (err) {
      toast.error('Failed to load homepage settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await axios.put('/api/homepage', settings);
      toast.success('Homepage settings saved');
    } catch (err) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleHeroChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const handleCategoryChange = (index, field, value) => {
    const updated = [...settings.featuredCategories];
    updated[index][field] = value;
    setSettings((prev) => ({ ...prev, featuredCategories: updated }));
  };

  if (loading) return <p className="p-4">Loading homepage settings...</p>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary dark:text-white">Homepage Manager</h1>
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="categories">Featured Categories</TabsTrigger>
          <TabsTrigger value="highlights">Promotions</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <div className="grid gap-4">
            <Input
              label="Title"
              value={settings.hero.title}
              onChange={(e) => handleHeroChange('title', e.target.value)}
              placeholder="e.g. Welcome to sokoHive"
            />
            <Input
              label="Subtitle"
              value={settings.hero.subtitle}
              onChange={(e) => handleHeroChange('subtitle', e.target.value)}
              placeholder="e.g. Shop top fashion brands at great prices"
            />
            <Input
              label="CTA Label"
              value={settings.hero.ctaLabel}
              onChange={(e) => handleHeroChange('ctaLabel', e.target.value)}
              placeholder="e.g. Shop Now"
            />
            <Input
              label="CTA Link"
              value={settings.hero.ctaLink}
              onChange={(e) => handleHeroChange('ctaLink', e.target.value)}
              placeholder="e.g. /shop"
            />
            <Input
              label="Background Image URL"
              value={settings.hero.bgImage}
              onChange={(e) => handleHeroChange('bgImage', e.target.value)}
              placeholder="Upload or paste URL"
            />
          </div>
        </TabsContent>

        {/* Featured Categories */}
        <TabsContent value="categories">
          <div className="grid gap-6">
            {settings.featuredCategories.map((cat, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-4 items-center">
                <Input
                  label="Label"
                  value={cat.label}
                  onChange={(e) => handleCategoryChange(idx, 'label', e.target.value)}
                  placeholder="e.g. Sneakers"
                />
                <Input
                  label="Link"
                  value={cat.link}
                  onChange={(e) => handleCategoryChange(idx, 'link', e.target.value)}
                  placeholder="e.g. /shop?cat=sneakers"
                />
                <Input
                  label="Image/Icon URL"
                  value={cat.image}
                  onChange={(e) => handleCategoryChange(idx, 'image', e.target.value)}
                  placeholder="e.g. https://image-url"
                />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Highlights */}
        <TabsContent value="highlights">
          <textarea
            rows={6}
            value={settings.highlights.join('\n')}
            onChange={(e) =>
              setSettings({ ...settings, highlights: e.target.value.split('\n') })
            }
            className="w-full p-3 border rounded-md text-sm dark:bg-gray-800 dark:text-white"
            placeholder="One line per promotion highlight..."
          />
        </TabsContent>

        {/* Testimonials */}
        <TabsContent value="testimonials">
          <textarea
            rows={6}
            value={settings.testimonials.join('\n')}
            onChange={(e) =>
              setSettings({ ...settings, testimonials: e.target.value.split('\n') })
            }
            className="w-full p-3 border rounded-md text-sm dark:bg-gray-800 dark:text-white"
            placeholder="One line per testimonial..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminHomepage;
