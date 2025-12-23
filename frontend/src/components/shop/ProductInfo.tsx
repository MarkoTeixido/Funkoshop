"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMinus, FaPlus, FaCartShopping } from "react-icons/fa6";
import { cn } from '@/utils/cn';

interface ProductInfoProps {
    id: number;
    category: string;
    name: string;
    price: number;
    stock: number;
    description?: string;
    licence?: string;
    onAddToCart: (quantity: number) => void;
}

export default function ProductInfo({
    id,
    category,
    name,
    price,
    stock,
    description,
    licence,
    onAddToCart
}: ProductInfoProps) {
    const [quantity, setQuantity] = useState(1);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);

    const increment = () => setQuantity(prev => Math.min(prev + 1, stock));
    const decrement = () => setQuantity(prev => Math.max(prev - 1, 1));

    return (
        <div className="flex flex-col gap-6 text-white h-full justify-center">

            {/* Badge & Category */}
            <div className="flex items-center gap-3">
                <span className="bg-green-500/10 text-green-500 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider border border-green-500/20">
                    In Stock
                </span>
                <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">
                    #{id} {category} POP!
                </span>
            </div>

            {/* Title */}
            <div>
                <h1 className="text-4xl md:text-5xl font-black italic uppercase leading-tight mb-2">
                    {name}
                </h1>

                {/* Rating Mockup */}
                <div className="flex items-center gap-2 text-sm text-gray-400 opacity-50">
                    {/* Placeholder for ratings */}
                    <span>No ratings yet</span>
                </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 border-b border-white/10 pb-8">
                <span className="text-5xl font-bold text-primary">${price}</span>
                {/* Discount Mockup */}
                {/* <span className="text-xl text-gray-500 line-through mb-2">$35.00</span> */}
            </div>

            {/* Description */}
            <div className="prose prose-invert prose-sm text-gray-300 max-w-none">
                <p>
                    {description || `From the pages of ${licence || category} comes this amazing Figure! This vinyl figure stands approximately 3.75 inches tall and comes in window box packaging. A perfect addition to your collection!`}
                </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                {/* Quantity */}
                <div className="flex items-center bg-white/5 border border-white/10 rounded-full w-full sm:w-auto">
                    <button
                        onClick={decrement}
                        disabled={quantity <= 1}
                        className="w-12 h-14 flex items-center justify-center text-white hover:text-primary transition-colors disabled:opacity-50"
                    >
                        <FaMinus size={12} />
                    </button>
                    <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                    <button
                        onClick={increment}
                        disabled={quantity >= stock}
                        className="w-12 h-14 flex items-center justify-center text-white hover:text-primary transition-colors disabled:opacity-50"
                    >
                        <FaPlus size={12} />
                    </button>
                </div>

                {/* Add to Cart */}
                <button
                    onClick={() => onAddToCart(quantity)}
                    disabled={stock === 0}
                    className="flex-1 bg-primary hover:bg-primary-hover disabled:bg-gray-700 text-white font-bold text-lg rounded-full py-4 px-8 transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(229,9,20,0.4)] flex items-center justify-center gap-3"
                >
                    <FaCartShopping />
                    {stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
            </div>

            {/* Product Specs Accordion Style */}
            <div className="mt-8 space-y-2">
                <div className="border border-white/10 rounded-xl overflow-hidden">
                    <button
                        onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                        className="w-full flex justify-between items-center p-4 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <span className="font-bold uppercase text-sm tracking-wider">Product Specifications</span>
                        <span className="text-xl">{isDescriptionOpen ? '−' : '+'}</span>
                    </button>
                    <AnimatePresence>
                        {isDescriptionOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 border-t border-white/10 text-sm text-gray-400 space-y-2 bg-black/20">
                                    <div className="flex justify-between">
                                        <span>Material</span>
                                        <span className="text-white">Vinyl</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Height</span>
                                        <span className="text-white">3.75 inches</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Box Number</span>
                                        <span className="text-white">054</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>License</span>
                                        <span className="text-white">{licence || category}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="border border-white/10 rounded-xl overflow-hidden opacity-70">
                    <div className="w-full flex justify-between items-center p-4 bg-white/5">
                        <span className="font-bold uppercase text-sm tracking-wider">Shipping Information</span>
                        <span className="text-xl">+</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
