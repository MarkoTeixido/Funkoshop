"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                // Handle different error structures if possible
                setError(data.errors?.[0]?.msg || "Error al iniciar sesión");
                return;
            }

            login(data.accessToken, data.refreshToken, data.user);
        } catch (err) {
            setError("Error de conexión con el servidor");
            console.error(err);
        }
    };

    return (
        <div className="standard-container py-[8rem] flex justify-center items-center">
            <form onSubmit={handleSubmit} className="w-full max-w-[500px] flex flex-col gap-[2.4rem]">
                <h2 className="text-[3.8rem] font-bold text-center uppercase font-raleway mb-[2rem]">Ingresar a mi cuenta</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium" htmlFor="email">Email</label>
                    <input
                        className="border-b-2 border-primary py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400"
                        type="email"
                        id="email"
                        placeholder="johndoe@correo.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium" htmlFor="password">Contraseña</label>
                    <input
                        className="border-b-2 border-primary py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400"
                        type="password"
                        id="password"
                        placeholder="•••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>
                <div className="flex items-center gap-[1rem]">
                    <button type="submit" className="bg-dark-bg text-white px-[3.2rem] py-[1.2rem] text-[1.6rem] font-medium hover:bg-primary-900 transition-colors uppercase">Ingresar</button>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="remember" className="size-5 accent-primary" />
                        <label htmlFor="remember" className="text-[1.6rem]">Recordarme</label>
                    </div>
                </div>
                <Link href="#" className="text-[1.4rem] text-blue-500 hover:underline">Olvidé mi contraseña</Link>
                <div className="text-[1.4rem] text-center mt-4">
                    ¿No tienes una cuenta? <Link href="/register" className="text-primary font-bold hover:underline">Regístrate</Link>
                </div>
            </form>
        </div>
    );
}
