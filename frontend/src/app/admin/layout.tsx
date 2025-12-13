"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaChartBar, FaList, FaFileArrowDown, FaRegBell } from "react-icons/fa6";

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
        <div className="flex flex-col min-h-screen">
            <Header isAdmin={true} notificationCount={notifications} />

            {/* Main Content */}
            <main className="flex-1 min-h-[calc(100vh-400px)] standard-container py-12">
                {children}
            </main>

            <Footer isAdmin={true} />
        </div>
    );
}
