"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShopAuth } from '@/context/AuthContext'; // Creating this file first if not exists, but likely exists based on previous logs
import { FaEnvelope, FaLock, FaArrowRight, FaUserShield, FaUser } from "react-icons/fa6";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { authService } from '@/services/auth.service';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useShopAuth();
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const performLogin = async (e?: React.FormEvent, creds?: { email: string, password: string }) => {
        if (e) e.preventDefault();
        const loginEmail = creds ? creds.email : email;
        const loginPass = creds ? creds.password : password;

        setError('');
        setLoading(true);
        try {
            const response = await authService.login(loginEmail, loginPass);
            if (response.token && response.user) {
                login(response.token, response.user);
            } else {
                setError("Respuesta inválida del servidor");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    const handleTestUserLogin = () => {
        const creds = { email: 'juan@ejemplo.com', password: 'Contraseña1.' };
        setEmail(creds.email);
        setPassword(creds.password);
        performLogin(undefined, creds);
    };

    return (
        <div className="bg-dark-bg min-h-screen flex flex-col">
            {/* Optional: Include Header if desired, or keep auth pages clean */}
            {/* <Header /> */}

            <main className="flex-grow flex items-center justify-center p-4 pt-25 relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl relative z-10">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black italic uppercase text-white mb-2">Bienvenido de Nuevo</h1>
                        <p className="text-gray-400">Ingresa tus credenciales para acceder a tu cuenta.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-bold text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={(e) => performLogin(e)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Correo Electrónico</label>
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    placeholder="nombre@ejemplo.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Contraseña</label>
                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link href="/shop/forgot-password" className="text-xs text-gray-400 hover:text-white transition-colors">
                                ¿Olvidaste tu Contraseña?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            {!loading && <FaArrowRight className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    {/* Test Accounts */}
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <p className="text-center text-xs text-gray-500 uppercase tracking-widest mb-4">Inicio Rápido (Modo Prueba)</p>
                        <div className="grid grid-cols-2 gap-4">
                            <Link
                                href="/admin/login"
                                className="flex flex-col items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl transition-all group"
                            >
                                <FaUserShield className="text-primary group-hover:scale-110 transition-transform" size={20} />
                                <span className="text-xs font-bold text-gray-300">Administrador</span>
                            </Link>
                            <button
                                type="button"
                                onClick={handleTestUserLogin}
                                className="flex flex-col items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl transition-all group"
                            >
                                <FaUser className="text-blue-500 group-hover:scale-110 transition-transform" size={20} />
                                <span className="text-xs font-bold text-gray-300">Usuario</span>
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-gray-400 mt-8 text-sm">
                        ¿No tienes una cuenta? <Link href="/shop/register" className="text-white font-bold hover:underline decoration-primary underline-offset-4">Registrarse</Link>
                    </p>
                </div>
            </main>
            {/* <Footer /> */}
        </div>
    );
}
