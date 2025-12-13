"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import CartItem from "@/components/cart/CartItem";
import Loader from "@/components/ui/Loader";

export default function Cart() {
    const { user, isAuthenticated } = useAuth();
    const { cartItems, loading, error, fetchCart, updateQuantity, removeItem, subtotal } = useCart();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated, fetchCart]);

    const handleCheckout = () => {
        router.push("/checkout");
    };

    if (loading && cartItems.length === 0) return <div className="container py-[8rem]"><Loader /></div>;

    if (!user) return (
        <div className="container py-[8rem] text-center">
            <h2 className="text-[2.4rem] font-bold mb-4">Debes iniciar sesión para ver tu carrito</h2>
            <button onClick={() => router.push("/login")} className="bg-dark-bg text-white px-6 py-2 rounded text-[1.6rem]">Iniciar Sesión</button>
        </div>
    );

    return (
        <div className="standard-container py-[8rem] text-dark relative">
            <section className="flex flex-col gap-[4rem] mb-[4rem]">
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
                            <CartItem
                                key={item.cart_item_id}
                                item={item}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeItem}
                            />
                        ))}
                    </div>
                )}
            </section>

            {cartItems.length > 0 && (
                <section className="flex flex-col gap-[4rem] items-end">
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
                            <p>$ {subtotal.toFixed(2)}</p>
                        </div>
                    </div>
                    <button onClick={handleCheckout} className="bg-dark-bg text-white w-full max-w-[600px] py-[1.6rem] text-[1.8rem] font-medium hover:bg-primary-900 transition-colors uppercase">FINALIZAR COMPRA</button>
                </section>
            )}
        </div>
    );
}
