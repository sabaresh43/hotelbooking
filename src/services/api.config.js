import axios from 'axios';

const getEmployeeId = () => localStorage.getItem('employeeId') || "HR-EMP-00001";
const getToken = () => "92ff0ef8f5fb1b6:54436a5f1092d34" || "92ff0ef8f5fb1b6:54436a5f1092d34";

// Create axios instance with base configuration
const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, // We'll update this with the real API base URL later
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        const employeeId = getEmployeeId();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.headers['token'] = token; // If API expects 'token' header
        }

        // ✅ Add employee_id to headers
        if (employeeId) {
            config.headers['employee_id'] = employeeId;
        }

        // ✅ Add employee_id to request body for POST/PUT/PATCH
        if (['post', 'put', 'patch'].includes(config.method?.toLowerCase())) {
            if (config.data && typeof config.data === 'object') {
                // Don't override if employee_id already exists in payload
                if (!config.data.employee_id) {
                    config.data = {
                        ...config.data,
                        employee_id: employeeId
                    };
                }
            }
        }

        // ✅ Add employee_id to query params for GET/DELETE
        if (['get', 'delete'].includes(config.method?.toLowerCase())) {
            config.params = {
                ...config.params,
                employee_id: employeeId
            };
        }

        console.log('🚀 API Request:', {
            method: config.method,
            url: config.url,
            token: token ? '✓' : '✗',
            employeeId: employeeId
        });
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle specific error cases here
            if (error.response.status === 401) {
                // Handle unauthorized access
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;