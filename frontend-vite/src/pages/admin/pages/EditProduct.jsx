// src/pages/admin/pages/EditProduct.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, UploadCloudIcon } from 'lucide-react';
import axios from 'axios';

const categories = ['sneakers', 'men', 'women', 'kids', 'sports', 'deals'];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: 0,
    countInStock: 0,
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setFormData({
          name: data.name,
          brand: data.brand,
          category: data.category,
          description: data.description,
          price: data.price,
          countInStock: data.countInStock,
          images: data.images || [],
        });
        setPreviewImages(data.images || []);
        setLoading(false);
      } catch (err) {
        alert('Failed to load product');
        navigate('/admin/products');
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
    const preview = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(preview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'images') {
        value.forEach((img) => updatedData.append('images', img));
      } else {
        updatedData.append(key, value);
      }
    });

    try {
      await axios.put(`/api/products/${id}`, updatedData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Product updated');
      navigate('/admin/products');
    } catch (err) {
      alert('Failed to update product');
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary dark:text-white">Edit Product</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-primary hover:underline"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
        <div>
          <label className="form-label">Product Name</label>
          <input
            name="name"
            type="text"
            className="input w-full"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Brand</label>
            <input
              name="brand"
              type="text"
              className="input w-full"
              value={formData.brand}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label">Category</label>
            <select
              name="category"
              className="input w-full"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="input w-full"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Price (KSh)</label>
            <input
              name="price"
              type="number"
              className="input w-full"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label">Stock Count</label>
            <input
              name="countInStock"
              type="number"
              className="input w-full"
              value={formData.countInStock}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="form-label flex items-center gap-2">
            <UploadCloudIcon className="w-4 h-4" /> Replace Product Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="input w-full"
            onChange={handleImageUpload}
          />
          <p className="text-xs text-gray-500 mt-1">
            Uploading new files will replace old images.
          </p>
          <div className="flex gap-2 mt-2">
            {previewImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="preview"
                className="w-16 h-16 object-cover rounded border"
              />
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary w-full mt-4 py-2 text-sm font-medium">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;


