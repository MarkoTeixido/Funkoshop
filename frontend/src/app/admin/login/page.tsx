"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { FaUser, FaLock, FaCircleNotch } from "react-icons/fa6";

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAdminAuth();
    const router = useRouter();

    const handleExampleAdmin = () => {
        setEmail('admin@funkoshop.com');
        setPassword('Admin1.');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/admin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                login(data.token, (data as any).user || data.user, '/admin/dashboard');
            } else {
                setError('Credenciales inválidas. Verifica tus datos.');
            }
        } catch (err) {
            console.error(err);
            setError('Error de conexión. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#121212]">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[120px]" />

            <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

            <div className="relative z-10 w-full max-w-md p-8">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="flex justify-center mb-8">
                            <Image
                                src="https://res.cloudinary.com/dp7jr9k94/image/upload/v1765590926/logo_light_horizontal_cz3q8t.svg"
                                alt="Funkoshop Admin"
                                width={180}
                                height={60}
                                className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                            />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Bienvenido</h1>
                        <p className="text-gray-400">Ingresa a tu panel de administración</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                <FaUser />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Correo Electrónico"
                                className="w-full bg-dark-bg/50 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:bg-dark-bg/80 transition-all font-medium"
                                required
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                <FaLock />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Contraseña"
                                className="w-full bg-dark-bg/50 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:bg-dark-bg/80 transition-all font-medium"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-primary to-rose-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
                        >
                            {isSubmitting ? <FaCircleNotch className="animate-spin" /> : 'Ingresar al Portal'}
                        </button>
                    </form>

                    <button
                        onClick={handleExampleAdmin}
                        className="w-full mt-6 py-3 rounded-xl text-xs font-semibold text-gray-400 border border-white/5 bg-white/[0.02] hover:bg-white/10 hover:text-white hover:border-white/20 transition-all uppercase tracking-wider"
                    >
                        Usar credenciales de demostración
                    </button>
                </div>

                <p className="text-center text-gray-600 text-xs mt-8">
                    &copy; {new Date().getFullYear()} FunkoShop Admin Panel. All rights reserved.
                </p>
            </div>
        </div>
    );
}
