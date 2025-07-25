import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { notificationService } from "../services/api"

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [navColor, setNavColor] = useState("blue") // NEW STATE

  useEffect(() => {
    if (isAdmin()) {
      fetchUnreadCount()
      // Poll for notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount()
      setUnreadCount(response.data)
    } catch (error) {
      console.error("Error fetching unread count:", error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  if (!user) {
    return (
      <nav className={
        navColor === "green"
          ? "bg-gradient-to-r from-green-600 to-green-700 shadow-xl border-b border-green-500"
          : "bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl border-b border-blue-500"
      }>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className={
                navColor === "green"
                  ? "bg-white bg-opacity-20 rounded-lg p-2 border border-green-500"
                  : "bg-white bg-opacity-20 rounded-lg p-2"
              }>
                <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke={navColor === "green" ? "#16a34a" : "#2563eb"}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
              </div>
              <span className="text-white text-2xl font-bold">Inventory Pro</span>
            </Link>

            <div className="hidden md:flex space-x-6">
              <Link
                to="/login"
                className="text-white hover:text-blue-700 font-medium transition duration-200 px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10"
                onClick={() => setNavColor("blue")}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-white text-green-600 hover:bg-green-50 font-semibold px-6 py-2 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
                onClick={() => setNavColor("green")}
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-blue-200 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="text-white hover:text-blue-200 font-medium px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition duration-200"
                  onClick={() => { setIsMenuOpen(false); setNavColor("blue"); }}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-green-600 hover:bg-green-50 font-semibold px-4 py-2 rounded-lg transition duration-200"
                  onClick={() => { setIsMenuOpen(false); setNavColor("green"); }}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl border-b border-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <span className="text-white text-2xl font-bold">Inventory Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/products"
              className="text-white hover:text-blue-200 font-medium transition duration-200 px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span>Products</span>
            </Link>

            {isAdmin() && (
              <>
                <Link
                  to="/admin"
                  className="text-white hover:text-blue-200 font-medium transition duration-200 px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span>Dashboard</span>
                </Link>

                <div className="relative">
                  <Link
                    to="/admin"
                    className="text-white hover:text-blue-200 transition duration-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-10 flex items-center"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h10V9H4v2z"
                      />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>
                </div>
              </>
            )}

            <div className="flex items-center space-x-4 border-l border-blue-500 pl-6">
              <div className="text-white">
                <p className="font-medium">Welcome, {user.name}</p>
                <p className="text-xs text-blue-200 capitalize">{user.role} Account</p>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-200 focus:outline-none p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-blue-500 pt-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/products"
                className="text-white hover:text-blue-200 font-medium px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition duration-200 flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <span>Products</span>
              </Link>

              {isAdmin() && (
                <Link
                  to="/admin"
                  className="text-white hover:text-blue-200 font-medium px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition duration-200 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span>Dashboard</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )}

              <div className="border-t border-blue-500 pt-3 mt-3">
                <div className="text-white px-4 py-2">
                  <p className="font-medium">Welcome, {user.name}</p>
                  <p className="text-xs text-blue-200 capitalize">{user.role} Account</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-200 mx-4 mt-2 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
