"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { FaChartBar, FaRightFromBracket, FaList, FaFileArrowDown, FaRegBell } from "react-icons/fa6";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, token, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [notifications, setNotifications] = useState(0);

    // Protect Admin Routes & Fetch Notifications
    React.useEffect(() => {
        if (isLoading) return;

        if (pathname === '/admin/login') {
            if (user && user.role === 'admin') router.push('/admin/dashboard');
            return;
        }

        if (!user || user.role !== 'admin') {
            router.push('/admin/login');
        } else if (token) {
            // Fetch notifications
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.lowStockCount) setNotifications(data.lowStockCount);
                })
                .catch(err => console.error(err));
        }
    }, [user, isLoading, router, pathname, token]);

    if (pathname === '/admin/login') return <>{children}</>;

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Admin Header */}
            <header className="bg-dark-bg text-white shadow-md">
                <div className="container px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold uppercase tracking-wider">Funkoshop <span className="text-primary text-sm">ADMIN</span></span>
                    </div>

                    <nav className="hidden md:flex gap-6">
                        <Link href="/admin/dashboard" className={`flex items-center gap-2 hover:text-primary transition-colors ${pathname.includes('dashboard') ? 'text-primary' : ''}`}>
                            <FaList /> Productos
                        </Link>
                        <Link href="/admin/activity" className={`flex items-center gap-2 hover:text-primary transition-colors ${pathname.includes('activity') ? 'text-primary' : ''}`}>
                            <FaChartBar /> Actividad
                        </Link>
                        <Link href="/admin/reports" className={`flex items-center gap-2 hover:text-primary transition-colors ${pathname.includes('reports') ? 'text-primary' : ''}`}>
                            <FaFileArrowDown /> Reportes
                        </Link>
                    </nav>

                    <div className="flex items-center gap-6">
                        {/* Notifications */}
                        <div className="relative cursor-pointer hover:text-primary transition-colors" title="Notificaciones de Stock">
                            <FaRegBell size={20} />
                            {notifications > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                    {notifications}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{user.name}</span>
                            <button onClick={logout} className="hover:text-red-400 transition-colors" title="Cerrar Sesión">
                                <FaRightFromBracket size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
