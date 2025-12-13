"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
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
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products/${id}`, {
                        method: "DELETE",
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (res.ok) {
                        setProducts(products.filter(p => p.product_id !== id));
                        Swal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
                    } else {
                        const data = await res.json();
                        Swal.fire('Error', data.error || 'No se pudo eliminar el producto.', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error', 'Error de conexión al eliminar', 'error');
                }
            }
        });
    };

    if (loading) return <div className="text-center py-10 text-[1.6rem]">Cargando productos...</div>;

    return (
        <div className="text-dark">
            {/* Search */}
            <div className="flex items-center gap-4 mb-[4rem] max-w-[600px]">
                <FaMagnifyingGlass size={24} />
                <input
                    className="w-full border-2 border-primary rounded-[50px] px-[1.6rem] py-[0.8rem] text-[1.6rem] placeholder:text-gray-400 focus:outline-none"
                    type="text"
                    placeholder="código, nombre o categoria"
                />
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-[2rem] gap-4">
                <h1 className="text-[3.2rem] font-bold uppercase text-dark">LISTADO DE PRODUCTOS</h1>
                <div className="flex items-center gap-4">
                    <span className="text-[1.8rem] font-bold text-primary uppercase">AGREGAR</span>
                    <Link href="/admin/products/create" className="bg-primary text-white p-3 rounded-[10px] hover:bg-primary-900 transition-colors">
                        <FaPlus size={24} />
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-[1.6rem] min-w-[600px]">
                    <thead>
                        <tr>
                            <th className="py-4 font-bold uppercase text-dark w-[5%]">ID</th>
                            <th className="py-4 font-bold uppercase text-dark w-[15%]">Código</th>
                            <th className="py-4 font-bold uppercase text-dark w-[40%]">Nombre del Producto</th>
                            <th className="py-4 font-bold uppercase text-dark w-[25%]">Categoria</th>
                            <th className="py-4 w-[15%]"></th>
                        </tr>
                    </thead>
                    <tbody className="font-medium text-[1.4rem]">
                        {products.map((p) => (
                            <tr key={p.product_id} className="border-t border-gray-300">
                                <td className="py-4">#{p.product_id}</td>
                                <td className="py-4">{p.sku}</td>
                                <td className="py-4">{p.product_name}</td>
                                <td className="py-4">{p.category_name || 'N/A'}</td>
                                <td className="py-4 flex gap-4">
                                    <Link href={`/admin/products/${p.product_id}/edit`} className="hover:opacity-80">
                                        <Image src="/images/icons/edit_pencil.svg" alt="Edit" width={24} height={24} />
                                    </Link>
                                    <button onClick={() => handleDelete(p.product_id)} className="hover:opacity-80">
                                        <Image src="/images/icons/delete_trash.svg" alt="Delete" width={24} height={24} />
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
