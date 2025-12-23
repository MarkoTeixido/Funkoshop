"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/utils/cn';

interface ProductCardProps {
    id: number;
    category: string;
    name: string;
    price: string | number;
    imageFront: string;
    imageBack: string;
    tag?: string;
    installments?: string;
    stock: number;
}

export default function ProductCard({ id, category, name, price, imageFront, imageBack, tag, installments, stock }: ProductCardProps) {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(id);
    };

    return (
        <article className="w-full h-full">
            <Link href={`/shop/${id}`} className="group block relative h-full bg-dark-surface rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-white/5 p-4">
                    {tag && (
                        <span className="absolute right-0 top-0 bg-primary text-white text-xs font-bold uppercase px-3 py-1 pr-4 rounded-bl-xl z-20 shadow-md">
                            {tag}
                        </span>
                    )}

                    {/* Images Container with Crossfade */}
                    <div className="relative w-full h-full">
                        <Image
                            src={imageFront || "https://res.cloudinary.com/dp7jr9k94/image/upload/v1703182285/ironman_front_placeholder.png"}
                            alt={name || "Product Image"}
                            fill
                            className="object-contain transition-opacity duration-300 group-hover:opacity-0"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <Image
                            src={imageBack || "https://res.cloudinary.com/dp7jr9k94/image/upload/v1703182285/ironman_box_placeholder.png"}
                            alt={name ? `${name} Box` : "Product Box"}
                            fill
                            className="object-contain absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                </div>

                <div className="p-5 flex flex-col flex-grow gap-2">
                    <p className="text-xs font-bold tracking-widest uppercase text-gray-500">{category}</p>
                    <h4 className="text-lg font-bold text-white leading-tight line-clamp-2 min-h-[50px]">{name}</h4>

                    <div className="mt-auto pt-4 flex flex-col gap-3">
                        <p className="text-xl font-light text-primary">{typeof price === 'number' ? `$ ${price}` : price}</p>

                        {stock === 0 ? (
                            <button
                                disabled
                                className="w-full bg-gray-700 text-gray-400 font-bold text-xs py-3 rounded-lg cursor-not-allowed uppercase tracking-wider"
                            >
                                Sin Stock
                            </button>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-white text-black font-bold text-xs py-3 rounded-lg hover:bg-primary hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 uppercase tracking-wider shadow-lg"
                            >
                                Agregar al Carrito
                            </button>
                        )}
                    </div>
                </div>
            </Link>
        </article>
    )
}
