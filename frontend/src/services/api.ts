import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authUtils } from '@/utils/auth.utils';
import { ApiError } from '@/types/api.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = authUtils.getToken();
        console.log('🔑 [API Request]', config.url, 'Token:', token ? '✅ Present' : '❌ Missing');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Errors globally
api.interceptors.response.use(
    (response) => response, // Return full response
    (error: AxiosError) => {
        let apiError: ApiError = {
            message: 'An unexpected error occurred',
            status: 500,
        };

        if (error.response) {
            // Server responded with error
            const data = error.response.data as any;
            apiError = {
                message: data.message || error.message,
                status: error.response.status,
                errors: data.errors,
            };

            // Handle 401 Unauthorized
            if (error.response.status === 401) {
                // Optional: Trigger logout or refresh token logic
                // authUtils.removeToken(); 
                // window.location.href = '/login'; // Or use a cleaner routing method
            }
        } else if (error.request) {
            // Request made but no response
            apiError.message = 'No response from server. Check your internet connection.';
            apiError.status = 0;
        } else {
            // Setup error
            apiError.message = error.message;
        }

        console.error('API Error:', apiError);
        return Promise.reject(apiError);
    }
);
