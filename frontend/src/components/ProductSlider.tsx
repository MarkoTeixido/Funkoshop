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
    title?: string;
    products: any[];
}

export default function ProductSlider({ title, products }: ProductSliderProps) {
    const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
    const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

    return (
        <div className="product-slider-container relative">
            {title && (
                <h2 className="text-3xl md:text-4xl font-black uppercase text-white mb-8 ml-4 md:ml-0 font-raleway tracking-wider">
                    {title} <span className="text-primary">.</span>
                </h2>
            )}
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
                    1024: {
                        slidesPerView: 4,
                    },
                    1280: {
                        slidesPerView: 5,
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
            {/* Custom Navigation Buttons */}
            <button
                ref={(node) => setPrevEl(node)}
                className="swiper-button-prev-custom absolute top-1/2 -left-4 md:-left-8 z-20 -translate-y-1/2 w-12 h-12 bg-dark-bg/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-primary hover:border-primary transition-all disabled:opacity-0 disabled:cursor-not-allowed group"
            >
                <RxChevronLeft size={24} className="group-hover:scale-110 transition-transform" />
            </button>
            <button
                ref={(node) => setNextEl(node)}
                className="swiper-button-next-custom absolute top-1/2 -right-4 md:-right-8 z-20 -translate-y-1/2 w-12 h-12 bg-dark-bg/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-primary hover:border-primary transition-all disabled:opacity-0 disabled:cursor-not-allowed group"
            >
                <RxChevronRight size={24} className="group-hover:scale-110 transition-transform" />
            </button>
        </div>
    );
}
