"use client";
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import React from 'react';
import { FaLock, FaArrowRight } from "react-icons/fa6";

interface OrderSummaryProps {
    subtotal: number;
    shipping?: number;
    tax?: number;
    onCheckout: () => void;
}

export default function OrderSummary({ subtotal, shipping = 0, tax = 0, onCheckout }: OrderSummaryProps) {
    const total = subtotal + shipping + tax;

    return (
        <div className="bg-white rounded-3xl p-8 sticky top-32 text-gray-900 shadow-2xl">
            <h2 className="text-2xl font-black uppercase italic mb-6">Order Summary</h2>

            <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span>Estimated Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-bold" : ""}>
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-end">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-3xl font-black">${total.toFixed(2)}</span>
                </div>
            </div>

            {/* Promo Code Input Mockup */}
            <div className="flex gap-2 mb-8">
                <input
                    type="text"
                    placeholder="Promo Code"
                    className="flex-1 bg-gray-100 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none font-bold placeholder:font-medium placeholder:uppercase"
                />
                <button className="bg-black text-white px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors">
                    Apply
                </button>
            </div>

            <button
                onClick={onCheckout}
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] group"
            >
                Checkout <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Security Badge */}
            <div className="mt-8 flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <FaLock className="text-gray-400 mt-1 shrink-0" />
                <div>
                    <h4 className="font-bold text-xs uppercase mb-1">Secure Shopping</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                        Every Funko Pop is shipped in a premium protector case to ensure it arrives in mint condition.
                    </p>
                </div>
            </div>

            {/* Payment Icons Mockup */}
            <div className="flex justify-center gap-2 mt-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="w-8 h-5 bg-black rounded" />
                <div className="w-8 h-5 bg-blue-600 rounded" />
                <div className="w-8 h-5 bg-orange-500 rounded" />
            </div>
        </div>
    );
}
