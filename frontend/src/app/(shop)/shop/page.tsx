"use client";
import React, { useState, useEffect } from 'react';
import ProductCard from "@/components/ProductCard";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

export default function Shop() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [filterNew, setFilterNew] = useState(false);
    const [filterOffers, setFilterOffers] = useState(false);
    const [filterSpecial, setFilterSpecial] = useState(false);
    const [filterFav, setFilterFav] = useState(false); // Visual only for now

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        fetchProducts();
    }, [debouncedSearch, sort, minPrice, maxPrice, filterNew, filterOffers, filterSpecial]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (debouncedSearch) queryParams.append('search', debouncedSearch);
            if (sort) queryParams.append('sort', sort);
            if (minPrice) queryParams.append('min', minPrice);
            if (maxPrice) queryParams.append('max', maxPrice);
            if (filterNew) queryParams.append('new', 'true');
            if (filterOffers) queryParams.append('offers', 'true');
            if (filterSpecial) queryParams.append('special', 'true');

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop?${queryParams.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setDebouncedSearch(search);
        }
    };

    return (
        <div className="standard-container py-[4rem] flex flex-col md:flex-row gap-[4rem] text-dark">
            <aside className="w-full md:w-[250px] shrink-0 space-y-[4rem]">
                {/* Search */}
                <div className="space-y-[1.2rem]">
                    <label className="text-[1.8rem] font-medium block" htmlFor="search">BUSCAR</label>
                    <div className="relative">
                        <input
                            className="w-full border-2 border-primary rounded-[50px] px-[1.6rem] py-[0.8rem] text-[1.6rem] placeholder:text-gray-400 focus:outline-none"
                            type="text"
                            name="buscar"
                            placeholder="item o categoria"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>

                {/* Order */}
                <div className="space-y-[1.2rem]">
                    <label className="text-[1.8rem] font-medium block" htmlFor="order">ORDENAR POR</label>
                    <select
                        className="w-full border-2 border-primary rounded-[50px] px-[1.6rem] py-[0.8rem] text-[1.6rem] bg-white focus:outline-none cursor-pointer"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="">Defecto</option>
                        <option value="price-ascending">Menor Precio</option>
                        <option value="price-descending">Mayor Precio</option>
                        <option value="alpha-ascending">A-Z</option>
                        <option value="alpha-descending">Z-A</option>
                    </select>
                </div>

                {/* Price */}
                <div className="space-y-[1.2rem]">
                    <label className="text-[1.8rem] font-medium block" htmlFor="price">PRECIO</label>
                    <div className="flex items-center gap-4 justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[1.4rem]">MIN</span>
                            <input
                                className="w-[7rem] border border-gray-300 rounded px-2 py-1 text-[1.4rem]"
                                type="number"
                                placeholder="0"
                                min="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                        </div>
                        <span className="text-[1.4rem]">-</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[1.4rem]">MAX</span>
                            <input
                                className="w-[7rem] border border-gray-300 rounded px-2 py-1 text-[1.4rem]"
                                type="number"
                                placeholder="0"
                                min="0"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="space-y-[1.2rem]">
                    <label className="text-[1.8rem] font-medium block" htmlFor="filter">FILTRAR</label>
                    <div className="space-y-[0.8rem]">
                        <div className="flex items-center gap-[0.8rem]">
                            <input
                                type="checkbox"
                                className="w-[1.8rem] h-[1.8rem] accent-primary cursor-pointer"
                                checked={filterNew}
                                onChange={(e) => setFilterNew(e.target.checked)}
                            />
                            <label className="text-[1.6rem]">NUEVOS</label>
                        </div>
                        <div className="flex items-center gap-[0.8rem]">
                            <input
                                type="checkbox"
                                className="w-[1.8rem] h-[1.8rem] accent-primary cursor-pointer"
                                checked={filterOffers}
                                onChange={(e) => setFilterOffers(e.target.checked)}
                            />
                            <label className="text-[1.6rem]">OFERTAS</label>
                        </div>
                        <div className="flex items-center gap-[0.8rem]">
                            <input
                                type="checkbox"
                                className="w-[1.8rem] h-[1.8rem] accent-primary cursor-pointer"
                                checked={filterSpecial}
                                onChange={(e) => setFilterSpecial(e.target.checked)}
                            />
                            <label className="text-[1.6rem]">EDICIÓN ESPECIAL</label>
                        </div>
                        <div className="flex items-center gap-[0.8rem]">
                            <input
                                type="checkbox"
                                className="w-[1.8rem] h-[1.8rem] accent-primary cursor-pointer"
                                checked={filterFav}
                                onChange={(e) => setFilterFav(e.target.checked)}
                                disabled // Feature not implemented yet
                            />
                            <label className="text-[1.6rem] text-gray-400">FAVORITOS</label>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex-1">
                {loading ? (
                    <div className="text-center text-[2rem] py-10">Cargando productos...</div>
                ) : products.length === 0 ? (
                    <div className="text-center text-[2rem] py-10">No se encontraron productos.</div>
                ) : (
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2.4rem] mb-[4rem]">
                        {products.map((p) => (
                            <ProductCard
                                key={p.product_id}
                                id={p.product_id}
                                category={p.Licence ? p.Licence.licence_name : 'GENERIC'}
                                name={p.product_name}
                                price={`$ ${p.price}`}
                                imageFront={p.image_front || '/placeholder.png'}
                                imageBack={p.image_back || '/placeholder.png'}
                                tag={p.discount > 0 ? `${p.discount}% OFF` : 'NUEVO'}
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
