import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDarkMode } from "../App";
import { API_ENDPOINTS, getAuthHeaders } from "../config/api";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in by looking for token
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserData();
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
    // This will run whenever the location changes (like navigating to logout)
  }, [location.pathname]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PROFILE, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      // Silently handle error, user experience won't be affected
    }
  };

  const handleLogout = () => {
    // Immediately update local state to reflect logout
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("token");
    navigate("/logout");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Get user's initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return '?';
    return user.name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className={`backdrop-blur-md border-b px-2 sm:px-4 py-2 sticky top-0 z-50 shadow-sm transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900/90 border-gray-700' 
        : 'bg-white/90 border-gray-100'
    }`}>
      <div className="flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center">
          {/* Mobile Menu Button - Moved to the left */}
          <button 
            className={`md:hidden p-1.5 mr-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-800 text-gray-200' 
                : 'hover:bg-gray-100/70 text-gray-700'
            }`}
            onClick={toggleMenu}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm sm:text-base">I</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InternHub
              </span>
              <p className={`text-xs -mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Find your dream internship</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`${menuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-full md:top-0 left-0 md:left-auto w-full md:w-auto md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b md:border-none flex-col md:flex-row md:items-center md:space-x-2 ${
          isDarkMode 
            ? 'bg-gray-900/95 border-gray-700' 
            : 'bg-white/95 border-gray-100'
        }`}>
          {/* Mobile view gets consistent padding and styling */}
          <div className="md:hidden px-4 py-3 border-b border-gray-700/20 flex justify-between items-center">
            <span className={`font-medium text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Navigation Menu
            </span>
            <button 
              onClick={closeMenu}
              className={`p-1 rounded-md ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100/70 text-gray-700 hover:bg-gray-200/70'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row w-full md:items-center">
            <Link 
              to="/" 
              onClick={closeMenu}
              className={`transition-colors text-sm font-medium px-5 py-3 md:px-3 md:py-1.5 md:rounded-md ${location.pathname === "/" 
                ? "text-blue-600 font-semibold hover:text-blue-700 transition-colors relative md:bg-blue-50/50" 
                : isDarkMode 
                  ? 'text-gray-300 hover:text-white md:hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 md:hover:bg-gray-100/70'
              }`}
            >
              HOME
              {location.pathname === "/" && <div className="hidden md:block absolute -bottom-0.5 left-0 w-full h-0.5 bg-blue-600 rounded-full"></div>}
            </Link>
            <Link 
              to="/opportunities" 
              onClick={closeMenu}
              className={`transition-colors text-sm font-medium px-5 py-3 md:px-3 md:py-1.5 md:rounded-md ${location.pathname === "/opportunities" 
                ? "text-blue-600 font-semibold hover:text-blue-700 transition-colors relative md:bg-blue-50/50" 
                : isDarkMode 
                  ? 'text-gray-300 hover:text-white md:hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 md:hover:bg-gray-100/70'
              }`}
            >
              OPPORTUNITIES
              {location.pathname === "/opportunities" && <div className="hidden md:block absolute -bottom-0.5 left-0 w-full h-0.5 bg-blue-600 rounded-full"></div>}
            </Link>
            {isLoggedIn && (
              <Link 
                to="/dashboard" 
                onClick={closeMenu}
                className={`transition-colors text-sm font-medium px-5 py-3 md:px-3 md:py-1.5 md:rounded-md ${location.pathname === "/dashboard" 
                  ? "text-blue-600 font-semibold hover:text-blue-700 transition-colors relative md:bg-blue-50/50" 
                  : isDarkMode 
                    ? 'text-gray-300 hover:text-white md:hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-gray-900 md:hover:bg-gray-100/70'
                }`}
              >
                DASHBOARD
                {location.pathname === "/dashboard" && <div className="hidden md:block absolute -bottom-0.5 left-0 w-full h-0.5 bg-blue-600 rounded-full"></div>}
              </Link>
            )}
          </div>
        </nav>
        
        {/* User Profile / Auth */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-1.5 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-800' 
                : 'hover:bg-gray-100/70'
            }`}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          {isLoggedIn ? (
            <div className="relative">
              <div 
                className={`flex items-center space-x-2 cursor-pointer rounded-lg p-1.5 transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-800' 
                    : 'hover:bg-gray-100/70'
                }`}
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-semibold">{getUserInitials()}</span>
                </div>
                <div className="hidden sm:block">
                  <span className={`font-semibold text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user ? (user.name || user.username) : 'User'}</span>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Student</p>
                </div>
              </div>
              
              {/* User Dropdown */}
              {showUserDropdown && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1.5 z-10 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                } border backdrop-blur-md ${isDarkMode ? 'bg-opacity-90' : 'bg-opacity-95'}`}>
                  <Link 
                    to="/profile" 
                    onClick={() => {closeMenu(); setShowUserDropdown(false);}}
                    className={` px-4 py-1.5 text-sm transition-colors flex items-center space-x-2 ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700/70' 
                        : 'text-gray-700 hover:bg-gray-100/70'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                  </Link>
                  <div className={`my-1 h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <button 
                    onClick={() => {handleLogout(); closeMenu(); setShowUserDropdown(false);}}
                    className={` w-full text-left px-4 py-1.5 text-sm transition-colors flex items-center space-x-2 ${
                      isDarkMode 
                        ? 'text-red-400 hover:bg-gray-700/70' 
                        : 'text-red-500 hover:bg-gray-100/70'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link 
                to="/login" 
                onClick={closeMenu}
                className={`transition-colors font-medium text-sm px-3 py-1.5 rounded-lg ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                }`}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                onClick={closeMenu}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors text-sm"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;