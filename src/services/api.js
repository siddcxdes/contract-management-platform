import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || 'An error occurred';
        console.error('API Error:', message);
        throw new Error(message);
    }
);

// Blueprint API calls
export const blueprintAPI = {
    getAll: () => api.get('/blueprints'),
    getById: (id) => api.get(`/blueprints/${id}`),
    create: (data) => api.post('/blueprints', data),
    update: (id, data) => api.put(`/blueprints/${id}`, data),
    delete: (id) => api.delete(`/blueprints/${id}`)
};

// Contract API calls
export const contractAPI = {
    getAll: (filter) => {
        const params = filter ? { filter } : {};
        return api.get('/contracts', { params });
    },
    getById: (id) => api.get(`/contracts/${id}`),
    create: (data) => api.post('/contracts', data),
    updateFields: (id, fields) => api.put(`/contracts/${id}`, { fields }),
    changeState: (id, newState) => api.patch(`/contracts/${id}/state`, { newState }),
    delete: (id) => api.delete(`/contracts/${id}`)
};

export default api;
