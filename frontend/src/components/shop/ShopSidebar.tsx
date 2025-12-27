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
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    className?: string; // Add className prop
    hideSearch?: boolean;
}

export default function ShopSidebar({
    search, setSearch,
    sort, setSort,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    filterNew, setFilterNew,
    filterOffers, setFilterOffers,
    filterSpecial, setFilterSpecial,
    categories = [], selectedCategory, setSelectedCategory,
    className,
    hideSearch = false
}: ShopSidebarProps) {
    return (
        <aside className={cn("w-full md:w-[280px] shrink-0 flex flex-col gap-10 bg-dark-surface p-8 rounded-2xl border border-white/5 h-fit", className)}>
            <div className="flex items-center gap-2 text-primary border-b border-white/10 pb-4">
                <FaFilter size={18} />
                <h2 className="text-xl font-bold uppercase tracking-wider">Filtros</h2>
            </div>

            {/* Search */}
            {!hideSearch && (
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Buscar</label>
                    <div className="relative group">
                        <input
                            className="w-full bg-dark-bg border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                            type="text"
                            placeholder="Buscar productos..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Order */}
            <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Ordenar por</label>
                <div className="relative">
                    <select
                        className="w-full appearance-none bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary cursor-pointer hover:border-white/20 transition-colors"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="">Por defecto</option>
                        <option value="price-ascending">Precio: Menor a Mayor</option>
                        <option value="price-descending">Precio: Mayor a Menor</option>
                        <option value="alpha-ascending">Nombre: A-Z</option>
                        <option value="alpha-descending">Nombre: Z-A</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
                </div>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Precio</label>
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

            {/* Categories (Licences) */}
            <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Categorías</label>
                <div className="flex flex-col gap-2">
                    <label className={cn("flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2", selectedCategory === "" && "bg-white/5")}>
                        <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center transition-colors", selectedCategory === "" ? "border-primary bg-primary" : "border-gray-600 bg-transparent group-hover:border-primary")}>
                            {selectedCategory === "" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <input type="radio" className="hidden" checked={selectedCategory === ""} onChange={() => setSelectedCategory("")} />
                        <span className={cn("text-sm transition-colors", selectedCategory === "" ? "text-white font-bold" : "text-gray-400 group-hover:text-white")}>Todas</span>
                    </label>

                    {categories.map((cat) => (
                        <label key={cat} className={cn("flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2", selectedCategory === cat && "bg-white/5")}>
                            <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center transition-colors", selectedCategory === cat ? "border-primary bg-primary" : "border-gray-600 bg-transparent group-hover:border-primary")}>
                                {selectedCategory === cat && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <input type="radio" className="hidden" checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} />
                            <span className={cn("text-sm transition-colors", selectedCategory === cat ? "text-white font-bold" : "text-gray-400 group-hover:text-white")}>{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Tags / Status */}
            <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Filtros</label>
                <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2">
                        <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", filterNew ? "bg-primary border-primary" : "border-gray-600 bg-transparent group-hover:border-primary")}>
                            {filterNew && <span className="text-white text-xs">✓</span>}
                        </div>
                        <input type="checkbox" className="hidden" checked={filterNew} onChange={(e) => setFilterNew(e.target.checked)} />
                        <span className={cn("text-sm transition-colors", filterNew ? "text-white font-medium" : "text-gray-400 group-hover:text-white")}>Nuevos</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2">
                        <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", filterOffers ? "bg-primary border-primary" : "border-gray-600 bg-transparent group-hover:border-primary")}>
                            {filterOffers && <span className="text-white text-xs">✓</span>}
                        </div>
                        <input type="checkbox" className="hidden" checked={filterOffers} onChange={(e) => setFilterOffers(e.target.checked)} />
                        <span className={cn("text-sm transition-colors", filterOffers ? "text-white font-medium" : "text-gray-400 group-hover:text-white")}>Ofertas</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2">
                        <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", filterSpecial ? "bg-primary border-primary" : "border-gray-600 bg-transparent group-hover:border-primary")}>
                            {filterSpecial && <span className="text-white text-xs">✓</span>}
                        </div>
                        <input type="checkbox" className="hidden" checked={filterSpecial} onChange={(e) => setFilterSpecial(e.target.checked)} />
                        <span className={cn("text-sm transition-colors", filterSpecial ? "text-white font-medium" : "text-gray-400 group-hover:text-white")}>Edición Especial</span>
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
                    setSelectedCategory("");
                }}
                className="mt-4 text-xs font-bold text-gray-500 hover:text-white underline uppercase tracking-widest transition-colors self-center"
            >
                Limpiar Filtros
            </button>
        </aside>
    );
}
