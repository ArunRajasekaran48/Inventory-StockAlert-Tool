import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/api';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAdmin()) {
      fetchUnreadCount();
      // Poll for notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <nav className="bg-blue-600 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-white text-xl font-bold">
              Inventory System
            </Link>
            <div className="space-x-4">
              <Link to="/login" className="text-white hover:text-blue-200">
                Login
              </Link>
              <Link to="/signup" className="text-white hover:text-blue-200">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-white text-xl font-bold">
            Inventory System
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/products" className="text-white hover:text-blue-200">
              Products
            </Link>
            
            {isAdmin() && (
              <>
                <Link to="/admin" className="text-white hover:text-blue-200">
                  Admin Dashboard
                </Link>
                <div className="relative">
                  <Link to="/admin" className="text-white hover:text-blue-200">
                    <span className="text-2xl">🔔</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </div>
              </>
            )}
            
            <div className="flex items-center space-x-4">
              <span className="text-white">
                Welcome, {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
