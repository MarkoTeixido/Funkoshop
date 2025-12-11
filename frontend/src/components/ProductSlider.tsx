"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import ProductCard from './ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Product {
    id: string; // or number
    category: string;
    name: string;
    price: string;
    imageFront: string;
    imageBack: string;
    tag?: string;
    installments?: string;
}

interface ProductSliderProps {
    title: string;
    products: Product[];
}

export default function ProductSlider({ title, products }: ProductSliderProps) {
    return (
        <article className="container px-[2.4rem] min-[1000px]:px-[12rem] py-[6rem]">
            <h2 className="text-[3.2rem] font-bold uppercase mb-[4rem] text-dark">{title}</h2>
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                }}
                className="w-full pb-12"
            >
                {products.map((product, index) => (
                    <SwiperSlide key={index}>
                        <ProductCard {...product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </article>
    );
}
