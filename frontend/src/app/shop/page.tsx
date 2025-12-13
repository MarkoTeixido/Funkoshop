"use client";
import React, { useState, useEffect } from 'react';
import ProductCard from "@/components/ProductCard";
import ShopSidebar from '@/components/shop/ShopSidebar';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useProducts } from '@/hooks/useProducts';
import Loader from '@/components/ui/Loader';

export default function Shop() {
    const { products, loading, fetchProducts } = useProducts();

    // Filters
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [filterNew, setFilterNew] = useState(false);
    const [filterOffers, setFilterOffers] = useState(false);
    const [filterSpecial, setFilterSpecial] = useState(false);

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        const params: Record<string, string | number> = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (sort) params.sort = sort;
        if (minPrice) params.min = minPrice;
        if (maxPrice) params.max = maxPrice;
        if (filterNew) params.new = 'true';
        if (filterOffers) params.offers = 'true';
        if (filterSpecial) params.special = 'true';

        fetchProducts(params);
    }, [fetchProducts, debouncedSearch, sort, minPrice, maxPrice, filterNew, filterOffers, filterSpecial]);

    return (
        <div className="standard-container py-[4rem] flex flex-col md:flex-row gap-[4rem] text-dark">
            <ShopSidebar
                search={search} setSearch={setSearch}
                sort={sort} setSort={setSort}
                minPrice={minPrice} setMinPrice={setMinPrice}
                maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                filterNew={filterNew} setFilterNew={setFilterNew}
                filterOffers={filterOffers} setFilterOffers={setFilterOffers}
                filterSpecial={filterSpecial} setFilterSpecial={setFilterSpecial}
            />

            <div className="flex-1">
                {loading ? (
                    <Loader />
                ) : products.length === 0 ? (
                    <div className="text-center text-[2rem] py-10">No se encontraron productos.</div>
                ) : (
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2.4rem] mb-[4rem]">
                        {products.map((p) => (
                            <ProductCard
                                key={p.product_id}
                                id={p.product_id}
                                category={(p as any).Licence ? (p as any).Licence.licence_name : 'GENERIC'}
                                name={p.product_name}
                                price={p.price}
                                imageFront={p.image_front || '/placeholder.png'}
                                imageBack={p.image_back || '/placeholder.png'}
                                tag={(p.discount !== null && p.discount > 0) ? `${p.discount}% OFF` : 'NUEVO'}
                                installments={p.dues ? `${p.dues} CUOTAS SIN INTERÉS` : undefined}
                                stock={p.stock}
                            />
                        ))}
                    </section>
                )}

                {/* Pagination (Visual only for now) */}
                <div className="flex justify-center items-center gap-[0.8rem] py-[4rem] text-[1.6rem]">
                    <a href="#" className="p-2 hover:text-primary transition-colors"><FaAngleLeft size={20} /></a>
                    <a href="#" className="w-[3.2rem] h-[3.2rem] flex items-center justify-center border border-gray-300 rounded-[4px] bg-primary text-white font-medium">1</a>
                    <a href="#" className="w-[3.2rem] h-[3.2rem] flex items-center justify-center border border-gray-300 rounded-[4px] hover:bg-primary-900 hover:text-white transition-colors font-medium">2</a>
                    <a href="#" className="p-2 hover:text-primary transition-colors"><FaAngleRight size={20} /></a>
                </div>
            </div>
        </div>
    );
}
