"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ProductGalleryProps {
    images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    // If no images, provide defaults
    const safeImages = images.length > 0 ? images : ['/placeholder.png'];

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 w-full h-full">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto hide-scrollbar shrink-0">
                {safeImages.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                            "relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0",
                            selectedImage === index
                                ? "border-primary shadow-[0_0_15px_rgba(229,9,20,0.3)]"
                                : "border-white/10 hover:border-white/30 grayscale hover:grayscale-0"
                        )}
                    >
                        <Image
                            src={img}
                            alt={`Product View ${index + 1}`}
                            fill
                            className="object-contain p-2 bg-white/5"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative aspect-square md:aspect-auto md:h-[600px] bg-white/5 rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center p-8 group">
                {/* Exclusive Badge Mockup - Can be dynamic later */}
                <div className="absolute top-6 left-6 z-20">
                    <span className="bg-black/80 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 uppercase tracking-wider">
                        Exclusive
                    </span>
                </div>

                <div className="absolute top-6 right-6 z-20">
                    <button className="text-gray-400 hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={safeImages[selectedImage]}
                            alt="Main Product View"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
