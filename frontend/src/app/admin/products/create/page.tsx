"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { FaArrowLeft } from "react-icons/fa6";

export default function CreateProduct() {
    const router = useRouter();
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        category: '',
        licence: '',
        product_name: '',
        product_description: '',
        sku: '',
        price: '',
        stock: '',
        discount: '',
        dues: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                Swal.fire('Creado!', 'El producto ha sido creado exitosamente', 'success').then(() => {
                    router.push('/admin/dashboard');
                });
            } else {
                Swal.fire('Error', data.error || 'Error al crear producto', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/dashboard" className="text-gray-500 hover:text-dark-bg">
                    <FaArrowLeft size={24} />
                </Link>
                <h2 className="text-3xl font-bold uppercase text-gray-800">Crear Nuevo Producto</h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-bold mb-2">Categoría</label>
                        <select name="category" onChange={handleChange} className="w-full border p-3 rounded bg-gray-50">
                            <option value="">Seleccionar</option>
                            <option value="1">Figuras</option>
                            <option value="2">Remeras</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Licencia</label>
                        <select name="licence" onChange={handleChange} className="w-full border p-3 rounded bg-gray-50">
                            <option value="">Seleccionar</option>
                            <option value="1">Star Wars</option>
                            <option value="2">Pokemon</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block font-bold mb-2">Nombre del Producto</label>
                    <input type="text" name="product_name" onChange={handleChange} className="w-full border p-3 rounded" placeholder="Ej. Baby Yoda" required />
                </div>

                <div>
                    <label className="block font-bold mb-2">Descripción</label>
                    <textarea name="product_description" onChange={handleChange} className="w-full border p-3 rounded h-32" placeholder="Descripción del producto..."></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block font-bold mb-2">SKU</label>
                        <input type="text" name="sku" onChange={handleChange} className="w-full border p-3 rounded" placeholder="Ej. SW-123" />
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Precio</label>
                        <input type="number" name="price" onChange={handleChange} className="w-full border p-3 rounded" placeholder="0.00" />
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Stock</label>
                        <input type="number" name="stock" onChange={handleChange} className="w-full border p-3 rounded" placeholder="0" />
                    </div>
                </div>

                <div>
                    <label className="block font-bold mb-2">Imágenes (Front/Back)</label>
                    <div className="border-2 border-dashed border-gray-300 p-8 text-center rounded bg-gray-50">
                        <p className="text-gray-500">Funcionalidad de carga de imágenes pendiente de implementación</p>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button type="submit" className="bg-primary text-white px-8 py-3 rounded font-bold hover:bg-dark-bg transition-colors uppercase">Agregar Producto</button>
                    <button type="button" onClick={() => setFormData({
                        category: '', licence: '', product_name: '', product_description: '',
                        sku: '', price: '', stock: '', discount: '', dues: ''
                    })} className="bg-gray-200 text-gray-700 px-6 py-3 rounded font-bold hover:bg-gray-300 transition-colors uppercase">Limpiar</button>
                </div>
            </form>
        </div>
    );
}
