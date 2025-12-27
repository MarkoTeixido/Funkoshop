"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartItem from "@/components/shop/CartItem";
import OrderSummary from "@/components/shop/OrderSummary";
import { useCart } from '@/hooks/useCart';
import { FaArrowLeft } from "react-icons/fa6";

export default function CartPage() {
    const { cartItems, removeItem, updateQuantity, subtotal, fetchCart } = useCart();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);
        fetchCart();
        return () => clearTimeout(timer);
    }, [fetchCart]);

    // Auto-calculate free shipping > $50
    const shipping = subtotal > 50 ? 0 : 10;
    const tax = subtotal * 0.08; // 8% Tax Mockup

    const router = useRouter();

    const handleCheckout = () => {
        router.push('/shop/checkout');
    };

    if (loading) {
        return (
            <div className="bg-dark-bg min-h-screen flex flex-col">
                <main className="flex-grow pt-32 pb-20">
                    <div className="container-custom">
                        {/* Header Skeleton */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                            <div>
                                <div className="h-12 w-64 bg-white/10 rounded-lg mb-2 animate-pulse"></div>
                                <div className="h-4 w-48 bg-white/5 rounded animate-pulse"></div>
                            </div>
                            <div className="h-6 w-32 bg-white/10 rounded animate-pulse"></div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Cart List Skeleton */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="hidden md:flex justify-between px-6 mb-2">
                                    <div className="h-4 w-20 bg-white/5 rounded"></div>
                                    <div className="flex gap-20 pr-12">
                                        <div className="h-4 w-16 bg-white/5 rounded"></div>
                                        <div className="h-4 w-16 bg-white/5 rounded"></div>
                                    </div>
                                </div>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-dark-surface p-4 rounded-xl border border-white/5 flex gap-4 animate-pulse">
                                        <div className="w-24 h-24 bg-white/5 rounded-lg shrink-0"></div>
                                        <div className="flex-grow space-y-3 py-2">
                                            <div className="h-6 w-1/2 bg-white/10 rounded"></div>
                                            <div className="h-4 w-1/4 bg-white/5 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Skeleton */}
                            <div className="lg:col-span-1">
                                <div className="bg-dark-surface p-6 rounded-2xl border border-white/10 animate-pulse h-[300px]">
                                    <div className="h-8 w-1/2 bg-white/10 rounded mb-6"></div>
                                    <div className="space-y-4">
                                        <div className="h-4 w-full bg-white/5 rounded"></div>
                                        <div className="h-4 w-full bg-white/5 rounded"></div>
                                        <div className="h-8 w-full bg-white/10 rounded mt-8"></div>
                                        <div className="h-12 w-full bg-primary/20 rounded-full mt-6"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-dark-bg min-h-screen flex flex-col">
            <main className="flex-grow pt-32 pb-20">
                <div className="container-custom">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase mb-2">Tu Carrito</h1>
                            <p className="text-gray-400">
                                {subtotal > 50
                                    ? <span className="text-green-500 font-bold">¡Has calificado para Envío Gratis!</span>
                                    : `Agrega $${(50 - subtotal).toFixed(2)} más para Envío Gratis.`
                                }
                            </p>
                        </div>
                        <Link href="/shop" className="text-white hover:text-primary font-bold flex items-center gap-2 transition-colors">
                            <FaArrowLeft /> Continuar Comprando
                        </Link>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                            <h2 className="text-2xl font-bold text-white mb-4">Tu carrito está vacío</h2>
                            <p className="text-gray-400 mb-8 text-center px-4">Parece que aún no has agregado ningún Funko.</p>
                            <Link href="/shop" className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-3 rounded-full transition-colors">
                                Comenzar a Comprar
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Cart List */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="hidden md:flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest px-6 mb-2">
                                    <span>Producto</span>
                                    <div className="flex gap-20 pr-12">
                                        <span>Cantidad</span>
                                        <span>Precio</span>
                                    </div>
                                </div>

                                {cartItems.map((item) => (
                                    <CartItem
                                        key={item.product_id}
                                        id={item.product_id}
                                        name={item.Product?.product_name || "Unknown Product"}
                                        price={typeof item.Product?.price === 'string' ? parseFloat(item.Product.price) : item.Product?.price || 0}
                                        quantity={item.quantity}
                                        image={item.Product?.image_front || "https://res.cloudinary.com/dp7jr9k94/image/upload/v1703182285/ironman_box_placeholder.png"}
                                        stock={item.Product?.stock || 0}
                                        onUpdateQuantity={updateQuantity}
                                        onRemove={removeItem}
                                        category={(item.Product?.licence as any)?.licence_name || item.Product?.licence || "Pop! Vinyl"}
                                        condition="Mint"
                                    />
                                ))}

                                <div className="flex justify-end pt-4">
                                    {/* Clear Cart functionality not in hook yet, hiding button or ignoring */}
                                    {/* <button className="text-sm text-red-500 hover:text-red-400 underline font-bold">Clear Cart</button> */}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="lg:col-span-1">
                                <OrderSummary
                                    subtotal={subtotal}
                                    shipping={shipping}
                                    tax={tax}
                                    onCheckout={handleCheckout}
                                />
                            </div>
                        </div>
                    )}

                </div>
            </main>

        </div>
    );
}
