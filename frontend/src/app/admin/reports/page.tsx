"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
    FaFilePdf, FaArrowDown, FaSackDollar, FaCartShopping,
    FaChartLine, FaUserGroup, FaCalendarDays
} from "react-icons/fa6";
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

// --- Interfaces ---
interface Order {
    order_id: number;
    total: string;
    shipping_cost: string;
    status: string;
    created_at: string;
    User: {
        id: number;
        name: string;
        lastname: string;
        email: string;
    };
    OrderItems?: any[];
}

interface KPI {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
}

// --- Components ---

const KPICard = ({ kpi }: { kpi: KPI }) => (
    <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-all cursor-default">
        <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 group-hover:text-primary transition-colors">{kpi.title}</p>
            <h3 className="text-2xl font-black text-dark-bg tracking-tight mb-2">{kpi.value}</h3>
            <p className="text-gray-400 text-xs font-medium">{kpi.subtitle}</p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 bg-gray-50 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
            {kpi.icon}
        </div>
    </div>
);

const ChartCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[400px]">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">{title}</h3>
        </div>
        <div className="flex-1 w-full min-h-0 p-4">
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
    const { kpis, salesData, statusData, topCustomers } = useMemo(() => {
        if (loading || orders.length === 0) return { kpis: [], salesData: [], statusData: [], topCustomers: [] };

        // 1. Filter by Period (Mock implementation of period filter on Client Side)
        const now = new Date();
        const filteredOrders = orders.filter(o => {
            if (period === 'all') return true;
            const date = new Date(o.created_at);
            if (period === 'month') return date >= new Date(now.setMonth(now.getMonth() - 1));
            return true;
        });

        const validOrders = filteredOrders.filter(o => ['paid', 'shipped'].includes(o.status.toLowerCase()));

        // 2. KPIs
        const totalRevenue = validOrders.reduce((acc, curr) => acc + parseFloat(curr.total), 0);
        const orderCount = filteredOrders.length;
        const aov = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;

        const kpisList: KPI[] = [
            {
                title: 'Total Revenue',
                value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                subtitle: `${validOrders.length} successful orders`,
                icon: <FaSackDollar />,
            },
            {
                title: 'Total Orders',
                value: orderCount.toString(),
                subtitle: 'Processed in period',
                icon: <FaCartShopping />,
            },
            {
                title: 'Avg. Order Value',
                value: `$${aov.toFixed(2)}`,
                subtitle: 'Revenue / Successful Orders',
                icon: <FaChartLine />,
            },
            {
                title: 'Customers',
                value: new Set(filteredOrders.map(o => o.User?.id)).size.toString(),
                subtitle: 'Unique buyers',
                icon: <FaUserGroup />,
            }
        ];

        // 3. Chart Data: Sales per Day (Grouping)
        const salesMap = new Map<string, number>();
        validOrders.forEach(order => {
            const date = new Date(order.created_at).toLocaleDateString();
            salesMap.set(date, (salesMap.get(date) || 0) + parseFloat(order.total));
        });

        // Convert map to sorted array
        const salesDataArray = Array.from(salesMap.entries())
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            // Limit to last 10 points for cleanliness if too many
            .slice(-14);

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
            customerMap.set(name, (customerMap.get(name) || 0) + parseFloat(o.total));
        });
        const topCustomersArray = Array.from(customerMap.entries())
            .map(([name, total]) => ({ name, total }))
            .sort((b, a) => a.total - b.total)
            .slice(0, 5);

        return {
            kpis: kpisList,
            salesData: salesDataArray,
            statusData: statusDataArray,
            topCustomers: topCustomersArray
        };

    }, [orders, period, loading]);

    // PDF Generator
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text(`Executive Sales Report`, 14, 22);

        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        // Add Summary Stats
        const summary = [
            ["Total Revenue", kpis[0]?.value || "$0"],
            ["Total Orders", kpis[1]?.value || "0"],
            ["Avg Order Value", kpis[2]?.value || "$0"]
        ];

        autoTable(doc, {
            head: [['Metric', 'Value']],
            body: summary,
            startY: 40,
            theme: 'striped',
            headStyles: { fillColor: [66, 66, 66] }
        });

        // Add Orders details
        const tableRows = orders.map(order => [
            order.order_id,
            new Date(order.created_at).toLocaleDateString(),
            `${order.User?.name} ${order.User?.lastname}`,
            order.status.toUpperCase(),
            `$${parseFloat(order.total).toFixed(2)}`
        ]);

        autoTable(doc, {
            head: [["ID", "Date", "Customer", "Status", "Total"]],
            body: tableRows,
            startY: (doc as any).lastAutoTable.finalY + 15,
            theme: 'grid',
            headStyles: { fillColor: [220, 38, 38] },
        });

        doc.save('executive_report.pdf');
    };

    const COLORS = ['#1f2937', '#dc2626', '#6b7280', '#e5e7eb']; // Dark, Red, Gray, Light Gray

    if (loading) return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="animate-fade-in-up max-w-[1400px] mx-auto pb-12">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-dark-bg tracking-tight mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-500 font-medium">Overview of store performance and business insights.</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Period Selector (Mock) */}
                    <div className="relative">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 px-4 pr-10 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        >
                            <option value="all">All Time</option>
                            <option value="month">Last 30 Days</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <FaCalendarDays />
                        </div>
                    </div>

                    <button
                        onClick={generatePDF}
                        className="flex items-center gap-2 bg-dark-bg text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-dark-bg/20 hover:bg-gray-800 transition-all"
                    >
                        <FaFilePdf />
                        <span>Download Report</span>
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpis.map((kpi, i) => <KPICard key={i} kpi={kpi} />)}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Revenue Chart */}
                <div className="lg:col-span-2">
                    <ChartCard title="Revenue Trends">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number | undefined) => [`$${(value || 0).toFixed(2)}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                {/* Status Distribution */}
                <div className="lg:col-span-1">
                    <ChartCard title="Order Status">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </div>

            {/* Top Customers Table (Mini) */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h3 className="font-bold text-gray-800 mb-6">Top Performing Customers</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                                <th className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase">Total Spent</th>
                                <th className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {topCustomers.map((customer, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-gray-700">{customer.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <span className="font-black text-gray-900">${customer.total.toFixed(2)}</span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button className="text-primary text-xs font-bold hover:underline">View Profile</button>
                                    </td>
                                </tr>
                            ))}
                            {topCustomers.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center py-4 text-gray-500">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
