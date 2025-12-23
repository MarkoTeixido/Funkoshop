"use client";
import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaCreditCard, FaTruck, FaCheckCircle, FaLock } from 'react-icons/fa';
import Link from 'next/link';

export default function CheckoutPage() {
    const { cartItems, subtotal } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
    const [loading, setLoading] = useState(false);

    // Mock Shipping Data
    const [shippingData, setShippingData] = useState({
        address: '',
        city: '',
        zip: '',
        country: 'Argentina'
    });

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('payment');
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert("Order placed successfully! (Mock)");
            router.push('/shop');
        }, 2000);
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-3xl font-black italic uppercase text-white mb-4">Your Cart is Empty</h1>
                <p className="text-gray-400 mb-8">Add some Funkos to your cart before checking out.</p>
                <Link href="/shop" className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-xl transition-all uppercase tracking-wider">
                    Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="container-custom py-20 md:py-32 max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black italic uppercase text-white mb-12 text-center md:text-left">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Steps & Form Column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Progress Indicator */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-primary' : 'text-green-500'}`}>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step === 'shipping' ? 'border-primary bg-primary/20' : 'border-green-500 bg-green-500/20'}`}>1</span>
                            <span className="font-bold uppercase text-sm">Shipping</span>
                        </div>
                        <div className="w-12 h-[2px] bg-white/10" />
                        <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-primary' : 'text-gray-500'}`}>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step === 'payment' ? 'border-primary bg-primary/20' : 'border-gray-500 bg-transparent'}`}>2</span>
                            <span className="font-bold uppercase text-sm">Payment</span>
                        </div>
                    </div>

                    {/* Shipping Form */}
                    {step === 'shipping' && (
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-3">
                                <FaTruck className="text-primary" /> Shipping Details
                            </h2>
                            <form onSubmit={handleShippingSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Full Address</label>
                                        <input
                                            required
                                            value={shippingData.address}
                                            onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                                            type="text"
                                            placeholder="123 Funko St"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">City</label>
                                        <input
                                            required
                                            value={shippingData.city}
                                            onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                                            type="text"
                                            placeholder="Buenos Aires"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Zip Code</label>
                                        <input
                                            required
                                            value={shippingData.zip}
                                            onChange={(e) => setShippingData({ ...shippingData, zip: e.target.value })}
                                            type="text"
                                            placeholder="C1234"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Country</label>
                                        <input
                                            disabled
                                            value={shippingData.country}
                                            type="text"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-primary hover:bg-primary-hover text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-[1.02] uppercase tracking-wider shadow-lg shadow-primary/20"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Payment Form */}
                    {step === 'payment' && (
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-3">
                                <FaCreditCard className="text-primary" /> Payment
                            </h2>
                            <div className="mb-6 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-4">
                                <FaLock className="text-blue-400 mt-1" />
                                <div>
                                    <h4 className="font-bold text-blue-400 text-sm uppercase mb-1">Encrypted Transaction</h4>
                                    <p className="text-xs text-blue-300/80">Your payment information is handled securely. This is a mock checkout.</p>
                                </div>
                            </div>

                            <form onSubmit={handlePaymentSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Cardholder Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Card Number</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        maxLength={19}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Expiry</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="MM/YY"
                                            maxLength={5}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">CVC</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="123"
                                            maxLength={4}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={() => setStep('shipping')}
                                        className="text-gray-400 hover:text-white font-bold text-sm uppercase transition-colors"
                                    >
                                        Back to Shipping
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-[1.02] uppercase tracking-wider shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {loading ? 'Processing...' : 'Pay Now'}
                                        {!loading && <FaCheckCircle />}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Summary Column */}
                <div className="lg:col-span-1">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl sticky top-32">
                        <h3 className="text-xl font-bold text-white uppercase mb-6">Order Summary</h3>

                        <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map((item) => (
                                <div key={item.cart_item_id} className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden relative border border-white/10 shrink-0">
                                        {/* Simple Image placeholder valid for checkout summary */}
                                        <img
                                            src={item.Product.image_front || '/placeholder.png'}
                                            alt={item.Product.product_name}
                                            className="w-full h-full object-contain"
                                        />
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-dark-bg">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-bold text-sm truncate">{item.Product.product_name}</p>
                                        <p className="text-gray-400 text-xs">${Number(item.Product.price).toFixed(2)}</p>
                                    </div>
                                    <p className="text-white font-bold text-sm">
                                        ${(Number(item.Product.price) * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 border-t border-white/10 pt-4">
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-white font-black text-xl border-t border-white/10 pt-4">
                                <span>Total</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
