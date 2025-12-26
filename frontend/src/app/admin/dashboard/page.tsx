"use client";
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaBox, FaTriangleExclamation, FaMoneyBillWave, FaFilter, FaSort, FaChevronDown } from "react-icons/fa6";
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import SearchInput from '@/components/ui/SearchInput';
import ProductTable from '@/components/admin/ProductTable';
import Loader from '@/components/ui/Loader';
import StatCard from '@/components/admin/StatCard';
import ConfirmModal from '@/components/ui/ConfirmModal';

const ITEMS_PER_PAGE = 15;

export default function AdminDashboard() {
    const { products, loading, error, deleteProduct } = useAdminDashboard();
    const [searchTerm, setSearchTerm] = useState("");

    // Filter & Sort States
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortOption, setSortOption] = useState("newest"); // newest, oldest, price-asc, price-desc, stock-asc, stock-desc

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);

    // Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        onConfirm: () => { },
        variant: 'danger' as 'danger' | 'warning' | 'info'
    });

    const requestDeleteProduct = (id: number) => {
        setConfirmModal({
            isOpen: true,
            title: 'Eliminar Producto',
            message: '¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.',
            variant: 'danger',
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    await deleteProduct(id);
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    // Clean error state if any
                } catch (error: any) {
                    // Re-use modal to show error
                    setConfirmModal({
                        isOpen: true,
                        title: 'No se puede eliminar',
                        message: error.message || 'Hubo un error al intentar eliminar el producto.',
                        variant: 'warning',
                        confirmText: 'Entendido',
                        cancelText: '', // Hide cancel button for error messages
                        onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
                    });
                }
            }
        });
    };

    // Refs for click outside
    const filterRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setFilterOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setSortOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Reset page on search/filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, sortOption]);

    // Data Processing
    const { processedProducts, totalPages, paginatedProducts, uniqueCategories, newProductsCount, lowStockItems, totalValue } = useMemo(() => {
        if (!products) return { processedProducts: [], totalPages: 0, paginatedProducts: [], uniqueCategories: [], newProductsCount: 0, lowStockItems: 0, totalValue: 0 };

        // 1. Calculate Stats
        const totalValue = products.reduce((acc, p) => acc + (Number(p.price) * p.stock), 0);
        // Low Stock Threshold updated to 5
        const lowStockItems = products.filter(p => p.stock < 5).length;

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const newProductsCount = products.filter(p => {
            if (!p.created_at) return false;
            return new Date(p.created_at) > oneWeekAgo;
        }).length;

        // 2. Extract Categories
        const categories = Array.from(new Set(products.map(p => (p as any).Category?.category_name || (p as any).category_name).filter(Boolean)));

        // 3. Filter
        let result = products.filter(p => {
            const lowerTerm = searchTerm.toLowerCase();
            const matchesSearch = (
                p.product_name.toLowerCase().includes(lowerTerm) ||
                p.sku.toLowerCase().includes(lowerTerm) ||
                (p as any).Category?.category_name?.toLowerCase().includes(lowerTerm)
            );

            const categoryName = (p as any).Category?.category_name || (p as any).category_name;
            const matchesCategory = selectedCategory === "all" || categoryName === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        // 4. Sort
        result.sort((a, b) => {
            switch (sortOption) {
                case 'newest':
                    return b.product_id - a.product_id;
                case 'oldest':
                    return a.product_id - b.product_id;
                case 'price-asc':
                    return Number(a.price) - Number(b.price);
                case 'price-desc':
                    return Number(b.price) - Number(a.price);
                case 'stock-asc':
                    return a.stock - b.stock;
                case 'stock-desc':
                    return b.stock - a.stock;
                default:
                    return 0;
            }
        });

        // 5. Pagination
        const total = Math.ceil(result.length / ITEMS_PER_PAGE);
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const sliced = result.slice(start, start + ITEMS_PER_PAGE);

        return {
            processedProducts: result,
            totalPages: total,
            paginatedProducts: sliced,
            uniqueCategories: categories,
            newProductsCount,
            lowStockItems,
            totalValue
        };
    }, [products, searchTerm, selectedCategory, sortOption, currentPage]);

    // Calculate Stats (Global) based on full product list, not just filtered
    const totalProducts = products.length;

    if (loading) return <div className="flex justify-center items-center h-[60vh]"><Loader /></div>;

    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, processedProducts.length);

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                        <span>Inicio</span>
                        <span>/</span>
                    </div>
                    <h1 className="text-2xl font-black text-dark-bg tracking-tight">Inventario de Productos</h1>
                    <p className="text-gray-500 text-sm mt-1">Administra tu catálogo, niveles de stock y precios.</p>
                </div>
                <Link href="/admin/products/create" className="bg-primary hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-primary/25 hover:shadow-rose-600/30 transition-all flex items-center gap-2 group text-sm">
                    <FaPlus className="group-hover:rotate-90 transition-transform" />
                    <span>Agregar Producto</span>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard
                    title="Productos Totales"
                    value={totalProducts}
                    icon={FaBox}
                    trend="up"
                    trendValue={newProductsCount > 0 ? `+${newProductsCount} esta semana` : "Sin cambios"}
                    variant="blue"
                />
                <StatCard
                    title="Bajo Stock"
                    value={lowStockItems}
                    icon={FaTriangleExclamation}
                    trend={lowStockItems > 0 ? "down" : "neutral"}
                    trendValue={lowStockItems > 0 ? "Requiere atención" : "Stock saludable"}
                    alert={lowStockItems > 0}
                    variant={lowStockItems > 0 ? "rose" : "amber"}
                />
                <StatCard
                    title="Valor Total del Inventario"
                    value={`$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={FaMoneyBillWave}
                    subtext="Actualizado en tiempo real"
                    variant="emerald"
                />
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="w-full md:w-1/2 text-black">
                        <SearchInput onSearch={setSearchTerm} placeholder="Buscar por SKU, Nombre o Serie..." />
                    </div>
                    <div className="flex gap-2">
                        {/* Filter Dropdown */}
                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => setFilterOpen(!filterOpen)}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all
                                ${filterOpen || selectedCategory !== 'all' ? 'bg-gray-100 border-gray-300 text-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                <FaFilter />
                                <span>{selectedCategory === 'all' ? 'Filtrar' : selectedCategory}</span>
                                <FaChevronDown size={10} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {filterOpen && (
                                <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    <h6 className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Categoría</h6>
                                    <button
                                        onClick={() => { setSelectedCategory("all"); setFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedCategory === 'all' ? 'bg-primary/5 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Todas
                                    </button>
                                    {uniqueCategories.map(cat => (
                                        <button
                                            key={cat as string}
                                            onClick={() => { setSelectedCategory(cat as string); setFilterOpen(false); }}
                                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedCategory === cat ? 'bg-primary/5 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {cat as string}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative" ref={sortRef}>
                            <button
                                onClick={() => setSortOpen(!sortOpen)}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all
                                ${sortOpen ? 'bg-gray-100 border-gray-300 text-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                <FaSort />
                                <span>Ordenar</span>
                            </button>

                            {sortOpen && (
                                <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="space-y-1">
                                        {[
                                            { label: 'Más Recientes', value: 'newest' },
                                            { label: 'Más Antiguos', value: 'oldest' },
                                            { label: 'Precio: Bajo a Alto', value: 'price-asc' },
                                            { label: 'Precio: Alto a Bajo', value: 'price-desc' },
                                            { label: 'Stock: Bajo a Alto', value: 'stock-asc' },
                                            { label: 'Stock: Alto a Bajo', value: 'stock-desc' },
                                        ].map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => { setSortOption(opt.value); setSortOpen(false); }}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${sortOption === opt.value ? 'bg-primary/5 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {error && (
                    <div className="bg-rose-50 text-rose-600 p-3 font-medium text-center text-sm">
                        {error}
                    </div>
                )}

                <div className="p-4 text-black w-full overflow-x-auto">
                    <ProductTable products={paginatedProducts} onDelete={requestDeleteProduct} />

                    {paginatedProducts.length === 0 && (
                        <div className="text-center py-12 text-gray-500 font-medium">
                            No se encontraron productos.
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center text-xs text-gray-500">
                    <span className='font-medium'>
                        Mostrando {processedProducts.length > 0 ? startItem : 0}-{endItem} de {processedProducts.length} productos
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                        >
                            Anterior
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                // Simple logic to show near pages, for now just show first 5 or logic for windowing could be added
                                // Keeping it simple: show pages if total < 7, else simple window
                                // For MVP: simple slice of pages roughly around current
                                return i + 1;
                            }).map((page) => {
                                // Better pagination logic for numbers?
                                // Let's just render current page indicator if we want simple
                                // Or renders logic (1 2 3 ... 10)
                                // Implementing simple 1..N for small amounts, or Current for large
                                return null;
                            })}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
                variant={confirmModal.variant}
            />
        </div>
    );
}
