import React, { useState, useEffect } from 'react';
import { productService, notificationService } from '../services/api';
import ProductForm from '../components/ProductForm';
import NotificationList from '../components/NotificationList';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, lowStockRes, notificationsRes] = await Promise.all([
        productService.getAllProducts(),
        productService.getLowStockProducts(),
        notificationService.getNotifications()
      ]);

      setProducts(productsRes.data);
      setLowStockProducts(lowStockRes.data);
      setNotifications(notificationsRes.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      await productService.createProduct(productData);
      toast.success('Product created successfully!');
      setShowProductForm(false);
      fetchData();
    } catch (error) {
      console.error('Create product error:', error);
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      await productService.updateProduct(editingProduct.id, productData);
      toast.success('Product updated successfully!');
      setEditingProduct(null);
      setShowProductForm(false);
      fetchData();
    } catch (error) {
      console.error('Update product error:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        toast.success('Product deleted successfully!');
        fetchData();
      } catch (error) {
        console.error('Delete product error:', error);
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleMarkNotificationAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      toast.success('Notification marked as read');
      fetchData();
    } catch (error) {
      console.error('Mark notification as read error:', error);
    }
  };

  const handleFormCancel = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const TabButton = ({ tabId, label, count }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
        activeTab === tabId
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600">{products.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Low Stock Items</h3>
          <p className="text-3xl font-bold text-red-600">{lowStockProducts.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Unread Notifications</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {notifications.filter(n => !n.read).length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-4">
            <TabButton tabId="products" label="Manage Products" />
            <TabButton 
              tabId="lowstock" 
              label="Low Stock" 
              count={lowStockProducts.length > 0 ? lowStockProducts.length : undefined}
            />
            <TabButton 
              tabId="notifications" 
              label="Notifications" 
              count={notifications.filter(n => !n.read).length > 0 ? notifications.filter(n => !n.read).length : undefined}
            />
          </div>
        </div>

        <div className="p-6">
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Product Management</h2>
                <button
                  onClick={() => setShowProductForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
                >
                  Add New Product
                </button>
              </div>

              {showProductForm && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingProduct ? 'Update Product' : 'Create New Product'}
                  </h3>
                  <ProductForm
                    product={editingProduct}
                    onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
                    onCancel={handleFormCancel}
                  />
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-left">Quantity</th>
                      <th className="px-4 py-2 text-left">Threshold</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-200">
                        <td className="px-4 py-2 font-medium">{product.name}</td>
                        <td className="px-4 py-2">{product.category}</td>
                        <td className="px-4 py-2">
                          <span className={`font-medium ${
                            product.quantity <= product.threshold ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {product.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-2">{product.threshold}</td>
                        <td className="px-4 py-2">
                          {product.quantity <= product.threshold ? (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                              Low Stock
                            </span>
                          ) : (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Low Stock Tab */}
          {activeTab === 'lowstock' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Low Stock Products</h2>
              {lowStockProducts.length === 0 ? (
                <p className="text-gray-500">No low stock products at the moment.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-red-600 font-medium">
                          {product.quantity} / {product.threshold}
                        </span>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
                        >
                          Update Stock
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Stock Alert Notifications</h2>
              <NotificationList
                notifications={notifications}
                onMarkAsRead={handleMarkNotificationAsRead}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;