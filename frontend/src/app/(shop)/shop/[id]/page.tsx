"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductSlider from "@/components/ProductSlider";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function ProductDetail() {
    const { id } = useParams();
    const { token, user } = useAuth();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [related, setRelated] = useState<any[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    const increment = () => setQuantity(prev => prev + 1);
    const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Assuming route is /shop/item/:id based on shopRoutes
                // If app.js mounts shopRoutes at /, then it's /item/:id
                // But ProductCard uses /shop/item/:id in fetch.
                // Let's assume /shop/item/:id for now or adjust based on app.js check
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/item/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setProduct(data.product);
                    setRelated(data.related.map((p: any) => ({
                        id: p.product_id,
                        category: p.licence?.licence_name || 'Category',
                        name: p.product_name,
                        price: `$ ${p.price}`,
                        imageFront: p.image_front,
                        imageBack: p.image_back,
                        tag: p.is_featured ? "NUEVO" : "",
                        installments: "3 CUOTAS SIN INTERÉS"
                    })));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    const addToCart = async () => {
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
                body: JSON.stringify({ product_id: id, quantity: quantity })
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
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al agregar al carrito'
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

    if (loading) return <div className="container py-[8rem] text-center text-[2rem]">Cargando...</div>;
    if (!product) return <div className="container py-[8rem] text-center text-[2rem]">Producto no encontrado</div>;

    return (
        <main>
            <section className="container px-[2.4rem] min-[1000px]:px-[12rem] py-[6rem] text-dark">
                <article className="flex flex-col md:flex-row items-center gap-[4rem] md:gap-[8rem]">
                    {/* Image */}
                    <picture className="w-full max-w-[400px] md:max-w-1/2 flex justify-center relative aspect-square">
                        <Image
                            src={product.image_front}
                            alt={product.product_name}
                            fill
                            className="object-contain"
                            priority
                        />
                    </picture>

                    {/* Content */}
                    <div className="flex flex-col gap-[2rem] w-full max-w-[500px]">
                        <p className="text-[1.6rem] font-medium uppercase text-gray-500">{product.licence?.licence_name}</p>
                        <h3 className="text-[3.2rem] font-bold uppercase leading-tight font-raleway">{product.product_name}</h3>
                        <p className="text-[1.8rem] font-light">
                            {product.product_description}
                        </p>
                        <h3 className="text-[2.8rem] font-medium my-[1rem]">$ {product.price}</h3>

                        <div className="flex gap-[2rem] items-center">
                            <div className="flex items-center gap-0 w-[12rem] relative">
                                <input
                                    type="text"
                                    value={quantity}
                                    readOnly
                                    className="w-full text-center border font-medium border-dark rounded-[50px] py-[0.8rem] text-[1.8rem]"
                                />
                                <div className="absolute right-0 flex flex-col h-full justify-center pr-2">
                                    <button onClick={increment} className="text-[1.4rem] leading-none px-2 font-bold hover:text-primary transition-colors">+</button>
                                    <button onClick={decrement} className="text-[1.4rem] leading-none px-2 font-bold hover:text-primary transition-colors">-</button>
                                </div>
                            </div>
                            <button onClick={addToCart} className="bg-dark-bg text-white px-[2.4rem] py-[0.8rem] text-[1.6rem] font-medium hover:bg-primary-900 transition-colors uppercase">
                                Agregar al Carrito
                            </button>
                        </div>

                        <div className="flex items-center gap-2 mt-[2rem]">
                            <Link href="#" className="text-[1.4rem] text-secondary font-bold hover:underline underline-offset-4 pointer-events-none">Ver métodos de pago</Link>
                            <span className="text-[1.4rem] font-bold text-secondary">- 3 CUOTAS SIN INTERÉS</span>
                        </div>
                    </div>
                </article>
            </section>

            {/* Slider */}
            <ProductSlider title="PRODUCTOS RELACIONADOS" products={related} />
        </main>
    );
}
