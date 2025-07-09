// src/admin/pages/AdminFileManager.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, UploadCloud, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminFileManager = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const fetchFiles = async () => {
    try {
      const { data } = await axios.get('/api/admin/uploads');
      setFiles(data);
    } catch (err) {
      toast.error('Failed to load files');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles.length) return;

    const formData = new FormData();
    for (let file of selectedFiles) {
      formData.append('files', file);
    }

    try {
      setUploading(true);
      await axios.post('/api/admin/uploads', formData);
      toast.success('Upload successful');
      fetchFiles();
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (publicId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await axios.delete(`/api/admin/uploads/${publicId}`);
      toast.success('File deleted');
      fetchFiles();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied!');
  };

  const formatSize = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary dark:text-white">File Upload Manager</h1>
        <label className="inline-flex items-center gap-2 text-sm cursor-pointer text-primary font-medium">
          <UploadCloud className="w-5 h-5" />
          <span>Upload Files</span>
          <input
            type="file"
            multiple
            onChange={handleUpload}
            className="hidden"
            ref={fileInputRef}
          />
        </label>
      </div>

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-blue-600 mb-4">
          <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {files.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">No files uploaded yet.</p>
        ) : (
          files.map((file) => (
            <div
              key={file.public_id}
              className="bg-white dark:bg-gray-900 rounded shadow p-2 text-xs relative group"
            >
              {file.url?.match(/\.(jpeg|jpg|png|gif|webp|svg)$/i) ? (
                <img
                  src={file.url}
                  alt={file.public_id}
                  className="w-full h-32 object-cover rounded"
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center rounded text-gray-500 text-center">
                  <span>{file.resource_type?.toUpperCase() || 'File'}</span>
                  <span>{file.format?.toUpperCase()}</span>
                </div>
              )}
              <p className="mt-1 truncate" title={file.public_id}>{file.public_id}</p>
              <div className="text-muted text-[10px] truncate">
                {file.bytes ? formatSize(file.bytes) : ''}
              </div>
              <div className="flex justify-between mt-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copyToClipboard(file.url)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDelete(file.public_id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminFileManager;