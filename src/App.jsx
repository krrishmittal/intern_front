import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home";
import Opportunities from "./components/Opportunities";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Navbar from "./components/navbar";
import Profile from "./components/Profile_new";
import "./styles.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Dark Mode Context
const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply dark mode class to html element
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add('dark');
      htmlElement.setAttribute('data-theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.setAttribute('data-theme', 'light');
    }
    
    // Also apply to body for extra compatibility
    const bodyElement = document.body;
    if (isDarkMode) {
      bodyElement.classList.add('dark');
    } else {
      bodyElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    console.log('Dark mode toggling from', isDarkMode, 'to', !isDarkMode);
    setIsDarkMode(!isDarkMode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
          <ToastContainer
            position="bottom-right"
            autoClose={1500}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            pauseOnHover={false}
            style={{ marginTop: "4rem"}}
            theme={isDarkMode ? "dark" : "light"}
          />
        </BrowserRouter>
      </div>
    </DarkModeContext.Provider>
  );
}

export default App;
