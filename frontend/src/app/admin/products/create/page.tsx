"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';
import { useToast } from "@/context/ToastContext";
import { FaArrowLeft } from "react-icons/fa6";

export default function CreateProduct() {
    const router = useRouter();
    const { token } = useAdminAuth();
    const toast = useToast();
    const [categories, setCategories] = useState<any[]>([]);
    const [licences, setLicences] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        category_id: '',
        licence_id: '',
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

    useEffect(() => {
        if (!token) return;
        const fetchData = async () => {
            try {
                const [catRes, licRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/licences`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                if (catRes.ok) setCategories(await catRes.json());
                if (licRes.ok) setLicences(await licRes.json());
            } catch (error) {
                console.error("Failed to load options", error);
            }
        };
        fetchData();
    }, [token]);

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
                toast.success('Creado!', 'El producto ha sido creado exitosamente', {
                    label: 'Volver',
                    onClick: () => router.push('/admin/dashboard')
                });
                setTimeout(() => router.push('/admin/dashboard'), 1500);
            } else {
                toast.error('Error', data.error || 'Error al crear producto');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error', 'Error de conexión');
        }
    };

    return (
        <div className="animate-fade-in-up max-w-[1200px] mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                        <Link href="/admin/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                        <span>/</span>
                        <span>Products</span>
                        <span>/</span>
                        <span className="text-gray-900">Create</span>
                    </div>
                    <h1 className="text-2xl font-black text-dark-bg tracking-tight">New Product</h1>
                    <p className="text-gray-500 text-sm mt-1">Add a new item to your catalog.</p>
                </div>
                <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-2 text-gray-500 hover:text-dark-bg transition-colors font-medium text-sm"
                >
                    <FaArrowLeft />
                    <span>Back to Dashboard</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info Column */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Basic Details Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-full"></span>
                            Basic Information
                        </h2>

                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider" htmlFor="product_name">Product Name</label>
                                    <input
                                        type="text"
                                        name="product_name"
                                        id="product_name"
                                        onChange={handleChange}
                                        placeholder="e.g. Kakashi Hatake Figure"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider" htmlFor="sku">SKU Code</label>
                                    <input
                                        id="sku"
                                        name="sku"
                                        type="text"
                                        onChange={handleChange}
                                        placeholder="e.g. SSK111AB001"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gray-300 font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider" htmlFor="product_description">Description</label>
                                <textarea
                                    name="product_description"
                                    id="product_description"
                                    onChange={handleChange}
                                    placeholder="Detailed description of the product..."
                                    rows={6}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gray-300 resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Media Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-full"></span>
                            Product Images
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider" htmlFor="image_front">Front Image URL</label>
                                <input
                                    type="text"
                                    name="image_front"
                                    id="image_front"
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gray-300"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider" htmlFor="image_back">Back Image URL</label>
                                <input
                                    type="text"
                                    name="image_back"
                                    id="image_back"
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gray-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="flex flex-col gap-6">
                    {/* Organization Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Organization</h2>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500" htmlFor="category_id">Category</label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat: any) => (
                                        <option key={cat.category_id} value={cat.category_id}>
                                            {cat.category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500" htmlFor="licence_id">License</label>
                                <select
                                    id="licence_id"
                                    name="licence_id"
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer"
                                >
                                    <option value="">Select License</option>
                                    {licences.map((lic: any) => (
                                        <option key={lic.licence_id} value={lic.licence_id}>
                                            {lic.licence_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Pricing & Inventory</h2>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500" htmlFor="price">Price ($)</label>
                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500" htmlFor="stock">Stock</label>
                                    <input
                                        id="stock"
                                        name="stock"
                                        type="number"
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500" htmlFor="discount">Discount (%)</label>
                                    <input
                                        id="discount"
                                        name="discount"
                                        type="number"
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500" htmlFor="dues">Installments</label>
                                <select
                                    id="dues"
                                    name="dues"
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer"
                                >
                                    <option value="">Select Option</option>
                                    <option value="3">3 Cuotas sin interes</option>
                                    <option value="6">6 Cuotas sin interes</option>
                                    <option value="12">12 Cuotas sin interes</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-rose-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-rose-600/30 transition-all text-sm uppercase tracking-wide"
                        >
                            Publish Product
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({
                                category_id: '', licence_id: '', product_name: '', product_description: '',
                                sku: '', price: '', stock: '', discount: '', dues: '',
                                image_front: '', image_back: ''
                            })}
                            className="w-full bg-white border border-gray-200 text-gray-500 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm uppercase tracking-wide"
                        >
                            Reset Form
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
