"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartItem from "@/components/shop/CartItem";
import OrderSummary from "@/components/shop/OrderSummary";
import { useCart } from '@/hooks/useCart';
import { FaArrowLeft } from "react-icons/fa6";

export default function CartPage() {
    const { cartItems, removeItem, updateQuantity, subtotal, fetchCart } = useCart();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Auto-calculate free shipping > $50
    const shipping = subtotal > 50 ? 0 : 10;
    const tax = subtotal * 0.08; // 8% Tax Mockup

    const handleCheckout = () => {
        alert("Proceeding to checkout...");
    };

    return (
        <div className="bg-dark-bg min-h-screen flex flex-col">
            <main className="flex-grow pt-32 pb-20">
                <div className="container-custom">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase mb-2">Your Cart</h1>
                            <p className="text-gray-400">
                                {subtotal > 50
                                    ? <span className="text-green-500 font-bold">You've qualified for Free Shipping!</span>
                                    : `Add $${(50 - subtotal).toFixed(2)} more for Free Shipping.`
                                }
                            </p>
                        </div>
                        <Link href="/shop" className="text-white hover:text-primary font-bold flex items-center gap-2 transition-colors">
                            <FaArrowLeft /> Continue Shopping
                        </Link>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                            <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
                            <p className="text-gray-400 mb-8">Looks like you haven't added any Funkos yet.</p>
                            <Link href="/shop" className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-3 rounded-full transition-colors">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Cart List */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="hidden md:flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest px-6 mb-2">
                                    <span>Product</span>
                                    <div className="flex gap-20 pr-12">
                                        <span>Quantity</span>
                                        <span>Price</span>
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
