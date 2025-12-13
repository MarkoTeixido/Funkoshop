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
        dues: '',
        image_front: '',
        image_back: ''
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
        <div className="container py-[4rem] text-dark px-[2.4rem] min-[1000px]:px-[12rem]">
            {/* Header/Back */}
            <div className="flex items-center gap-4 mb-[4rem]">
                <Link href="/admin/dashboard" className="text-gray-500 hover:text-dark-bg">
                    <FaArrowLeft size={24} />
                </Link>
                <h1 className="text-[3.2rem] font-bold uppercase">CREAR NUEVO ITEM</h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-[1000px] flex flex-col gap-[4rem]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[4rem]">
                    {/* Category */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="category">Categoria:</label>
                        <select id="category" name="category" onChange={handleChange} className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] bg-white outline-none cursor-pointer">
                            <option value="">Seleccionar</option>
                            <option value="1">Figuras</option>
                            <option value="2">Remeras</option>
                        </select>
                    </div>
                    {/* License */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="licence">Licencia:</label>
                        <select id="licence" name="licence" onChange={handleChange} className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] bg-white outline-none cursor-pointer">
                            <option value="">Seleccionar</option>
                            <option value="1">Star Wars</option>
                            <option value="2">Pokemon</option>
                            <option value="3">Harry Potter</option>
                        </select>
                    </div>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium" htmlFor="product_name">Nombre del producto:</label>
                    <input type="text" name="product_name" id="product_name" onChange={handleChange} placeholder="Kakashi Hatake Shippuden Saga" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium" htmlFor="product_description">Descripción:</label>
                    <textarea name="product_description" id="product_description" onChange={handleChange} placeholder="Descripcion del producto" rows={10} className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400 resize-none"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-[4rem]">
                    {/* SKU */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="sku">SKU:</label>
                        <input id="sku" name="sku" type="text" onChange={handleChange} placeholder="SSK111AB001" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                    </div>
                    {/* Price */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="price">Precio:</label>
                        <input id="price" name="price" type="number" onChange={handleChange} placeholder="0.00" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                    </div>
                    {/* Stock */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="stock">Stock:</label>
                        <input id="stock" name="stock" type="number" onChange={handleChange} placeholder="0" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[4rem]">
                    {/* Discount */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="discount">Descuento:</label>
                        <input id="discount" name="discount" type="number" onChange={handleChange} placeholder="0%" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                    </div>
                    {/* Installments (Cuotas) */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="dues">Cuotas:</label>
                        <select id="dues" name="dues" onChange={handleChange} className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] bg-white outline-none cursor-pointer">
                            <option value="">Seleccionar</option>
                            <option value="3">3 Cuotas sin interes</option>
                            <option value="6">6 Cuotas sin interes</option>
                            <option value="12">12 Cuotas sin interes</option>
                        </select>
                    </div>
                </div>

                {/* Images */}
                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium" htmlFor="image_front">URL Imagen Frente:</label>
                    <input type="text" name="image_front" id="image_front" onChange={handleChange} placeholder="https://..." className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                </div>
                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium" htmlFor="image_back">URL Imagen Dorso:</label>
                    <input type="text" name="image_back" id="image_back" onChange={handleChange} placeholder="https://..." className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                </div>

                <div className="flex gap-[2rem] mt-[2rem]">
                    <button type="submit" className="bg-primary text-white px-[3.2rem] py-[1.2rem] text-[1.6rem] font-medium hover:bg-primary-900 transition-colors uppercase">Agregar Producto</button>
                    <button type="button" onClick={() => setFormData({
                        category: '', licence: '', product_name: '', product_description: '',
                        sku: '', price: '', stock: '', discount: '', dues: '',
                        image_front: '', image_back: ''
                    })} className="bg-dark-bg text-white px-[3.2rem] py-[1.2rem] text-[1.6rem] font-medium hover:bg-gray-700 transition-colors uppercase">Limpiar</button>
                </div>
            </form>
        </div>
    );
}
