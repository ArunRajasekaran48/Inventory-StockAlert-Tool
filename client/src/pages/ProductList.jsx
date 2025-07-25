import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import ProductForm from '../components/ProductForm';
import { useAuth } from '../context/AuthContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditProduct(null);
    setShowForm(true);
  };
  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };
  const handleFormClose = () => setShowForm(false);
  const handleFormSubmit = async (productData) => {
    try {
      if (editProduct) {
        // Update product
        await productService.updateProduct(editProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        // Add new product
        await productService.createProduct(productData);
        toast.success('Product created successfully');
      }
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const filteredProducts = products.filter(product => {
    if (filter === 'low-stock') {
      return product.quantity <= product.threshold;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        
        <div className="flex space-x-4">
          {isAdmin() && (
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition duration-200"
            >
              Add New Product
            </button>
          )}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Products</option>
            <option value="low-stock">Low Stock Only</option>
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {filter === 'low-stock' ? 'No low stock products found.' : 'No products found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onEdit={handleEdit} />
          ))}
        </div>
      )}
      {showForm && (
        <ProductForm
          product={editProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
        />
      )}
    </div>
  );
};

export default ProductList;