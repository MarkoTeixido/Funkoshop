import React from 'react';
import { cn } from '@/utils/cn';
import { FaSearch, FaFilter } from 'react-icons/fa';

interface ShopSidebarProps {
    search: string;
    setSearch: (value: string) => void;
    sort: string;
    setSort: (value: string) => void;
    minPrice: string;
    setMinPrice: (value: string) => void;
    maxPrice: string;
    setMaxPrice: (value: string) => void;
    filterNew: boolean;
    setFilterNew: (value: boolean) => void;
    filterOffers: boolean;
    setFilterOffers: (value: boolean) => void;
    filterSpecial: boolean;
    setFilterSpecial: (value: boolean) => void;
}

export default function ShopSidebar({
    search, setSearch,
    sort, setSort,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    filterNew, setFilterNew,
    filterOffers, setFilterOffers,
    filterSpecial, setFilterSpecial
}: ShopSidebarProps) {
    return (
        <aside className="w-full md:w-[280px] shrink-0 flex flex-col gap-10 bg-dark-surface p-8 rounded-2xl border border-white/5 h-fit">
            <div className="flex items-center gap-2 text-primary border-b border-white/10 pb-4">
                <FaFilter size={18} />
                <h2 className="text-xl font-bold uppercase tracking-wider">Filters</h2>
            </div>

            {/* Search */}
            <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Search</label>
                <div className="relative group">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
                    <input
                        className="w-full bg-dark-bg border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Order */}
            <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sort By</label>
                <div className="relative">
                    <select
                        className="w-full appearance-none bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary cursor-pointer hover:border-white/20 transition-colors"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="">Default</option>
                        <option value="price-ascending">Price: Low to High</option>
                        <option value="price-descending">Price: High to Low</option>
                        <option value="alpha-ascending">Name: A-Z</option>
                        <option value="alpha-descending">Name: Z-A</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
                </div>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Price Range</label>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                        <input
                            className="w-full bg-dark-bg border border-white/10 rounded-lg pl-6 pr-2 py-2 text-sm text-white focus:outline-none focus:border-primary transition-all text-center"
                            type="number"
                            placeholder="Min"
                            min="0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                    </div>
                    <span className="text-gray-500">-</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                        <input
                            className="w-full bg-dark-bg border border-white/10 rounded-lg pl-6 pr-2 py-2 text-sm text-white focus:outline-none focus:border-primary transition-all text-center"
                            type="number"
                            placeholder="Max"
                            min="0"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Categories</label>
                <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2">
                        <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", filterNew ? "bg-primary border-primary" : "border-gray-600 bg-transparent group-hover:border-primary")}>
                            {filterNew && <span className="text-white text-xs">✓</span>}
                        </div>
                        <input type="checkbox" className="hidden" checked={filterNew} onChange={(e) => setFilterNew(e.target.checked)} />
                        <span className={cn("text-sm transition-colors", filterNew ? "text-white font-medium" : "text-gray-400 group-hover:text-white")}>New Arrivals</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2">
                        <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", filterOffers ? "bg-primary border-primary" : "border-gray-600 bg-transparent group-hover:border-primary")}>
                            {filterOffers && <span className="text-white text-xs">✓</span>}
                        </div>
                        <input type="checkbox" className="hidden" checked={filterOffers} onChange={(e) => setFilterOffers(e.target.checked)} />
                        <span className={cn("text-sm transition-colors", filterOffers ? "text-white font-medium" : "text-gray-400 group-hover:text-white")}>Special Offers</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2">
                        <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", filterSpecial ? "bg-primary border-primary" : "border-gray-600 bg-transparent group-hover:border-primary")}>
                            {filterSpecial && <span className="text-white text-xs">✓</span>}
                        </div>
                        <input type="checkbox" className="hidden" checked={filterSpecial} onChange={(e) => setFilterSpecial(e.target.checked)} />
                        <span className={cn("text-sm transition-colors", filterSpecial ? "text-white font-medium" : "text-gray-400 group-hover:text-white")}>Limited Edition</span>
                    </label>
                </div>
            </div>

            <button
                onClick={() => {
                    setSearch("");
                    setSort("");
                    setMinPrice("");
                    setMaxPrice("");
                    setFilterNew(false);
                    setFilterOffers(false);
                    setFilterSpecial(false);
                }}
                className="mt-4 text-xs font-bold text-gray-500 hover:text-white underline uppercase tracking-widest transition-colors self-center"
            >
                Clear All Filters
            </button>
        </aside>
    );
}
