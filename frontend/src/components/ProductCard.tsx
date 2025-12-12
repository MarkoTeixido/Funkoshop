"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface ProductCardProps {
    id: string | number;
    category: string;
    name: string;
    price: string;
    imageFront: string;
    imageBack: string;
    tag?: string;
    installments?: string;
}

export default function ProductCard({ id, category, name, price, imageFront, imageBack, tag, installments }: ProductCardProps) {
    const { token, user } = useAuth();
    const router = useRouter();

    const addToCart = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();

        if (!user || !token) {
            router.push("/login");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ product_id: id, quantity: 1 })
            });

            if (res.ok) {
                Swal.fire({
                    title: '¡Producto agregado!',
                    text: 'El producto se agregó al carrito correctamente.',
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonColor: '#ff3333',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Ir al carrito',
                    cancelButtonText: 'Seguir comprando'
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push('/cart');
                    }
                });
            } else {
                const data = await res.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Error al agregar al carrito'
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión'
            });
        }
    };

    return (
        <article className="w-full">
            <Link href={`/shop/${id}`} className="block relative group overflow-hidden">
                <figure className="relative group overflow-hidden">
                    {tag && (
                        <span className="absolute right-0 top-0 bg-primary text-white text-[1.4rem] font-medium uppercase px-[1.2rem] py-[0.8rem] z-10 text-[12px]">
                            {tag}
                        </span>
                    )}
                    {/* Front Image */}
                    <div className="block group-hover:hidden animate-fade">
                        <Image
                            src={imageFront}
                            alt={name}
                            width={400}
                            height={400}
                            className="w-full h-auto object-cover aspect-square"
                            priority
                        />
                    </div>
                    {/* Back Image (Box) */}
                    <div className="hidden group-hover:block animate-fade">
                        <Image
                            src={imageBack}
                            alt={`${name} Box`}
                            width={400}
                            height={400}
                            className="w-full h-auto object-cover aspect-square"
                        />
                    </div>
                </figure>
                <div className="p-[1.6rem] flex flex-col gap-[1.2rem]">
                    <p className="text-[1.4rem] font-medium uppercase text-gray-500">{category}</p>
                    <h4 className="text-[1.8rem] font-bold uppercase leading-tight line-clamp-2 min-h-[44px]">{name}</h4>
                    <p className="text-[1.6rem]">{price}</p>
                    {installments && (
                        <p className="text-[1.4rem] font-bold text-secondary uppercase whitespace-nowrap">{installments}</p>
                    )}
                    <button
                        onClick={addToCart}
                        className="w-full bg-primary text-white font-bold text-[1.4rem] py-[1.2rem] rounded-[50px] mt-2 hover:bg-dark-bg transition-colors uppercase z-20 relative"
                    >
                        Agregar al Carrito
                    </button>
                </div>
            </Link>
        </article>
    )
}
