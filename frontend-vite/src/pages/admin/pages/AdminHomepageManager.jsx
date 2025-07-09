// src/pages/admin/pages/AdminHomepageManager.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { GripVertical, Eye, EyeOff, Save, RefreshCw } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableRow = ({ section, listeners, attributes, isDragging, handleToggle }) => {
  const { key, label, visible } = section;
  return (
    <div
      className={`flex items-center justify-between p-3 border rounded-md bg-white dark:bg-gray-800 ${isDragging ? 'opacity-50' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => handleToggle(key)}
        title={visible ? 'Hide section' : 'Show section'}
      >
        {visible ? <Eye className="w-5 h-5 text-green-600" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
      </Button>
    </div>
  );
};

const AdminHomepageManager = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  const fetchSections = async () => {
    try {
      const { data } = await axios.get('/api/homepage/sections');
      setSections(data);
    } catch (err) {
      console.error('Failed to fetch sections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleToggle = (key) => {
    setSections(prev =>
      prev.map(s => s.key === key ? { ...s, visible: !s.visible } : s)
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = sections.findIndex(s => s.key === active.id);
      const newIndex = sections.findIndex(s => s.key === over.id);
      setSections((sections) => arrayMove(sections, oldIndex, newIndex));
    }
  };

  const saveChanges = async () => {
    const updates = sections.map((s, index) => ({ key: s.key, visible: s.visible, order: index }));
    try {
      await axios.put('/api/homepage/sections', updates);
      alert('Homepage sections updated');
    } catch (err) {
      alert('Failed to update sections');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary dark:text-white">Homepage Sections Manager</h1>
        <div className="flex gap-2">
          <Button onClick={fetchSections} size="sm" variant="outline">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={saveChanges} size="sm">
            <Save className="w-4 h-4 mr-1" /> Save
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={sections.map((s) => s.key)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {sections.map((section) => (
                <SortableRowWrapper key={section.key} section={section} handleToggle={handleToggle} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

const SortableRowWrapper = ({ section, handleToggle }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.key,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <SortableRow
        section={section}
        attributes={attributes}
        listeners={listeners}
        isDragging={isDragging}
        handleToggle={handleToggle}
      />
    </div>
  );
};

export default AdminHomepageManager;
