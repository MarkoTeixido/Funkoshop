"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FaCartShopping, FaUsers, FaBoxOpen, FaClock } from "react-icons/fa6";

export default function AdminActivity() {
    const { token } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) fetchActivity();
    }, [token]);

    const fetchActivity = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/activity`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10">Cargando actividad...</div>;
    if (!stats) return <div className="text-center py-10">No hay datos disponibles</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold uppercase text-gray-800 mb-8">Panel de Actividad</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-bold uppercase text-sm mb-1">Pedidos Pendientes</p>
                        <p className="text-4xl font-bold text-gray-800">{stats.pendingOrders}</p>
                    </div>
                    <FaClock className="text-4xl text-yellow-500 opacity-50" />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-bold uppercase text-sm mb-1">Ventas Completadas</p>
                        <p className="text-4xl font-bold text-gray-800">{stats.completedOrders}</p>
                    </div>
                    <FaCartShopping className="text-4xl text-green-500 opacity-50" />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-bold uppercase text-sm mb-1">Usuarios Registrados</p>
                        <p className="text-4xl font-bold text-gray-800">{stats.totalUsers}</p>
                    </div>
                    <FaUsers className="text-4xl text-blue-500 opacity-50" />
                </div>
            </div>

            {/* Recent Sales Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Últimas Ventas</h3>
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-sm text-gray-400 uppercase">
                            <th className="pb-3">Orden #</th>
                            <th className="pb-3">Cliente</th>
                            <th className="pb-3">Total</th>
                            <th className="pb-3">Fecha</th>
                            <th className="pb-3">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {stats.recentSales.map((sale: any) => (
                            <tr key={sale.order_id} className="text-sm">
                                <td className="py-3 font-bold">{sale.order_number}</td>
                                <td className="py-3">{sale.User?.name} {sale.User?.lastname}</td>
                                <td className="py-3 font-bold text-green-600">$ {sale.total_amount}</td>
                                <td className="py-3 text-gray-500">{new Date(sale.created_at).toLocaleDateString()}</td>
                                <td className="py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs text-white ${sale.status === 'processing' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                        {sale.status === 'processing' ? 'Completado' : 'Pendiente'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
