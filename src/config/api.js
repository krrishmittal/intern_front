/**
 * Centralized API Configuration
 * 
 * This file contains all API endpoints and configuration.
 * To change the backend URL for different environments:
 * 1. Update the BASE_URL in API_CONFIG below
 * 2. All fetch calls across the app will automatically use the new URL
 * 
 * Usage examples:
 * - import { API_ENDPOINTS, getAuthHeaders } from '../config/api'
 * - fetch(API_ENDPOINTS.LOGIN, { method: 'POST', headers: getAuthHeaders() })
 * - fetch(buildApiUrl(API_ENDPOINTS.APPLIED, id), { method: 'DELETE' })
 */

// API Configuration
const API_CONFIG = {
  // IMPORTANT: Change this value to switch between environments
  // Set to 'development', 'staging', or 'production'
  ENVIRONMENT: 'production',
  
  // All environment URLs defined in one place
  URLS: {
    development: 'http://localhost:4000',
    staging: 'https://internship-backend-bkhn.onrender.com',
    production: 'https://internship-backend-bkhn.onrender.com'
  },
  
  // This automatically selects the right BASE_URL based on the environment
  get BASE_URL() {
    return this.URLS[this.ENVIRONMENT] || this.URLS.development;
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  LOGIN: `${API_CONFIG.BASE_URL}/auth/login`,
  SIGNUP: `${API_CONFIG.BASE_URL}/auth/signup`,
  PROFILE: `${API_CONFIG.BASE_URL}/auth/profile`,
  PROFILE_SKILLS: `${API_CONFIG.BASE_URL}/auth/profile/skills`,
  PROFILE_PROJECTS: `${API_CONFIG.BASE_URL}/auth/profile/projects`,
  PROFILE_EXPERIENCE: `${API_CONFIG.BASE_URL}/auth/profile/experience`,
  PROFILE_EDUCATION: `${API_CONFIG.BASE_URL}/auth/profile/education`,
  LOGOUT: `${API_CONFIG.BASE_URL}/auth/logout`,
  
  // Application endpoints
  APPLIED: `${API_CONFIG.BASE_URL}/auth/applied`,
  APPLY: `${API_CONFIG.BASE_URL}/auth/apply`,
  
  // Opportunities endpoints
  OPPORTUNITIES: `${API_CONFIG.BASE_URL}/opportunities`,
};

// Helper function to build dynamic URLs (for IDs, etc.)
export const buildApiUrl = (endpoint, id = null) => {
  if (id) {
    return `${endpoint}/${id}`;
  }
  return endpoint;
};

// Common fetch configuration
export const API_CONFIG_FETCH = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

/**
 * Helper function for file uploads - doesn't set Content-Type
 * @returns {Object} Headers for file upload requests
 */
export const getFileUploadHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    // Content-Type is deliberately omitted to let the browser set it with the boundary parameter
  };
};

export default API_CONFIG;
