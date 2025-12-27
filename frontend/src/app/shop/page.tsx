"use client";
import React, { useState, useEffect } from 'react';
import ProductCard from "@/components/ProductCard";
import ShopSidebar from '@/components/shop/ShopSidebar';
import { productService } from '@/services/product.service';
import { useSearchParams } from 'next/navigation';
import { FaAngleLeft, FaAngleRight, FaFilter, FaXmark, FaMagnifyingGlass } from "react-icons/fa6";
import { useProducts } from '@/hooks/useProducts';
import Loader from '@/components/ui/Loader';

export default function Shop() {
    const { products, pagination, loading, fetchProducts } = useProducts();
    const searchParams = useSearchParams();

    // Filters - Initialize from URL Params to avoid race conditions
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [search, setSearch] = useState(searchParams.get('search') || "");
    const [sort, setSort] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [filterNew, setFilterNew] = useState(false);
    const [filterOffers, setFilterOffers] = useState(false);
    const [filterSpecial, setFilterSpecial] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "");
    const [categories, setCategories] = useState<string[]>([]);
    const [page, setPage] = useState(1); // Pagination State

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            // Only reset page if search changed from what we initialized
            if (search !== (searchParams.get('search') || "")) {
                setPage(1);
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [search, searchParams]);

    // Extract categories on load if empty
    // Extract categories on load
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const cats = await productService.getCategories();
                // Map to strings if your select expects strings, or keep objects
                // Assuming ShopSidebar uses strings based on previous code:
                setCategories(cats.map(c => c.licence_name).sort());
            } catch (err) {
                console.error("Failed to load categories", err);
            }
        };

        if (categories.length === 0) {
            loadCategories();
        }
    }, [categories.length]);

    useEffect(() => {
        const params: Record<string, string | number> = {
            page,
            limit: 9
        };
        if (debouncedSearch) params.search = debouncedSearch;
        if (sort) params.sort = sort;
        if (minPrice) params.min = minPrice;
        if (maxPrice) params.max = maxPrice;
        if (filterNew) params.new = 'true';
        if (filterOffers) params.offers = 'true';
        if (filterSpecial) params.special = 'true';
        if (selectedCategory) params.category = selectedCategory;

        fetchProducts(params);
        // Scroll to top on page change
        if (page > 1) window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [fetchProducts, debouncedSearch, sort, minPrice, maxPrice, filterNew, filterOffers, filterSpecial, selectedCategory, page]);

    // Handle Page Change
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="bg-dark-bg min-h-screen">
            <div className="container-custom pt-25 md:pt-32 pb-12 flex flex-col md:flex-row gap-12">
                {/* Desktop Sidebar */}
                <ShopSidebar
                    className="hidden md:flex"
                    search={search} setSearch={setSearch}
                    sort={sort} setSort={setSort}
                    minPrice={minPrice} setMinPrice={setMinPrice}
                    maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                    filterNew={filterNew} setFilterNew={setFilterNew}
                    filterOffers={filterOffers} setFilterOffers={setFilterOffers}
                    filterSpecial={filterSpecial} setFilterSpecial={setFilterSpecial}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />

                {/* Mobile Filter Modal */}
                {isMobileFiltersOpen && (
                    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex justify-end transition-all md:hidden">
                        <div className="w-full max-w-[320px] h-full bg-dark-surface border-l border-white/10 overflow-y-auto p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Filtros</h3>
                                <button onClick={() => setIsMobileFiltersOpen(false)} className="text-white hover:text-primary transition-colors">
                                    <FaXmark size={24} />
                                </button>
                            </div>

                            <ShopSidebar
                                className="w-full p-0 border-none bg-transparent"
                                hideSearch={true}
                                search={search} setSearch={setSearch}
                                sort={sort} setSort={setSort}
                                minPrice={minPrice} setMinPrice={setMinPrice}
                                maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                                filterNew={filterNew} setFilterNew={setFilterNew}
                                filterOffers={filterOffers} setFilterOffers={setFilterOffers}
                                filterSpecial={filterSpecial} setFilterSpecial={setFilterSpecial}
                                categories={categories}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                            />

                            <button
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl mt-8 sticky bottom-0 shadow-lg shadow-black/50"
                            >
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex-1">
                    {/* Mobile Search Bar */}
                    <div className="md:hidden mb-6 relative">
                        <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-dark-surface border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    {/* Header for Shop Grid */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/5 pb-6 gap-4">
                        <div className="flex items-center justify-between w-full md:w-auto gap-4">
                            <h2 className="text-xl sm:text-3xl font-black text-white italic uppercase">Productos <span className="text-primary text-base sm:text-xl ml-1">({pagination.total || 0})</span></h2>
                            <button
                                onClick={() => setIsMobileFiltersOpen(true)}
                                className="md:hidden flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap"
                            >
                                <FaFilter /> FILTROS
                            </button>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-gray-400 text-sm">
                            Mostrando <span className="text-white font-bold">{products.length}</span> resultados
                        </div>
                    </div>

                    {loading ? (
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-12">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-dark-surface border border-white/5 rounded-xl overflow-hidden p-4 animate-pulse h-[450px] flex flex-col">
                                    <div className="w-full aspect-square bg-white/5 rounded-lg mb-4"></div>
                                    <div className="flex flex-col gap-2 flex-grow">
                                        <div className="h-3 w-1/3 bg-white/10 rounded"></div>
                                        <div className="h-6 w-3/4 bg-white/10 rounded"></div>
                                        <div className="mt-auto flex flex-col gap-3">
                                            <div className="h-6 w-1/2 bg-white/10 rounded"></div>
                                            <div className="h-10 w-full bg-white/5 rounded-lg"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </section>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/5 p-12">
                            <p className="text-2xl font-bold text-white mb-2">No se encontraron productos</p>
                            <p className="text-gray-400">Intenta ajustar tus filtros</p>
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
                                    discount={p.discount || 0}
                                    created_at={p.created_at}
                                    installments={p.dues ? `${p.dues} CUOTAS SIN INTERÉS` : undefined}
                                    stock={p.stock}
                                />
                            ))}
                        </section>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 0 && (
                        <div className="flex justify-center items-center gap-4 py-8">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark-surface border border-white/10 text-white hover:bg-primary hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaAngleLeft />
                            </button>

                            {/* Simple Page Numbers */}
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => handlePageChange(p)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${page === p
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "bg-dark-surface border border-white/10 text-white hover:bg-white/10"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === pagination.totalPages}
                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark-surface border border-white/10 text-white hover:bg-primary hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaAngleRight />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
