// Central API configuration
// In production, set VITE_API_BASE_URL to your Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default API_BASE_URL;
