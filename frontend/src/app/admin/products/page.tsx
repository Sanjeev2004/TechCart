'use client';

import { useState, useEffect } from 'react';
import api from '../../../../services/api';
import { Loader2, Edit, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data.products);
    } catch (err: any) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error deleting product');
      }
    }
  };

  const createProductHandler = async () => {
    try {
      // In a real app, this might redirect to a 'Create Product' page with a form.
      // For this implementation, we simulate an API call to a POST /products endpoint.
      // Wait, our backend POST /api/products creates a sample product automatically.
      const { data } = await api.post('/products');
      toast.success('Sample product created');
      fetchProducts();
      // router.push(`/admin/products/${data._id}/edit`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error creating product');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  if (error) return <div className="text-red-500 font-bold">{error}</div>;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Products</h1>
        <button 
          onClick={createProductHandler}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Create Product</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium text-gray-700 rounded-tl-lg">ID</th>
              <th className="p-4 font-medium text-gray-700">NAME</th>
              <th className="p-4 font-medium text-gray-700">PRICE</th>
              <th className="p-4 font-medium text-gray-700">CATEGORY</th>
              <th className="p-4 font-medium text-gray-700">BRAND</th>
              <th className="p-4 font-medium text-gray-700 rounded-tr-lg text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="p-4 font-mono text-sm text-gray-600">{product._id.substring(0, 10)}...</td>
                <td className="p-4 font-medium text-gray-900">{product.name}</td>
                <td className="p-4 text-gray-700">${product.price.toFixed(2)}</td>
                <td className="p-4 text-gray-700">{product.category}</td>
                <td className="p-4 text-gray-700">{product.brand}</td>
                <td className="p-4 flex justify-end space-x-3">
                  <button className="text-blue-600 hover:text-blue-800 p-2 bg-blue-50 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteHandler(product._id)} className="text-red-600 hover:text-red-800 p-2 bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
