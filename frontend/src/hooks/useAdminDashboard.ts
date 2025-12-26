import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/product.service';
import { Product } from '@/types/product.types';

export function useAdminDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await productService.getAdminDashboard();
            setProducts(data);
        } catch (err: any) {
            const message = err.message || 'Error fetching admin dashboard';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteProduct = useCallback(async (id: number) => {
        // Confirmation is now handled by the UI component


        try {
            await productService.delete(id);
            setProducts(prev => prev.filter(p => p.product_id !== id));
        } catch (err: any) {
            throw err;
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return {
        products,
        loading,
        error,
        refresh: fetchDashboardData,
        deleteProduct
    };
}
