import { Link } from "react-router-dom"

const ProductCard = ({ product }) => {
  const isLowStock = product.quantity <= product.threshold

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Status indicator */}
      <div
        className={`h-2 ${isLowStock ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-green-500 to-green-600"}`}
      ></div>

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1 pr-2">{product.name}</h3>
          {isLowStock && (
            <span className="flex-shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              Low Stock
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
          {product.description || "No description available for this product."}
        </p>

        {/* Product Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span className="text-sm text-gray-500 font-medium">Category</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span className="text-sm text-gray-500 font-medium">Stock</span>
            </div>
            <span
              className={`text-sm font-bold px-3 py-1 rounded-full ${
                isLowStock
                  ? "text-red-700 bg-red-100 border border-red-200"
                  : "text-green-700 bg-green-100 border border-green-200"
              }`}
            >
              {product.quantity} units
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span className="text-sm text-gray-500 font-medium">Threshold</span>
            </div>
            <span className="text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
              {product.threshold} units
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/products/${product.id}`}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 group"
        >
          <span>View Details</span>
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default ProductCard
