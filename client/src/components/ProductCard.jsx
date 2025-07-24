import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const isLowStock = product.quantity <= product.threshold;

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
      isLowStock ? 'border-red-500' : 'border-green-500'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
        {isLowStock && (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Low Stock
          </span>
        )}
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Category:</span>
          <span className="text-sm font-medium">{product.category}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Quantity:</span>
          <span className={`text-sm font-medium ${
            isLowStock ? 'text-red-600' : 'text-green-600'
          }`}>
            {product.quantity}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Threshold:</span>
          <span className="text-sm font-medium">{product.threshold}</span>
        </div>
      </div>
      
      <Link
        to={`/products/${product.id}`}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200 block text-center"
      >
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;