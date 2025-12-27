"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaEye, FaArrowDown, FaFilter, FaMagnifyingGlass, FaChevronDown, FaBox, FaCreditCard, FaTruck, FaUser, FaXmark, FaTrash } from "react-icons/fa6";
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useToast } from "@/context/ToastContext";
import { api } from '@/services/api';
import ConfirmModal from '@/components/ui/ConfirmModal';

// Interfaces
interface OrderItem {
    order_item_id: number;
    product_id: number;
    product_name: string;
    product_sku: string;
    quantity: number;
    unit_price: string;
    subtotal: string;
}

interface Order {
    order_id: number;
    user_id: number;
    order_number: string;
    total_amount: string;
    final_amount: string;
    status: string;
    payment_method: string;
    created_at: string;
    shipping_street: string;
    shipping_city: string;
    shipping_state: string;
    shipping_country: string;
    shipping_postal_code: string;
    User: {
        name: string;
        lastname: string;
        email: string;
    };
    OrderItems: OrderItem[];
}

export default function OrdersPage() {
    const { token } = useAdminAuth();
    const toast = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        variant: 'danger' as 'danger' | 'warning' | 'info'
    });

    // Pagination
    const ITEMS_PER_PAGE = 15;
    const [currentPage, setCurrentPage] = useState(1);

    // Close filter dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, searchTerm]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await api.get('/admin/orders', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                toast.error('Error', 'Failed to load orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    const getStatusColor = (status: string) => {
        const normalizedStatus = status.toLowerCase();
        switch (normalizedStatus) {
            case 'paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'processing': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        const map: Record<string, string> = {
            all: 'Todos', pending: 'Pendiente', paid: 'Pagado',
            processing: 'En Proceso', shipped: 'Enviado',
            completed: 'Completado', cancelled: 'Cancelado', delivered: 'Entregado'
        };
        return map[status.toLowerCase()] || status;
    };

    const handleDeleteOrder = (orderId: number) => {
        setConfirmModal({
            isOpen: true,
            title: 'Eliminar Pedido',
            message: '¿Estás seguro de eliminar este pedido permanentemente? Esta acción NO se puede deshacer.',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await api.delete(`/admin/orders/${orderId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('Éxito', 'Pedido eliminado correctamente.');
                    setOrders(prev => prev.filter(o => o.order_id !== orderId));
                    if (selectedOrder && selectedOrder.order_id === orderId) {
                        setSelectedOrder(null);
                    }
                } catch (error) {
                    console.error('Error deleting order:', error);
                    toast.error('Error', 'No se pudo eliminar el pedido.');
                }
            }
        });
    };

    const handleStatusChange = (orderId: number, newStatus: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Cambiar Estado',
            message: `¿Estás seguro de cambiar el estado a ${getStatusLabel(newStatus)}?`,
            variant: 'warning',
            onConfirm: async () => {
                try {
                    await api.put(`/admin/orders/${orderId}/status`, { status: newStatus }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('Éxito', 'Estado actualizado correctamente.');
                    // Update local state
                    setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o));
                    if (selectedOrder) {
                        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
                    }
                } catch (error) {
                    console.error('Error updating status:', error);
                    toast.error('Error', 'No se pudo actualizar el estado.');
                }
            }
        });
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus;
        const customerName = `${order.User?.name || ''} ${order.User?.lastname || ''}`.trim();
        const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.order_id.toString().includes(searchTerm) ||
            order.order_number?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const calculateTotalItems = (items: OrderItem[]) => {
        return items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="animate-fade-in-up max-w-[1200px] mx-auto pb-12 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                        <Link href="/admin/dashboard" className="hover:text-primary transition-colors">Panel</Link>
                        <span>/</span>
                        <span className="text-gray-900">Pedidos</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-2xl font-black text-dark-bg tracking-tight">Pedidos Recientes</h1>
                        <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{orders.length} total</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">Gestiona y rastrea los pedidos de clientes.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-2 bg-dark-bg text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-dark-bg/20 hover:bg-gray-800 transition-all"
                    >
                        <FaArrowLeft />
                        Volver
                    </Link>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center z-10 relative">
                {/* Search */}
                <div className="relative group max-w-md w-full">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                        <FaMagnifyingGlass />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por ID, Número de Orden o Cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-700 focus:bg-white focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 transition-all outline-none"
                    />
                </div>

                {/* Filter Dropdown */}
                <div className="relative w-full md:w-auto" ref={filterRef}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="w-full md:w-64 flex items-center justify-between gap-3 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                        <div className="flex items-center gap-2">
                            <FaFilter className="text-gray-400" />
                            <span>Estado: <span className="text-primary">{getStatusLabel(filterStatus)}</span></span>
                        </div>
                        <FaChevronDown className={`text-gray-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} size={12} />
                    </button>

                    {isFilterOpen && (
                        <div className="absolute right-0 top-full mt-2 w-full md:w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[50] animate-fade-in">
                            <div className="p-1.5 flex flex-col gap-0.5">
                                {['all', 'pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            setFilterStatus(status);
                                            setIsFilterOpen(false);
                                        }}
                                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                            ${filterStatus === status ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}
                                        `}
                                    >
                                        {getStatusLabel(status)}
                                        {filterStatus === status && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin-light">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">ID Pedido</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="text-center py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Ítems</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="text-right py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedOrders.length > 0 ? (
                                paginatedOrders.map((order) => (
                                    <tr key={order.order_id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-sm font-bold text-gray-900">#{order.order_number || order.order_id}</span>
                                                <span className="text-[10px] text-gray-400">ID: {order.order_id}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-rose-400 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                                    {(order.User?.name || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-700 capitalize">{order.User?.name} {order.User?.lastname}</span>
                                                    <span className="text-xs text-gray-400">{order.User?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-gray-500 font-medium">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold">
                                                {calculateTotalItems(order.OrderItems)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm font-black text-gray-900">
                                                ${parseFloat(order.final_amount || order.total_amount || '0').toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)} uppercase tracking-wide`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-lg active:scale-95 transform"
                                                title="Ver detalle"
                                            >
                                                <FaEye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOrder(order.order_id)}
                                                disabled={!['cancelled', 'completed'].includes(order.status)}
                                                className={`p-2 rounded-lg transition-colors ml-1 ${['cancelled', 'completed'].includes(order.status)
                                                    ? 'text-gray-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transform'
                                                    : 'text-gray-200 cursor-not-allowed'
                                                    }`}
                                                title={['cancelled', 'completed'].includes(order.status) ? "Eliminar Pedido" : "No se puede eliminar"}
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <FaFilter className="text-gray-300 text-4xl mb-2" />
                                            <p className="font-medium">No se encontraron pedidos con esos filtros.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Footer with Pagination & Disclaimer */}
            <div className="border-t border-gray-100 p-4 bg-gray-50/30 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 font-medium">
                        Mostrando {filteredOrders.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} de {filteredOrders.length} pedidos
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                        <FaTrash size={10} />
                        Los pedidos cancelados se borrarán automáticamente cada 24 horas.
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs text-gray-700"
                    >
                        Anterior
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Simple logic just to show available pages count or similar to dashboard logic
                            // Logic: if totalPages <= 7 show all, else show window. 
                            // For simplicity matching dashboard "1 2 3 4 5" style
                            // Actually Dashboard didn't implement fully working numbers in the view I saw, just the array map stub.
                            // I will implement standard behavior here: Just Previous / Next for simplicity as requested "same pagination"
                            return null;
                        })}
                        <span className="text-xs font-medium text-gray-600 px-2">
                            Página {currentPage} de {totalPages || 1}
                        </span>
                    </div>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs text-gray-700"
                    >
                        Siguiente
                    </button>
                </div>
            </div>


            {/* Order Details Modal */}
            {
                selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                            onClick={() => setSelectedOrder(null)}
                        ></div>
                        <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
                            {/* Modal Header */}
                            <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-start">
                                <div className="flex gap-4 items-start">
                                    <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-primary">
                                        <FaBox size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                            Pedido #{selectedOrder.order_number || selectedOrder.order_id}
                                        </h2>
                                        <div className="flex flex-col gap-2 mt-1">
                                            <span className="text-sm text-gray-500">
                                                Realizado el {new Date(selectedOrder.created_at).toLocaleDateString()} A las {new Date(selectedOrder.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(selectedOrder.status)} uppercase`}>
                                                    {getStatusLabel(selectedOrder.status)}
                                                </span>

                                                {/* Status Changer */}
                                                <select
                                                    value={selectedOrder.status}
                                                    onChange={(e) => handleStatusChange(selectedOrder.order_id, e.target.value)}
                                                    className="ml-2 text-xs font-bold bg-white text-gray-900 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-gray-50 transition-all"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'].map(s => (
                                                        <option key={s} value={s}>{getStatusLabel(s)}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <FaXmark size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    {/* User Info */}
                                    <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                                        <div className="flex items-center gap-2 mb-3 text-gray-900 font-bold text-sm">
                                            <FaUser className="text-gray-400" />
                                            Cliente
                                        </div>
                                        <p className="font-bold text-gray-800">{selectedOrder.User?.name} {selectedOrder.User?.lastname}</p>
                                        <p className="text-sm text-gray-500">{selectedOrder.User?.email}</p>
                                    </div>
                                    {/* Shipping Info */}
                                    <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                                        <div className="flex items-center gap-2 mb-3 text-gray-900 font-bold text-sm">
                                            <FaTruck className="text-gray-400" />
                                            Envío
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {selectedOrder.shipping_street}<br />
                                            {selectedOrder.shipping_city}, {selectedOrder.shipping_state}<br />
                                            {selectedOrder.shipping_postal_code}, {selectedOrder.shipping_country}
                                        </p>
                                    </div>
                                </div>

                                {/* Items List */}
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Productos</h3>
                                <div className="border rounded-2xl border-gray-100 overflow-hidden mb-6">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Producto</th>
                                                <th className="text-center py-3 px-4 text-xs font-bold text-gray-500 uppercase">Cant.</th>
                                                <th className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase">Precio Unit.</th>
                                                <th className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {selectedOrder.OrderItems?.map((item) => (
                                                <tr key={item.order_item_id}>
                                                    <td className="py-3 px-4">
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-800">{item.product_name}</p>
                                                            <p className="text-xs text-gray-400">SKU: {item.product_sku}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-center text-sm font-medium text-gray-700">{item.quantity}</td>
                                                    <td className="py-3 px-4 text-right text-sm text-gray-600">${parseFloat(item.unit_price).toFixed(2)}</td>
                                                    <td className="py-3 px-4 text-right text-sm font-bold text-gray-900">${parseFloat(item.subtotal).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Summary */}
                                <div className="flex justify-end">
                                    <div className="w-full md:w-1/2 bg-gray-50 rounded-2xl p-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Subtotal</span>
                                            <span className="font-medium text-gray-900">${(parseFloat(selectedOrder.final_amount) * 0.8).toFixed(2)} (Aprox)</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Envío</span>
                                            <span className="font-medium text-gray-900">Calculado</span>
                                        </div>
                                        <div className="pt-2 border-t border-gray-200 mt-2 flex justify-between items-center">
                                            <span className="font-bold text-gray-900">Total</span>
                                            <span className="text-xl font-black text-primary">${parseFloat(selectedOrder.final_amount).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-white hover:border-gray-300 transition-all"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
            />
        </div >
    );
}
