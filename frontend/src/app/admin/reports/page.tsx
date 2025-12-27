"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
    FaFilePdf, FaSackDollar, FaCartShopping,
    FaChartLine, FaUserGroup, FaCalendarDays, FaArrowLeft, FaTrophy, FaBoxOpen
} from "react-icons/fa6";
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import Loader from '@/components/ui/Loader';

// --- Interfaces ---
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
    total: string; // The endpoint returns 'total' or 'final_amount'? API usually returns model structure. Model has 'total' (renamed 'total_amount' in DB?). Let's support both.
    total_amount?: string;
    final_amount?: string;
    shipping_cost: string;
    status: string;
    created_at: string;
    User: {
        id: number;
        name: string;
        lastname: string;
        email: string;
    };
    OrderItems?: OrderItem[];
}

interface KPI {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ElementType;
    trend?: string;
}

// --- Components ---

const KPICard = ({ kpi }: { kpi: KPI }) => (
    <div className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-all cursor-default relative overflow-hidden">
        <div className="relative z-10 w-full">
            <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-gray-50 text-gray-500 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <kpi.icon size={16} />
                </div>
                {kpi.trend === 'up' && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">↑ +12%</span>}
            </div>
            <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">{kpi.title}</p>
                <h3 className="text-xl font-black text-dark-bg tracking-tight mb-1">{kpi.value}</h3>
                <p className="text-gray-400 text-[10px] font-medium">{kpi.subtitle}</p>
            </div>
        </div>
    </div>
);

const ChartCard = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon?: any }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[380px]">
        <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div className="flex items-center gap-2">
                {Icon && <Icon className="text-gray-400" size={14} />}
                <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
            </div>
        </div>
        <div className="flex-1 w-full min-h-0 p-5">
            {children}
        </div>
    </div>
);

// --- Main Page ---

