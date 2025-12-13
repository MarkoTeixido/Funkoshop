"use client";
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";
import ProductCard from './ProductCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductSliderProps {
    products: any[];
}

export default function ProductSlider({ products }: ProductSliderProps) {
    const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
    const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

    return (
        <div className="product-slider-container relative">
            <Swiper
                modules={[Navigation]}
                spaceBetween={24}
                slidesPerView={1}
                loop={true}
                navigation={{
                    prevEl,
                    nextEl,
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                    },
                    1000: {
                        slidesPerView: 3,
                    },
                }}
                className="pb-8"
            >
                {products.map((p) => (
                    <SwiperSlide key={p.id}>
                        <ProductCard {...p} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button
                ref={(node) => setPrevEl(node)}
                className="swiper-button-prev-custom absolute top-1/2 -left-4 md:-left-6 z-10 -translate-y-1/2 w-12 h-12 bg-white/30 backdrop-blur-sm border border-white/50 rounded-lg shadow-sm flex items-center justify-center text-gray-600 cursor-pointer hover:bg-white/80 hover:text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <RxChevronLeft size={28} />
            </button>
            <button
                ref={(node) => setNextEl(node)}
                className="swiper-button-next-custom absolute top-1/2 -right-4 md:-right-6 z-10 -translate-y-1/2 w-12 h-12 bg-white/30 backdrop-blur-sm border border-white/50 rounded-lg shadow-sm flex items-center justify-center text-gray-600 cursor-pointer hover:bg-white/80 hover:text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <RxChevronRight size={28} />
            </button>
        </div>
    );
}
