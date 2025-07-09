// src/pages/admin/pages/CreateProduct.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, UploadCloudIcon } from 'lucide-react';
import axios from 'axios';

const categories = ['sneakers', 'men', 'women', 'kids', 'sports', 'deals'];

const CreateProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    countInStock: '',
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = new FormData();
    productData.append('name', formData.name);
    productData.append('brand', formData.brand);
    productData.append('category', formData.category);
    productData.append('description', formData.description);
    productData.append('price', formData.price);
    productData.append('countInStock', formData.countInStock);

    formData.images.forEach((img) => {
      productData.append('images', img);
    });

    try {
      setLoading(true);
      const res = await axios.post('/api/products', productData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      alert('Product created successfully!');
      navigate('/admin/products');
    } catch (error) {
      alert(error?.response?.data?.message || 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary dark:text-white">
          Add New Product
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-primary hover:underline"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white dark:bg-gray-900 p-6 rounded-xl shadow"
      >
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
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
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
            <UploadCloudIcon className="w-4 h-4" /> Product Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="input w-full"
            onChange={handleImageUpload}
          />
          {previewImages.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {previewImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`preview-${idx}`}
                  className="w-full h-28 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
