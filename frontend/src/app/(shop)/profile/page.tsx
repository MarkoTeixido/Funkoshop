"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { token, user, login } = useAuth(); // Assuming login updates the context state too if needed
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        phone: ""
    });
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        // Fetch fresh user data
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        name: data.name || "",
                        lastname: data.lastname || "",
                        email: data.email || "",
                        phone: data.phone || ""
                    });
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            }
        };

        if (token) fetchProfile();
    }, [user, token, router]);

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

            const data = await res.json();
            if (res.ok) {
                setMsg("Perfil actualizado correctamente");
                // Update local storage and context if necessary, though AuthContext might rely on initial load or needs a refresh
                // For now, we trust the backend update.
            } else {
                setMsg("Error al actualizar perfil");
            }
        } catch (error) {
            console.error(error);
            setMsg("Error de conexión");
        }
    };

    if (!user) return null;

    return (
        <section className="container py-[4rem] px-[2.4rem] min-[1000px]:px-[12.8rem]">
            <h2 className="text-[3.2rem] font-bold uppercase mb-[4rem]">Mi Perfil</h2>

            {msg && (
                <div className={`p-4 mb-4 rounded ${msg.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {msg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-[600px] flex flex-col gap-[2rem]">
                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium">Nombre</label>
                    <input
                        className="border border-gray-300 p-[1rem] rounded text-[1.6rem]"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium">Apellido</label>
                    <input
                        className="border border-gray-300 p-[1rem] rounded text-[1.6rem]"
                        type="text"
                        value={formData.lastname}
                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    />
                </div>
                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium">Email</label>
                    <input
                        className="border border-gray-300 p-[1rem] rounded text-[1.6rem] bg-gray-100 cursor-not-allowed"
                        type="email"
                        value={formData.email}
                        disabled
                    />
                </div>
                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium">Teléfono</label>
                    <input
                        className="border border-gray-300 p-[1rem] rounded text-[1.6rem]"
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                <button type="submit" className="bg-dark-bg text-white px-[3.2rem] py-[1.2rem] text-[1.6rem] font-medium hover:bg-primary-900 transition-colors uppercase self-start mt-[1rem]">
                    Guardar Cambios
                </button>
            </form>
        </section>
    );
}
