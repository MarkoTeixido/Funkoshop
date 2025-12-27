"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaLayerGroup, FaBox, FaCartShopping, FaChartLine, FaUsers, FaGear, FaArrowRightFromBracket, FaRegBell, FaTriangleExclamation } from "react-icons/fa6";
import { useAdminAuth } from '@/context/AdminAuthContext';
import { productService } from '@/services/product.service';

const menuItems = [
    { name: 'Panel', icon: FaLayerGroup, path: '/admin/dashboard' },
    { name: 'Pedidos', icon: FaCartShopping, path: '/admin/orders' },
    { name: 'Reportes', icon: FaChartLine, path: '/admin/reports' },
    { name: 'Configuración', icon: FaGear, path: '/admin/settings' },
];

export default function AdminSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();
    const { logout, token } = useAdminAuth();

    // Notification State
    const [notifications, setNotifications] = useState<{ id: number, message: string }[]>([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        onClose?.();
    }, [pathname]);

    // Fetch Low Stock Products
    useEffect(() => {
        if (!token) return;

        const checkStock = async () => {
            try {
                // Using getAdminDashboard as it returns all products with stock info
                const products = await productService.getAdminDashboard(token);
                const lowStock = products.filter(p => p.stock < 5);

                const newNotifs = lowStock.map(p => ({
                    id: p.product_id,
                    message: `Bajo stock: ${p.product_name} (${p.stock} u.)`
                }));
                setNotifications(newNotifs);
            } catch (error) {
                console.error("Error checking stock notifications", error);
            }
        };

        checkStock();
        // Optional: Interval to check periodically
        const interval = setInterval(checkStock, 60000);
        return () => clearInterval(interval);
    }, [token]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNotificationClick = (id: number) => {
        // Remove notification from list (Mark as read locally)
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={onClose}
                />
            )}

            <aside className={`w-64 bg-[#1E1E1E] border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Area */}
                <div className="p-6 border-b border-white/5 flex flex-col items-center justify-center relative">
                    {/* Close Button Mobile */}
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 md:hidden hover:text-white">
                        <FaArrowRightFromBracket className="rotate-180" />
                    </button>

                    <Link href="/admin/dashboard" className="flex flex-col items-center group">
                        <div className="relative h-10 w-40 mb-2">
                            <Image
                                src="https://res.cloudinary.com/dp7jr9k94/image/upload/v1765590926/logo_light_horizontal_cz3q8t.svg"
                                alt="Funkoshop Admin"
                                fill
                                className="object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                priority
                            />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold group-hover:text-primary transition-colors duration-300">
                            Panel Admin
                        </span>
                    </Link>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => onClose?.()} // Close on click
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                    ? 'bg-gradient-to-r from-primary to-rose-600 text-white shadow-lg shadow-primary/25 font-bold'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon className={`text-lg transition-transform ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile / Logout */}
                <div className="p-4 mt-auto border-t border-white/5 space-y-2">
                    {/* Notification Bell */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-left text-gray-400 hover:text-white group relative"
                        >
                            <div className="w-10 h-10 rounded-full bg-dark-bg border border-white/10 flex items-center justify-center relative group-hover:border-primary/50 transition-colors">
                                <FaRegBell size={18} />
                                {notifications.length > 0 && (
                                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#1E1E1E]"></span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">Notificaciones</span>
                                {notifications.length > 0 && (
                                    <span className="text-xs text-rose-500 font-bold bg-rose-500/10 px-2 rounded-full w-fit mt-0.5">{notifications.length}</span>
                                )}
                            </div>
                        </button>

                        {/* Notification Dropdown */}
                        {isNotifOpen && (
                            <div className="absolute bottom-full left-4 w-64 bg-white rounded-xl shadow-2xl mb-2 overflow-hidden z-50 animate-in slide-in-from-bottom-2">
                                <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Alertas</span>
                                    <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">{notifications.length}</span>
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-6 text-center text-gray-400 text-xs">
                                            No hay notificaciones nuevas.
                                        </div>
                                    ) : (
                                        notifications.map(notif => (
                                            <div
                                                key={notif.id}
                                                onClick={() => handleNotificationClick(notif.id)}
                                                className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 items-start"
                                            >
                                                <div className="text-rose-500 mt-0.5"><FaTriangleExclamation /></div>
                                                <div>
                                                    <p className="text-xs text-gray-600 font-medium leading-relaxed">{notif.message}</p>
                                                    <span className="text-[10px] text-primary font-bold mt-1 block">Marcar como leído</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-left group"
                    >
                        <div className="w-10 h-10 rounded-full bg-dark-bg border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-rose-500 group-hover:border-rose-500/50 transition-colors">
                            <FaArrowRightFromBracket size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white group-hover:text-rose-500 transition-colors">Cerrar Sesión</span>
                            <span className="text-xs text-gray-500">Administrador</span>
                        </div>
                    </button>
                </div>
            </aside>
        </>
    );
}
