"use client";
import React from 'react';
import Image from 'next/image';
import { FaMinus, FaPlus, FaTrashCan } from "react-icons/fa6";
import { cn } from '@/utils/cn';

interface CartItemProps {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    stock: number;
    category?: string;
    condition?: string;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
}

export default function CartItem({
    id,
    name,
    price,
    quantity,
    image,
    stock,
    category = "Pop! Vinyl",
    condition = "Mint",
    onUpdateQuantity,
    onRemove
}: CartItemProps) {

    const increment = () => onUpdateQuantity(id, Math.min(quantity + 1, stock));
    const decrement = () => onUpdateQuantity(id, Math.max(quantity - 1, 1));

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/5 border border-white/5 rounded-2xl group hover:border-primary/30 transition-all">
            {/* Image */}
            <div className="relative w-24 h-24 shrink-0 bg-white/5 rounded-xl p-2">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-contain"
                />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left w-full">
                <div className="flex flex-col mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{category}</span>
                    <h3 className="font-bold text-white text-lg leading-tight">{name}</h3>
                </div>
                <p className="text-xs text-gray-500">Condition: <span className="text-gray-300">{condition}</span></p>
                {stock <= 5 && stock > 0 && (
                    <p className="text-[10px] text-orange-500 font-bold mt-1">Only {stock} left!</p>
                )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                {/* Quantity */}
                <div className="flex items-center bg-black/20 rounded-lg p-1 border border-white/10">
                    <button
                        onClick={decrement}
                        disabled={quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                    >
                        <FaMinus size={10} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-white">{quantity}</span>
                    <button
                        onClick={increment}
                        disabled={quantity >= stock}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                    >
                        <FaPlus size={10} />
                    </button>
                </div>

                {/* Price */}
                <span className="font-bold text-white text-lg min-w-[80px] text-right">${(price * quantity).toFixed(2)}</span>

                {/* Remove */}
                <button
                    onClick={() => onRemove(id)}
                    className="text-gray-500 hover:text-red-500 transition-colors p-2"
                    aria-label="Remove item"
                >
                    <FaTrashCan size={16} />
                </button>
            </div>
        </div>
    );
}