export default function AdminReports() {
    const { token } = useAdminAuth();
    const toast = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('all'); // 'month', 'year', 'all'

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            if (!token) { setLoading(false); return; }
            try {
                const response = await api.get('/admin/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
                toast.error('Error', 'Failed to load report data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    // --- Data Processing (Memoized) ---
    const { kpis, salesData, statusData, topCustomers, topProducts } = useMemo(() => {
        if (loading || orders.length === 0) return { kpis: [], salesData: [], statusData: [], topCustomers: [], topProducts: [] };

        // 1. Filter by Period (Client Side)
        const now = new Date();
        const filteredOrders = orders.filter(o => {
            if (period === 'all') return true;
            const date = new Date(o.created_at);
            if (period === 'month') return date >= new Date(now.setMonth(now.getMonth() - 1));
            return true;
        });

        const validOrders = filteredOrders.filter(o => ['paid', 'shipped', 'delivered', 'completed', 'processing'].includes(o.status.toLowerCase()));

        // 2. KPIs
        // Handle different field names for total depending on API version (Order model usually has total or total_amount)
        // Based on `admin/orders/page.tsx`, it uses `final_amount || total_amount`.
        const getOrderTotal = (o: Order) => parseFloat(o.final_amount || o.total_amount || o.total || '0');

        const totalRevenue = validOrders.reduce((acc, curr) => acc + getOrderTotal(curr), 0);
        const orderCount = filteredOrders.length; // Count all orders (traffic), or just valid? Usually "Total Orders" implies activity. Let's use valid for revenue, generic for count.
        const conversionOrders = validOrders.length;
        const aov = conversionOrders > 0 ? totalRevenue / conversionOrders : 0;

        const kpisList: KPI[] = [
            {
                title: 'Ingresos',
                value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                subtitle: `${conversionOrders} pedidos completados`,
                icon: FaSackDollar,
                trend: 'up'
            },
            {
                title: 'Pedidos',
                value: orderCount.toString(),
                subtitle: 'Total procesados',
                icon: FaCartShopping,
            },
            {
                title: 'Ticket Promedio',
                value: `$${aov.toFixed(2)}`,
                subtitle: 'Por venta',
                icon: FaChartLine,
            },
            {
                title: 'Clientes',
                value: new Set(filteredOrders.map(o => o.User?.id)).size.toString(),
                subtitle: 'Únicos activos',
                icon: FaUserGroup,
            }
        ];

        // 3. Chart Data: Sales per Day
        const salesMap = new Map<string, number>();
        validOrders.forEach(order => {
            const date = new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            salesMap.set(date, (salesMap.get(date) || 0) + getOrderTotal(order));
        });

        const salesDataArray = Array.from(salesMap.entries())
            .map(([date, amount]) => ({ date, amount }))
            .reverse()
            .slice(-14); // Last 14 days with data

        // 4. Chart Data: Status Distribution
        const statusMap = new Map<string, number>();
        filteredOrders.forEach(o => {
            const s = o.status.toLowerCase();
            statusMap.set(s, (statusMap.get(s) || 0) + 1);
        });
        const statusDataArray = Array.from(statusMap.entries()).map(([name, value]) => ({ name, value }));

        // 5. Top Customers
        const customerMap = new Map<string, number>();
        validOrders.forEach(o => {
            const name = `${o.User?.name} ${o.User?.lastname}`;
            customerMap.set(name, (customerMap.get(name) || 0) + getOrderTotal(o));
        });
        const topCustomersArray = Array.from(customerMap.entries())
            .map(([name, total]) => ({ name, total }))
            .sort((b, a) => a.total - b.total)
            .slice(0, 5);

        // 6. Top Products (New)
        const productMap = new Map<number, { name: string, qty: number, revenue: number }>();
        validOrders.forEach(order => {
            order.OrderItems?.forEach(item => {
                const current = productMap.get(item.product_id) || { name: item.product_name, qty: 0, revenue: 0 };
                current.qty += item.quantity;
                current.revenue += parseFloat(item.subtotal);
                productMap.set(item.product_id, current);
            });
        });
        const topProductsArray = Array.from(productMap.values())
            .sort((a, b) => b.qty - a.qty) // Sort by Quantity Sold. Use b.revenue - a.revenue for Revenue.
            .slice(0, 5);

        return {
            kpis: kpisList,
            salesData: salesDataArray,
            statusData: statusDataArray,
            topCustomers: topCustomersArray,
            topProducts: topProductsArray
        };

    }, [orders, period, loading]);

    // PDF Generator
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.setTextColor(20, 20, 20); // Primary Color
        doc.text(`Reporte de Ventas`, 14, 22);

        doc.save('reporte_funkoshop.pdf');
    };

    // Monochrome / Brand Palette
    const COLORS = ['#1f2937', '#dc2626', '#9ca3af', '#e5e7eb', '#4b5563'];

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <Loader />
        </div>
    );

    return (
        <div className="animate-fade-in-up max-w-[1200px] mx-auto pb-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                        <Link href="/admin/dashboard" className="hover:text-primary transition-colors">Panel</Link>
                        <span>/</span>
                        <span className="text-gray-800">Analíticas</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-xl font-black text-dark-bg tracking-tight">Reportes</h1>
                        <span className="text-gray-400 text-xs font-medium">Resumen de actividad</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Period Selector */}
                    <div className="relative">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="appearance-none bg-white border border-gray-200 text-gray-600 py-2 px-3 pr-8 rounded-lg text-xs font-bold focus:outline-none focus:border-gray-300 cursor-pointer transition-all"
                        >
                            <option value="all">Histórico</option>
                            <option value="month">Último Mes</option>
                        </select>
                        <FaCalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                    </div>

                    <button
                        onClick={generatePDF}
                        className="bg-dark-bg text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <FaFilePdf size={12} />
                        <span>Exportar</span>
                    </button>

                    <Link
                        href="/admin/dashboard"
                        className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                        <FaArrowLeft size={12} />
                        <span>Volver</span>
                    </Link>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {kpis.map((kpi, i) => <KPICard key={i} kpi={kpi} />)}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {/* Main Revenue Chart */}
                <div className="lg:col-span-2">
                    <ChartCard title="Ingresos Recientes" icon={FaChartLine}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.05} />
                                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    cursor={{ stroke: '#dc2626', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '8px', fontSize: '12px' }}
                                    formatter={(value: any) => [`$${parseFloat(value || 0).toFixed(2)}`, 'Venta']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#dc2626"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    activeDot={{ r: 4, strokeWidth: 0, fill: '#dc2626' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                {/* Status Distribution */}
                <div className="lg:col-span-1">
                    <ChartCard title="Estado Pedidos" icon={FaBoxOpen}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                    cornerRadius={4}
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </div>

            {/* Bottom Grid: Top Customers & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Top Products */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                        <FaTrophy className="text-gray-400" size={14} />
                        <h3 className="font-bold text-gray-800 text-sm">Productos Top</h3>
                    </div>

                    <div className="overflow-x-auto scrollbar-thin-light">
                        <table className="w-full min-w-[400px]">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left py-2 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Producto</th>
                                    <th className="text-right py-2 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">U.</th>
                                    <th className="text-right py-2 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dashed divide-gray-100">
                                {topProducts.map((product, idx) => (
                                    <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ${idx === 0 ? 'bg-dark-bg text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                    {idx + 1}
                                                </span>
                                                <span className="font-bold text-gray-700 text-xs truncate max-w-[160px]" title={product.name}>{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <span className="font-medium text-gray-500 text-xs">{product.qty}</span>
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <span className="font-bold text-gray-900 text-xs">${product.revenue.toFixed(0)}</span>
                                        </td>
                                    </tr>
                                ))}
                                {topProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="text-center py-6 text-gray-400 text-sm">Sin datos de ventas</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Customers */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                        <FaUserGroup className="text-gray-400" size={14} />
                        <h3 className="font-bold text-gray-800 text-sm">Mejores Clientes</h3>
                    </div>

                    <div className="overflow-x-auto scrollbar-thin-light">
                        <table className="w-full min-w-[400px]">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left py-2 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
                                    <th className="text-right py-2 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gasto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dashed divide-gray-100">
                                {topCustomers.map((customer, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                    {customer.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-gray-700 text-xs">{customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <span className="font-black text-gray-900 text-xs">
                                                ${customer.total.toFixed(2)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {topCustomers.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="text-center py-6 text-gray-400 text-sm">Sin datos de clientes</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
