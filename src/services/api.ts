
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle token expiration
    if (response && response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

// Donor APIs
export const donorApi = {
  registerProfile: (data: any) => api.post('/donors/register-profile', data),
  submitConsent: (data: any) => api.post('/donors/consent', data),
  getDashboard: () => api.get('/donors/dashboard'),
  updateProfile: (data: any) => api.put('/donors/profile-update', data),
};

// Hospital APIs
export const hospitalApi = {
  updateDonorHealth: (donorDbId: string, data: any) => 
    api.put(`/hospital/donor-health/${donorDbId}`, data),
  requestOrgan: (data: any) => api.post('/hospital/request-organ', data),
  findMatches: (organRequestId: string) => 
    api.get(`/hospital/find-matches/${organRequestId}`),
  initiateTransplant: (data: any) => api.post('/hospital/initiate-transplant', data),
  recordRecovery: (transplantLogId: string, data: any) => 
    api.post(`/hospital/record-recovery/${transplantLogId}`, data),
  recordCompletion: (transplantLogId: string, data: any) => 
    api.post(`/hospital/record-completion/${transplantLogId}`, data),
};

// Tracking APIs
export const trackingApi = {
  getTransplantLog: (trackingId: string) => api.get(`/tracking/${trackingId}`),
  updateStatus: (transplantLogId: string, data: any) => 
    api.post(`/tracking/${transplantLogId}/update-status`, data),
};

// Token APIs
export const tokenApi = {
  getBalance: () => api.get('/tokens/balance'),
  redeem: (data: any) => api.post('/tokens/redeem', data),
};

// Support APIs (to be implemented in backend)
export const supportApi = {
  donate: (data: any) => api.post('/support/donate', data),
};

// Partnership APIs (to be implemented in backend)
export const partnershipApi = {
  registerInterest: (data: any) => api.post('/partnerships/register-interest', data),
};

export default api;
