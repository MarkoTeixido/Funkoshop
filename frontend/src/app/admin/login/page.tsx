"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Swal from 'sweetalert2';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/admin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                // Login successful
                login(data.accessToken, data.refreshToken, data.user);
                // Redirect handled by Layout or manually here
                router.push('/admin/dashboard');
            } else {
                // Silent fail/Generic message
                setError('Credenciales inválidas');
            }
        } catch (err) {
            console.error(err);
            setError('Error de conexión');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md">
                <div className="bg-primary p-6 text-center">
                    <h1 className="text-white text-3xl font-bold uppercase tracking-wider">Admin Portal</h1>
                    <p className="text-white/80 mt-2 text-sm">Acceso Exclusivo</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:border-primary transition-colors bg-gray-50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:border-primary transition-colors bg-gray-50"
                                required
                            />
                        </div>

                        <button type="submit" className="bg-dark-bg text-white font-bold py-3 mt-4 rounded hover:bg-black transition-colors uppercase tracking-wider shadow-lg">
                            Ingresar
                        </button>
                    </form>
                </div>
                <div className="bg-gray-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Volver a la <a href="/" className="text-primary hover:underline">Tienda</a></p>
                </div>
            </div>
        </div>
    );
}
