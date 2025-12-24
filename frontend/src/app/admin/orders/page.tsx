"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaEye, FaArrowDown, FaFilter, FaMagnifyingGlass } from "react-icons/fa6";
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useToast } from "@/context/ToastContext";

import { api } from '@/services/api';

// Order Interface matching backend response
interface Order {
    order_id: number;
    user_id: number;
    subtotal: string;
    shipping_cost: string;
    total: string;
    status: string;
    payment_method: string;
    created_at: string;
    User: {
        name: string;
        lastname: string;
        email: string;
    };
}

export default function OrdersPage() {
    const { token } = useAdminAuth();
    const toast = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await api.get('/admin/orders', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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
            case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus;
        const customerName = `${order.User?.name || ''} ${order.User?.lastname || ''}`.trim();
        const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.order_id.toString().includes(searchTerm);
        return matchesStatus && matchesSearch;
    });

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="animate-fade-in-up max-w-[1200px] mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                        <Link href="/admin/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                        <span>/</span>
                        <span className="text-gray-900">Orders</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-2xl font-black text-dark-bg tracking-tight">Recent Orders</h1>
                        <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{orders.length} total</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">Manage and track customer orders.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 hover:text-black transition-all shadow-sm">
                        <FaArrowDown />
                        Export CSV
                    </button>
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-2 bg-dark-bg text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-dark-bg/20 hover:bg-gray-800 transition-all"
                    >
                        <FaArrowLeft />
                        Back
                    </Link>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">

                {/* Search */}
                <div className="relative group max-w-md w-full">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                        <FaMagnifyingGlass />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-700 focus:bg-white focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 transition-all outline-none"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                    {['all', 'paid', 'pending', 'shipped', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide border transition-all whitespace-nowrap
                                ${filterStatus === status
                                    ? 'bg-dark-bg text-white border-dark-bg shadow-md'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-right py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.order_id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <span className="font-mono text-sm font-medium text-gray-900">#{order.order_id}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-rose-400 text-white flex items-center justify-center text-xs font-bold">
                                                    {(order.User?.name || 'U').charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-700">{order.User?.name} {order.User?.lastname}</span>
                                                    <span className="text-xs text-gray-400">{order.User?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-gray-500 font-medium">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-gray-500 font-medium">
                                                - items
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm font-black text-gray-900">${Number(order.total).toFixed(2)}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)} uppercase tracking-wide`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-lg">
                                                <FaEye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <FaFilter className="text-gray-300 text-4xl mb-2" />
                                            <p className="font-medium">No orders found matching your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Footer / Pagination Mockup */}
                <div className="border-t border-gray-100 p-4 flex justify-between items-center bg-gray-50/30">
                    <span className="text-xs text-gray-500 font-medium">Showing {filteredOrders.length} of {orders.length} orders</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
