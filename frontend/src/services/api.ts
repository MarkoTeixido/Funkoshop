import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authUtils } from '@/utils/auth.utils';
import { ApiError } from '@/types/api.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
        const url = config.url || '';
        let token: string | null = null;

        // Select token based on Endpoint
        // Backend routes: /admin/* -> Admin Token, /shop/* -> Shop Token
        if (url.startsWith('/admin') || url.includes('/auth/login/admin')) {
            token = authUtils.getAdminToken();
            console.log('🛡️ [API Request] Admin Context:', url);
        } else {
            token = authUtils.getShopToken();
            console.log('🛍️ [API Request] Shop Context:', url);
        }

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔑 [API] Attaching Token:', token.substring(0, 10) + '...');
        } else {
            console.log('⚠️ [API] No token found for request to:', url);
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
                message: data.message || data.error || error.message,
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

        // Log only in development
        if (process.env.NODE_ENV === 'development') {
            console.warn('🔥 [API Error]', apiError.status, '-', apiError.message);
            if (apiError.errors) {
                console.warn('Validation errors:', apiError.errors);
            }
        }

        return Promise.reject(apiError);
    }
);
