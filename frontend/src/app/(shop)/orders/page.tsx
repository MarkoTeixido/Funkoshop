"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
    const { token, user } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/orders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchOrders();
    }, [user, token, router]);

    if (loading) return <div className="container py-[8rem] text-center text-[2rem]">Cargando pedidos...</div>;

    return (
        <section className="container py-[4rem] px-[2.4rem] min-[1000px]:px-[12.8rem]">
            <h2 className="text-[3.2rem] font-bold uppercase mb-[4rem]">Mis Pedidos</h2>

            {orders.length === 0 ? (
                <p className="text-[1.8rem]">No has realizado ningún pedido aún.</p>
            ) : (
                <div className="flex flex-col gap-[2rem]">
                    {orders.map((order) => (
                        <div key={order.order_id} className="border border-gray-200 p-[2rem] rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-[1rem] border-b pb-[1rem]">
                                <div>
                                    <h3 className="text-[1.8rem] font-bold">Orden #{order.order_number}</h3>
                                    <p className="text-[1.4rem] text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[1.8rem] font-bold text-primary">$ {order.total_amount}</p>
                                    <span className={`inline-block px-[1rem] py-[0.5rem] text-[1.2rem] rounded-full text-white ${order.status === 'processing' ? 'bg-green-500' : 'bg-yellow-500'
                                        }`}>
                                        {order.status === 'processing' ? 'Completado' : 'Pendiente'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-[1rem]">
                                {order.OrderItems?.map((item: any) => (
                                    <div key={item.order_item_id} className="flex justify-between text-[1.6rem]">
                                        <span>{item.quantity}x {item.product_name}</span>
                                        <span>$ {item.subtotal}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
