"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaUser, FaBoxOpen, FaSignOutAlt, FaCalendarAlt, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";

interface Order {
    order_id: number;
    order_number: string;
    total_amount: string;
    status: string;
    created_at: string;
    OrderItems: {
        order_item_id: number;
        product_name: string;
        quantity: number;
        unit_price: string;
    }[];
}

const statusColors: any = {
    pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
    processing: "bg-blue-500/20 text-blue-500 border-blue-500/50",
    shipped: "bg-purple-500/20 text-purple-500 border-purple-500/50",
    delivered: "bg-green-500/20 text-green-500 border-green-500/50",
    cancelled: "bg-red-500/20 text-red-500 border-red-500/50",
    completed: "bg-green-500/20 text-green-500 border-green-500/50"
};

const statusLabels: any = {
    pending: "Pendiente",
    processing: "Procesando",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
    completed: "Completado"
};

export default function ProfilePage() {
    // @ts-ignore
    const { user, loginAuth, logout } = useAuth(); // Assuming login updates the context state too if needed
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        phone: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [msg, setMsg] = useState("");

    // Use token from utils to reliably get it
    const token = typeof window !== 'undefined' ? localStorage.getItem('funkoshop_token') : null;

    useEffect(() => {
        if (!token) {
            router.push("/shop/login");
            return;
        }

        const fetchProfileData = async () => {
            setLoading(true);
            try {
                // Fetch User Details
                const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (profileRes.ok) {
                    const data = await profileRes.json();
                    setFormData({
                        name: data.name || "",
                        lastname: data.lastname || "",
                        email: data.email || "",
                        phone: data.phone || ""
                    });
                }

                // Fetch Orders
                const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/orders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (ordersRes.ok) {
                    const data = await ordersRes.json();
                    setOrders(data);
                }

            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [token, router]);

    const handleLogout = () => {
        logout();
        router.push("/shop/login");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setMsg("Perfil actualizado correctamente");
                setTimeout(() => setIsEditing(false), 1500);
            } else {
                setMsg("Error al actualizar perfil");
            }
        } catch (error) {
            console.error(error);
            setMsg("Error de conexión");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-bg pt-32 pb-20 relative overflow-hidden">
                <div className="container-custom relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Profile Card Skeleton */}
                        <div className="lg:col-span-4">
                            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 animate-pulse h-[500px]">
                                <div className="flex flex-col items-center mb-8">
                                    <div className="w-32 h-32 bg-white/10 rounded-full mb-6"></div>
                                    <div className="h-8 w-48 bg-white/10 rounded mb-2"></div>
                                    <div className="h-4 w-32 bg-white/5 rounded"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-16 bg-white/5 rounded-xl"></div>
                                    <div className="h-16 bg-white/5 rounded-xl"></div>
                                </div>
                            </div>
                        </div>

                        {/* Content Skeleton */}
                        <div className="lg:col-span-8 space-y-12">
                            {/* Header Skeleton */}
                            <div className="border-b border-white/10 pb-8">
                                <div className="h-12 w-64 bg-white/10 rounded mb-4 animate-pulse"></div>
                                <div className="h-6 w-96 bg-white/5 rounded animate-pulse"></div>
                            </div>

                            {/* Orders List Skeleton */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="h-8 w-48 bg-white/10 rounded animate-pulse"></div>
                                    <div className="h-6 w-24 bg-white/10 rounded-full animate-pulse"></div>
                                </div>
                                {[1, 2].map((i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
                                        <div className="flex justify-between mb-6">
                                            <div className="space-y-2">
                                                <div className="h-6 w-32 bg-white/10 rounded"></div>
                                                <div className="h-4 w-48 bg-white/5 rounded"></div>
                                            </div>
                                            <div className="h-8 w-24 bg-white/10 rounded"></div>
                                        </div>
                                        <div className="h-24 bg-black/20 rounded-xl"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg text-white pt-32 pb-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/05 rounded-full blur-[120px]"></div>
            </div>

            <div className="container-custom relative z-10 max-w-7xl mx-auto px-4 md:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* User Profile Card - Left Column */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl sticky top-32"
                        >
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-32 h-32 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/30 border-4 border-dark-bg">
                                    <span className="text-4xl font-bold uppercase">{formData.name.charAt(0)}{formData.lastname.charAt(0)}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white uppercase text-center mb-1">{formData.name} {formData.lastname}</h2>
                                <p className="text-gray-400 text-sm">Miembro FunkoClub</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-4 p-4 bg-black/20 rounded-xl border border-white/5">
                                    <FaEnvelope className="text-primary text-xl" />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold">Email</p>
                                        <p className="text-sm font-medium">{formData.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-black/20 rounded-xl border border-white/5">
                                    <FaPhone className="text-primary text-xl" />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold">Teléfono</p>
                                        <p className="text-sm font-medium">{formData.phone || "No registrado"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => handleLogout()}
                                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <FaSignOutAlt /> Cerrar Sesión
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Content - Right Column */}
                    <div className="lg:col-span-8 space-y-12">

                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 border-b border-white/10 pb-8"
                        >
                            <div className="text-center md:text-left w-full md:w-auto">
                                <h1 className="text-3xl md:text-5xl font-black italic uppercase text-white mb-2 break-words leading-tight">Hola, {formData.name}</h1>
                                <p className="text-gray-400 text-base md:text-lg">Bienvenido a tu panel de control.</p>
                            </div>
                        </motion.div>

                        {/* Recent Orders */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                                <h3 className="text-xl md:text-2xl font-bold text-white uppercase flex items-center gap-3">
                                    <FaBoxOpen className="text-primary shrink-0" /> Historial de Pedidos
                                </h3>
                                <span className="self-start sm:self-auto text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-white whitespace-nowrap">{orders.length} Pedidos</span>
                            </div>

                            {orders.length === 0 ? (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                                    <FaBoxOpen className="text-6xl text-gray-600 mx-auto mb-4" />
                                    <h4 className="text-xl font-bold text-white mb-2">No tienes pedidos aún</h4>
                                    <p className="text-gray-400 mb-6">¡Descubre nuestra colección exclusiva y comienza tu aventura!</p>
                                    <button onClick={() => router.push('/shop')} className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-full transition-all">
                                        Ir a la Tienda
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div key={order.order_id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
                                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="font-black text-xl text-white tracking-wider">#{order.order_number}</span>
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${statusColors[order.status] || "bg-gray-500/20 text-gray-500 border-gray-500/50"}`}>
                                                            {statusLabels[order.status] || order.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                        <FaCalendarAlt />
                                                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                                        <span className="mx-1">•</span>
                                                        <span>{new Date(order.created_at).toLocaleTimeString()}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block text-2xl font-bold text-white">${Number(order.total_amount).toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {/* Order Items Preview */}
                                            <div className="bg-black/20 rounded-xl p-4">
                                                <div className="space-y-3">
                                                    {order.OrderItems.map((item) => (
                                                        <div key={item.order_item_id} className="flex justify-between items-center text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-full text-[10px] font-bold text-primary">
                                                                    {item.quantity}x
                                                                </span>
                                                                <span className="text-gray-300">{item.product_name}</span>
                                                            </div>
                                                            <span className="text-gray-400 font-medium">${Number(item.unit_price).toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
