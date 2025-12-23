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
        <div className="bg-dark-bg min-h-screen">
            <div className="container-custom pt-32 pb-12 flex flex-col md:flex-row gap-12">
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
                    {/* Header for Shop Grid */}
                    <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                        <h2 className="text-3xl font-black text-white italic uppercase">All Products <span className="text-primary text-xl ml-1">({products.length})</span></h2>
                        <div className="hidden md:flex items-center gap-2 text-gray-400 text-sm">
                            Showing <span className="text-white font-bold">{products.length}</span> results
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/5 p-12">
                            <p className="text-2xl font-bold text-white mb-2">No products found</p>
                            <p className="text-gray-400">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-12">
                            {products.map((p) => (
                                <ProductCard
                                    key={p.product_id}
                                    id={p.product_id}
                                    category={(p as any).Licence ? (p as any).Licence.licence_name : 'GENERIC'}
                                    name={p.product_name}
                                    price={p.price}
                                    imageFront={p.image_front || 'https://res.cloudinary.com/dp7jr9k94/image/upload/v1703182285/ironman_front_placeholder.png'}
                                    imageBack={p.image_back || 'https://res.cloudinary.com/dp7jr9k94/image/upload/v1703182285/ironman_box_placeholder.png'}
                                    tag={(p.discount !== null && p.discount > 0) ? `${p.discount}% OFF` : 'NUEVO'}
                                    installments={p.dues ? `${p.dues} CUOTAS SIN INTERÉS` : undefined}
                                    stock={p.stock}
                                />
                            ))}
                        </section>
                    )}

                    {/* Pagination (Visual only for now) */}
                    <div className="flex justify-center items-center gap-4 py-8">
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark-surface border border-white/10 text-white hover:bg-primary hover:border-primary transition-all">
                            <FaAngleLeft />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20">1</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark-surface border border-white/10 text-white hover:bg-white/10 transition-all font-medium">2</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark-surface border border-white/10 text-white hover:bg-white/10 transition-all font-medium">3</button>
                        <span className="text-gray-500">...</span>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark-surface border border-white/10 text-white hover:bg-primary hover:border-primary transition-all">
                            <FaAngleRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
