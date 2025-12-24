import { useState, useCallback, useEffect } from 'react';
import { cartService } from '@/services/cart.service';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/types/product.types';

export interface CartItem {
    cart_item_id: number;
    quantity: number;
    product_id: number;
    Product: Product;
}

export function useCart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const toast = useToast();

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const data = await cartService.getCart();
            // Type safe check: data should be object with CartItems or items
            const items = (data as any).CartItems || (data as any).items || [];
            setCartItems(items);
        } catch (err: any) {
            console.error("Error fetching cart", err);
            setError(err.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const addToCart = useCallback(async (productId: number, quantity: number = 1) => {
        if (!isAuthenticated) {
            router.push("/shop/login");
            return;
        }

        setLoading(true);
        try {
            await cartService.addToCart(productId, quantity);

            toast.success(
                '¡Producto agregado!',
                'Tu nuevo coleccionable está en el carrito.',
                {
                    label: 'Ir al Carrito',
                    onClick: () => {
                        router.push('/shop/cart');
                        fetchCart();
                    }
                }
            );

        } catch (err: any) {
            toast.error('Error', err.message || 'Error al agregar al carrito');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, router, fetchCart, toast]);

    const updateQuantity = useCallback(async (productId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        try {
            // Optimistic update could go here
            await cartService.updateItem(productId, newQuantity);

            setCartItems(prev => prev.map(item =>
                item.product_id === productId ? { ...item, quantity: newQuantity } : item
            ));
        } catch (err: any) {
            console.error(err);
            fetchCart(); // Revert on error
        }
    }, []);

    const removeItem = useCallback(async (productId: number) => {
        try {
            await cartService.removeItem(productId);
            setCartItems(prev => prev.filter(item => item.product_id !== productId));
        } catch (err) {
            console.error(err);
        }
    }, []);

    const checkout = useCallback(async (formData: any) => {
        setLoading(true);
        try {
            // Assuming checkout endpoint
            const response = await cartService.checkout(formData);
            setCartItems([]);
            return response;
        } catch (err: any) {
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const subtotal = cartItems.reduce((acc, item) => {
        const price = typeof item.Product.price === 'string' ? parseFloat(item.Product.price) : item.Product.price;
        return acc + (price * item.quantity);
    }, 0);

    return {
        cartItems,
        loading,
        error,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        checkout,
        subtotal
    };
}
