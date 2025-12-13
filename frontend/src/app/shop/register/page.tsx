"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        password: "",
        repPassword: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.password !== formData.repPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            const payload = {
                name: formData.name,
                lastname: formData.lastname,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.repPassword
            };

            const data = await authService.register(payload as any);

            if (data.token) {
                setSuccess("Usuario registrado exitosamente. Ingresando...");
                setTimeout(() => {
                    login(data.token, data.user);
                }, 2000);
            } else {
                setSuccess("Registro exitoso. Por favor inicia sesión.");
                setTimeout(() => {
                    router.push("/shop/login");
                }, 2000);
            }

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || err.message || "Error al registrarse");
        }
    };

    return (
        <div className="standard-container py-[8rem] flex justify-center items-center">
            <section className="w-full max-w-[600px] flex flex-col gap-[2.4rem]">
                <div className="text-center space-y-2">
                    <h2 className="text-[3.8rem] font-bold uppercase font-raleway text-dark">CREA TU CUENTA</h2>
                    <p className="text-[1.8rem]">Completa el formulario para ser parte del mundo de los Funkos</p>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-4 rounded text-[1.6rem]">{error}</div>}
                {success && <div className="bg-green-100 text-green-700 p-4 rounded text-[1.6rem]">{success}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-[2rem]">
                    <div className="grid grid-cols-[1fr_2fr] gap-[2rem] items-center">
                        <div className="flex flex-col gap-[2rem] text-right">
                            <label className="text-[1.8rem] font-medium" htmlFor="name">Nombre:</label>
                            <label className="text-[1.8rem] font-medium" htmlFor="lastname">Apellido:</label>
                            <label className="text-[1.8rem] font-medium" htmlFor="email">Email:</label>
                            <label className="text-[1.8rem] font-medium" htmlFor="password">Contraseña:</label>
                            <label className="text-[1.8rem] font-medium" htmlFor="repPassword">Repita Contraseña:</label>
                        </div>
                        <div className="flex flex-col gap-[2rem]">
                            <input name="name" id="name" type="text" placeholder="John" className="border-b-2 border-primary py-[0.4rem] text-[1.6rem] outline-none placeholder:text-gray-400" onChange={handleChange} />
                            <input name="lastname" id="lastname" type="text" placeholder="Doe" className="border-b-2 border-primary py-[0.4rem] text-[1.6rem] outline-none placeholder:text-gray-400" onChange={handleChange} />
                            <input name="email" id="email" type="email" placeholder="johndoe@correo.com" className="border-b-2 border-primary py-[0.4rem] text-[1.6rem] outline-none placeholder:text-gray-400" onChange={handleChange} />
                            <input name="password" id="password" type="password" placeholder="●●●●●●●●●●" className="border-b-2 border-primary py-[0.4rem] text-[1.6rem] outline-none placeholder:text-gray-400" onChange={handleChange} />
                            <input name="repPassword" id="repPassword" type="password" placeholder="●●●●●●●●●●" className="border-b-2 border-primary py-[0.4rem] text-[1.6rem] outline-none placeholder:text-gray-400" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-[2rem] mt-[2rem]">
                        <button type="submit" className="bg-dark-bg text-white px-[3.2rem] py-[1.2rem] text-[1.6rem] font-medium hover:bg-primary-900 transition-colors uppercase">Registrar</button>
                        <div className="flex items-center gap-2">
                            <input id="termAndCondi" name="termAndCondi" type="checkbox" className="size-5 accent-primary" required />
                            <label htmlFor="termAndCondi" className="text-[1.6rem]">Acepta <a href="#" className="text-secondary hover:underline">Terminos y Condiciones</a></label>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
}
