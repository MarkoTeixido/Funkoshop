"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaCircleXmark } from "react-icons/fa6";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Product {
    product_id: number;
    product_name: string;
    price: string;
    image_front: string;
    category: { category_name: string };
}

interface CartItem {
    cart_item_id: number;
    quantity: number;
    product_id: number;
    Product: Product;
}

export default function Cart() {
    const { token, user } = useAuth();
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCart = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/cart`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setCartItems(data.CartItems || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token && !loading) {
            // Redirect or show login message
        } else {
            fetchCart();
        }
    }, [token]);

    const updateQuantity = async (productId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/cart/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ quantity: newQuantity })
            });
            if (res.ok) {
                fetchCart();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const removeItem = async (productId: number) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/cart/${productId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                fetchCart();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheckout = () => {
        router.push("/checkout");
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.Product.price) * item.quantity), 0);
    const total = subtotal; // Add shipping logic if needed

    if (loading) return <div className="container py-[8rem] text-center text-[2rem]">Cargando carrito...</div>;

    if (!user) return (
        <div className="container py-[8rem] text-center">
            <h2 className="text-[2.4rem] font-bold mb-4">Debes iniciar sesión para ver tu carrito</h2>
            <button onClick={() => router.push("/login")} className="bg-dark-bg text-white px-6 py-2 rounded text-[1.6rem]">Iniciar Sesión</button>
        </div>
    );

    return (
        <div className="container py-[8rem] text-dark relative">
            <section className="flex flex-col gap-[4rem] px-[2.4rem] min-[1000px]:px-[12rem] mb-[4rem]">
                <h1 className="text-[3.8rem] font-bold uppercase border-b-[4px] border-primary pb-[1.2rem] w-full max-w-[600px]">CARRITO DE COMPRAS</h1>

                {error && <div className="bg-red-100 text-red-700 p-4 rounded text-[1.6rem]">{error}</div>}

                {cartItems.length === 0 ? (
                    <p className="text-[2rem] text-center py-10">Tu carrito está vacío.</p>
                ) : (
                    <div className="flex flex-col gap-[2rem]">
                        <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_auto] gap-[2rem] font-bold text-[1.8rem] px-[2rem] shadow-sm pb-4 rounded-[10px]">
                            <p>DETALLE DEL PRODUCTO</p>
                            <p>CANTIDAD</p>
                            <p>TOTAL</p>
                            <p></p>
                        </div>

                        {cartItems.map((item) => (
                            <div key={item.cart_item_id} className="bg-light-bg rounded-[10px] p-[2rem] shadow-md grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr_auto] gap-[2rem] items-center relative">
                                <div className="flex items-center gap-[2rem]">
                                    <Image src={item.Product.image_front || "/placeholder.webp"} alt={item.Product.product_name} width={100} height={100} className="w-[80px] h-auto object-contain" />
                                    <div className="flex flex-col gap-[0.4rem]">
                                        <h3 className="text-[1.8rem] font-bold uppercase">{item.Product.product_name}</h3>
                                        <p className="text-[1.4rem] font-medium text-gray-500">{item.Product.category?.category_name || "Coleccionable"}</p>
                                        <p className="text-[1.4rem] font-medium">PRECIO: $ {item.Product.price}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={item.quantity}
                                        readOnly
                                        className="w-[6rem] text-center border border-dark rounded-[10px] py-[0.4rem] text-[1.6rem]"
                                    />
                                    <div className="flex flex-col gap-1">
                                        <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="bg-dark-bg text-white w-[2rem] h-[2rem] rounded-[4px] flex items-center justify-center text-[1.2rem] hover:opacity-90 transition-opacity">+</button>
                                        <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="bg-dark-bg text-white w-[2rem] h-[2rem] rounded-[4px] flex items-center justify-center text-[1.2rem] hover:opacity-90 transition-opacity">-</button>
                                    </div>
                                </div>

                                <p className="text-[1.8rem] font-medium text-primary">$ {(parseFloat(item.Product.price) * item.quantity).toFixed(2)}</p>

                                <button onClick={() => removeItem(item.product_id)} className="text-secondary hover:text-red-500 transition-colors absolute top-4 right-4 md:static">
                                    <FaCircleXmark size={24} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {cartItems.length > 0 && (
                <section className="flex flex-col gap-[4rem] px-[2.4rem] min-[1000px]:px-[12rem] items-end">
                    <h2 className="text-[3.8rem] font-bold uppercase border-b-[4px] border-primary pb-[1.2rem] w-full max-w-[600px] text-right">RESUMEN</h2>
                    <div className="bg-light-bg rounded-[10px] w-full max-w-[600px] shadow-md">
                        <div className="p-[2rem] flex justify-between items-center text-[1.8rem] border-b border-gray-300">
                            <p>CANTIDAD DE ELEMENTOS</p>
                            <p>{cartItems.reduce((acc, i) => acc + i.quantity, 0)}</p>
                        </div>
                        <div className="p-[2rem] flex justify-between items-center text-[1.8rem] border-b border-gray-300">
                            <p>SUBTOTAL</p>
                            <p>$ {subtotal.toFixed(2)}</p>
                        </div>
                        <div className="p-[2rem] flex justify-between items-center text-[1.8rem] border-b border-gray-300">
                            <p>ENVIO</p>
                            <p>$ 0,00</p>
                        </div>
                        <div className="p-[2rem] flex justify-between items-center text-[2.4rem] font-bold text-primary">
                            <p>TOTAL</p>
                            <p>$ {total.toFixed(2)}</p>
                        </div>
                    </div>
                    <button onClick={handleCheckout} className="bg-dark-bg text-white w-full max-w-[600px] py-[1.6rem] text-[1.8rem] font-medium hover:bg-primary-900 transition-colors uppercase">FINALIZAR COMPRA</button>
                </section>
            )}
        </div>
    );
}
