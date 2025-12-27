"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAdminAuth, AdminAuthProvider } from '@/context/AdminAuthContext';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAdminAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Protect Admin Routes
    React.useEffect(() => {
        if (isLoading) return;

        if (pathname === '/admin/login') {
            if (user && user.role === 'admin') router.push('/admin/dashboard');
            return;
        }

        if (!user || user.role !== 'admin') {
            router.push('/admin/login');
        }
    }, [user, isLoading, router, pathname]);

    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    if (pathname === '/admin/login') return <>{children}</>;

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="flex min-h-screen bg-[#F3F4F6] relative flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden bg-[#1E1E1E] text-white p-4 flex justify-between items-center sticky top-0 z-40 w-full shadow-md">
                <div className="relative h-8 w-8">
                    <Image
                        src="https://res.cloudinary.com/dp7jr9k94/image/upload/v1765590925/isotype_jca7v6.svg"
                        alt="Funkoshop"
                        fill
                        className="object-contain" // Removed grayscale/opacity/etc to keep it original
                    />
                </div>
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path></svg>
                </button>
            </div>

            {/* Sidebar with props */}
            {/* @ts-ignore - Temporary ignore until Sidebar is updated */}
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-screen">
                <div className="max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminAuthProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </AdminAuthProvider>
    );
}
