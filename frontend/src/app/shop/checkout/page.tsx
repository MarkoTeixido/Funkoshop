"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import { useCart } from "@/hooks/useCart";
import Loader from "@/components/ui/Loader";

export default function CheckoutPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const { cartItems, subtotal, checkout, fetchCart, loading } = useCart(); // fetchCart to load items on mount

    // Form data for shipping/payment simulation
    const [formData, setFormData] = useState({
        street: 'Calle Falsa 123',
        city: 'Springfield',
        state: 'State',
        zip: '12345',
        country: 'USA',
        phone: '555-5555',
        cardNumber: '**** **** **** 1234',
        cardName: user?.name ? `${user.name} User` : 'John Doe',
        cardExpiry: '12/25',
        cardCVC: '***'
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        } else {
            fetchCart();
        }
    }, [isAuthenticated, router, fetchCart]);

    const handlePayment = async () => {
        try {
            await checkout(formData);
            Swal.fire({
                title: '¡Compra Exitosa!',
                text: 'Muchas gracias por tu compra. Recibirás un correo con los detalles.',
                icon: 'success',
                confirmButtonColor: '#ff3333',
                confirmButtonText: 'Ver mis pedidos'
            }).then(() => {
                router.push('/orders'); // Or /shop
            });
        } catch (error: any) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Error de conexión'
            });
        }
    };

    if (loading && cartItems.length === 0) return <div className="container py-[8rem]"><Loader /></div>;

    if (cartItems.length === 0 && !loading) {
        return (
            <div className="container py-[8rem] text-center">
                <h2 className="text-[3rem] font-bold mb-4">Tu carrito está vacío (Checkout)</h2>
                <button onClick={() => router.push('/shop')} className="bg-primary text-white px-8 py-3 rounded-full text-[1.6rem] font-bold hover:bg-dark-bg transition-colors">Volver a la tienda</button>
            </div>
        )
    }

    return (
        <section className="container py-[4rem] px-[2.4rem] min-[1000px]:px-[12.8rem]">
            <h2 className="text-[3.2rem] font-bold uppercase mb-[4rem]">Finalizar Compra</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[4rem]">
                {/* Resumen de la Orden */}
                <div>
                    <h3 className="text-[2.4rem] font-bold mb-[2rem] border-b pb-2">Resumen del Pedido</h3>
                    <div className="flex flex-col gap-[1.6rem] mb-[2rem]">
                        {cartItems.map((item) => (
                            <div key={item.cart_item_id} className="flex gap-[1rem] items-center">
                                <div className="w-[60px] h-[60px] relative border rounded overflow-hidden">
                                    <Image
                                        src={item.Product?.image_front || '/placeholder.png'}
                                        alt={item.Product?.product_name || 'Product'}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[1.6rem] font-bold">{item.Product?.product_name}</p>
                                    <p className="text-[1.4rem] text-gray-500">Cant: {item.quantity}</p>
                                </div>
                                <p className="text-[1.6rem] font-bold">$ {(Number(item.Product?.price) * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-[2rem] flex justify-between items-center text-[2.4rem] font-bold">
                        <span>Total:</span>
                        <span>$ {subtotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Simulación de Pago */}
                <div className="bg-gray-50 p-[3rem] rounded-lg shadow-sm">
                    <h3 className="text-[2.4rem] font-bold mb-[2rem]">Datos de Pago (Simulado)</h3>
                    <div className="flex flex-col gap-[1.6rem]">
                        <div>
                            <label className="block text-[1.4rem] font-bold mb-1">Nombre en la tarjeta</label>
                            <input type="text" value={formData.cardName} disabled className="w-full p-3 border rounded text-[1.6rem] bg-gray-200" />
                        </div>
                        <div>
                            <label className="block text-[1.4rem] font-bold mb-1">Número de tarjeta</label>
                            <input type="text" value={formData.cardNumber} disabled className="w-full p-3 border rounded text-[1.6rem] bg-gray-200" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[1.4rem] font-bold mb-1">Vencimiento</label>
                                <input type="text" value={formData.cardExpiry} disabled className="w-full p-3 border rounded text-[1.6rem] bg-gray-200" />
                            </div>
                            <div>
                                <label className="block text-[1.4rem] font-bold mb-1">CVC</label>
                                <input type="text" value={formData.cardCVC} disabled className="w-full p-3 border rounded text-[1.6rem] bg-gray-200" />
                            </div>
                        </div>

                        <div className="mt-[2rem]">
                            <p className="text-[1.2rem] text-gray-500 mb-4">* Esta es una simulación. No se realizará ningún cargo real.</p>
                            <button
                                onClick={handlePayment}
                                className="w-full bg-primary text-white text-[1.8rem] font-bold py-[1.5rem] rounded-[50px] hover:bg-dark-bg transition-colors uppercase shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Confirmar Pago
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
