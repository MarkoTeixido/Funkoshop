import { api } from './api';
import { Product, ProductDTO } from '@/types/product.types';
import { PaginatedResponse } from '@/types/api.types';

export const productService = {
    // Public Shop Endpoints
    getAll: async (params?: Record<string, string | number>): Promise<PaginatedResponse<Product>> => {
        // Backend currently returns all products or filtered by query.
        // Assuming /shop returns list.
        const response = await api.get<PaginatedResponse<Product>>('/shop', { params });
        return response.data; // return data array
    },

    getCategories: async (): Promise<{ licence_id: number, licence_name: string }[]> => {
        const response = await api.get<{ licence_id: number, licence_name: string }[]>('/shop/categories');
        return response.data;
    },

    getById: async (id: number): Promise<{ product: Product, related: Product[] }> => {
        const response = await api.get<{ product: Product, related: Product[] }>(`/shop/item/${id}`);
        return response.data;
    },

    // Admin Endpoints
    getAdminDashboard: async (token?: string): Promise<Product[]> => {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await api.get<Product[]>('/admin/dashboard', config);
        return response.data;
    },

    create: async (data: ProductDTO): Promise<Product> => {
        const response = await api.post<Product>('/admin/products', data);
        return response.data;
    },

    update: async (id: number, data: Partial<ProductDTO>): Promise<Product> => {
        const response = await api.put<Product>(`/admin/products/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/admin/products/${id}`);
    }
};
