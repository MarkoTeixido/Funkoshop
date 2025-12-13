"use client";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";

export default function EditProduct({ params }: { params: Promise<{ product_id: string }> }) {
    const { product_id } = use(params);
    const router = useRouter();
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
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

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products/${product_id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("Error fetching product");
                return res.json();
            })
            .then(data => {
                setFormData({
                    category_id: data.category_id || '',
                    licence_id: data.licence_id || '',
                    product_name: data.product_name || '',
                    product_description: data.product_description || '',
                    sku: data.sku || '',
                    price: data.price || '',
                    stock: data.stock || '',
                    discount: data.discount || '',
                    dues: data.dues || '',
                    image_front: data.image_front || '',
                    image_back: data.image_back || ''
                });
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                Swal.fire('Error', 'No se pudo cargar el producto', 'error');
                router.push('/admin/dashboard');
            });
    }, [product_id, token, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products/${product_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                Swal.fire('Actualizado!', 'El producto ha sido actualizado exitosamente', 'success').then(() => {
                    router.push('/admin/dashboard');
                });
            } else {
                Swal.fire('Error', data.error || 'Error al actualizar producto', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    };

    if (loading) return <div className="container py-10 text-center text-[2rem]">Cargando...</div>;

    return (
        <div className="container py-[4rem] text-dark px-[2.4rem] min-[1000px]:px-[12rem]">
            <div className="flex items-center gap-4 mb-[4rem]">
                <Link href="/admin/dashboard" className="text-gray-500 hover:text-dark-bg">
                    <FaArrowLeft size={24} />
                </Link>
                <h1 className="text-[3.2rem] font-bold uppercase">EDITAR ITEM #{product_id}</h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-[1000px] flex flex-col gap-[4rem]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[4rem]">
                    {/* Category */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="category_id">Categoría:</label>
                        <select id="category_id" name="category_id" value={formData.category_id} onChange={handleChange} className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] bg-white outline-none cursor-pointer">
                            <option value="">Seleccionar</option>
                            <option value="1">Figuras</option>
                            <option value="2">Remeras</option>
                        </select>
                    </div>
                    {/* License */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="licence_id">Licencia:</label>
                        <select id="licence_id" name="licence_id" value={formData.licence_id} onChange={handleChange} className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] bg-white outline-none cursor-pointer">
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
                    <input type="text" id="product_name" name="product_name" value={formData.product_name} onChange={handleChange} className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium" htmlFor="product_description">Descripción:</label>
                    <textarea id="product_description" name="product_description" value={formData.product_description} onChange={handleChange} rows={6} placeholder="Descripción del producto" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400 resize-none"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-[4rem]">
                    {/* SKU */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="sku">SKU:</label>
                        <input id="sku" name="sku" type="text" value={formData.sku} onChange={handleChange} className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                    </div>
                    {/* Price */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="price">Precio:</label>
                        <input id="price" name="price" type="number" value={formData.price} onChange={handleChange} className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                    </div>
                    {/* Stock */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="stock">Stock:</label>
                        <input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[4rem]">
                    {/* Discount */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="discount">Descuento:</label>
                        <input id="discount" name="discount" type="number" value={formData.discount} onChange={handleChange} className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                    </div>
                    {/* Installments */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="dues">Cuotas:</label>
                        <select id="dues" name="dues" value={formData.dues} onChange={handleChange} className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] bg-white outline-none cursor-pointer">
                            <option value="">Seleccionar</option>
                            <option value="3">3 Cuotas sin interés</option>
                            <option value="6">6 Cuotas sin interés</option>
                            <option value="12">12 Cuotas sin interés</option>
                        </select>
                    </div>
                </div>

                {/* Images */}
                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium" htmlFor="image_front">URL Imagen Frente:</label>
                    <input type="text" id="image_front" name="image_front" value={formData.image_front} onChange={handleChange} className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                </div>
                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium" htmlFor="image_back">URL Imagen Dorso:</label>
                    <input type="text" id="image_back" name="image_back" value={formData.image_back} onChange={handleChange} className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                </div>

                {/* Current Images Preview */}
                <div className="flex gap-[4rem] justify-center mt-4">
                    {formData.image_front && (formData.image_front.startsWith('http') || formData.image_front.startsWith('/')) && (
                        <div className="flex flex-col gap-[1rem] items-center">
                            <div className="relative w-[150px] h-[150px]">
                                <Image src={formData.image_front} alt="Frente" fill className="object-contain" sizes="150px" />
                            </div>
                            <p className="text-[1.6rem] font-medium text-secondary">Frente</p>
                        </div>
                    )}
                    {formData.image_back && (formData.image_back.startsWith('http') || formData.image_back.startsWith('/')) && (
                        <div className="flex flex-col gap-[1rem] items-center">
                            <div className="relative w-[150px] h-[150px]">
                                <Image src={formData.image_back} alt="Dorso" fill className="object-contain" sizes="150px" />
                            </div>
                            <p className="text-[1.6rem] font-medium text-secondary">Dorso</p>
                        </div>
                    )}
                </div>

                <button type="submit" className="bg-primary text-white px-[2.4rem] py-[0.8rem] text-[1.6rem] font-medium hover:bg-primary-900 transition-colors uppercase self-center w-full md:w-auto">
                    Modificar Producto
                </button>
            </form>
        </div>
    );
}
