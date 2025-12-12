"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { FaPenToSquare, FaTrashCan, FaPlus } from "react-icons/fa6";
import Swal from 'sweetalert2';

export default function AdminDashboard() {
    const { token } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) fetchProducts();
    }, [token]);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Implement delete API call here
                Swal.fire('Eliminado!', 'Funcionalidad de eliminar pendiente de implementación (API)', 'success');
            }
        })
    };

    if (loading) return <div className="text-center py-10">Cargando productos...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold uppercase text-gray-800">Listado de Productos</h2>
                <Link href="/admin/products/create" className="bg-primary text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md">
                    <FaPlus /> NUEVO PRODUCTO
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-800 text-white text-sm uppercase">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">IMG</th>
                            <th className="p-4">Nombre</th>
                            <th className="p-4">SKU</th>
                            <th className="p-4">Precio</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map((p) => (
                            <tr key={p.product_id} className="hover:bg-gray-50">
                                <td className="p-4 font-bold text-gray-600">#{p.product_id}</td>
                                <td className="p-4">
                                    <Image src={p.image_front} alt={p.product_name} width={50} height={50} className="object-contain" />
                                </td>
                                <td className="p-4 font-medium">{p.product_name}</td>
                                <td className="p-4 text-sm text-gray-500">{p.sku}</td>
                                <td className="p-4 font-bold text-green-600">$ {p.price}</td>
                                <td className="p-4 font-bold">{p.stock}</td>
                                <td className="p-4 flex justify-center gap-3">
                                    <button className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition-colors">
                                        <FaPenToSquare size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(p.product_id)} className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors">
                                        <FaTrashCan size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
