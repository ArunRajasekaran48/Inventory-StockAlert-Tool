import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState('');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productService.getProductById(id);
      setProduct(response.data);
    } catch (error) {
      toast.error('Failed to fetch product details');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleStockRequest = async (e) => {
    e.preventDefault();
    
    const requestQuantity = parseInt(quantity);
    if (isNaN(requestQuantity) || requestQuantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (requestQuantity > product.quantity) {
      toast.error('Insufficient stock available');
      return;
    }

    setRequesting(true);
    try {
      const response = await productService.reduceStock(id, requestQuantity);
      setProduct(response.data);
      setQuantity('');
      toast.success(`Successfully requested ${requestQuantity} units`);
    } catch (error) {
      console.error('Stock request error:', error);
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Product not found.</p>
      </div>
    );
  }

  const isLowStock = product.quantity <= product.threshold;

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/products')}
        className="mb-6 text-blue-600 hover:text-blue-500 flex items-center"
      >
        ← Back to Products
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          {isLowStock && (
            <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded">
              Low Stock Alert
            </span>
          )}
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{product.description || 'No description available'}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Category</h3>
              <p className="text-gray-600">{product.category}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Available Stock</h3>
              <p className={`text-2xl font-bold ${
                isLowStock ? 'text-red-600' : 'text-green-600'
              }`}>
                {product.quantity} units
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Stock Threshold</h3>
              <p className="text-gray-600">{product.threshold} units</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Request Stock</h3>
          <form onSubmit={handleStockRequest} className="flex space-x-4">
            <div className="flex-1">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity to request"
                min="1"
                max={product.quantity}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={requesting || product.quantity === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded transition duration-200"
            >
              {requesting ? 'Processing...' : 'Request'}
            </button>
          </form>
          {product.quantity === 0 && (
            <p className="text-red-600 text-sm mt-2">This product is out of stock.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;