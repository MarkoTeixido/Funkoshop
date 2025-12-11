"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductSlider from "@/components/ProductSlider";

const relatedProducts = [
    { id: "1", category: "STAR WARS", name: "STORMTROOPER LIGHTSABER", price: "$ 1799,99", imageFront: "/images/star-wars/trooper-1.webp", imageBack: "/images/star-wars/trooper-box.webp", tag: "NUEVO", installments: "3 CUOTAS SIN INTERÉS" },
    { id: "2", category: "POKEMON", name: "PIDGEOTTO", price: "$ 1799,99", imageFront: "/images/pokemon/pidgeotto-1.webp", imageBack: "/images/pokemon/pidgeotto-box.webp", tag: "NUEVO", installments: "3 CUOTAS SIN INTERÉS" },
    { id: "3", category: "HARRY POTTER", name: "LUNA LOVEGOOD LION MASK", price: "$ 1799,99", imageFront: "/images/harry-potter/luna-1.webp", imageBack: "/images/harry-potter/luna-box.webp", tag: "NUEVO", installments: "3 CUOTAS SIN INTERÉS" },
    { id: "1", category: "STAR WARS", name: "STORMTROOPER LIGHTSABER", price: "$ 1799,99", imageFront: "/images/star-wars/trooper-1.webp", imageBack: "/images/star-wars/trooper-box.webp", tag: "NUEVO", installments: "3 CUOTAS SIN INTERÉS" },
    { id: "2", category: "POKEMON", name: "PIDGEOTTO", price: "$ 1799,99", imageFront: "/images/pokemon/pidgeotto-1.webp", imageBack: "/images/pokemon/pidgeotto-box.webp", tag: "NUEVO", installments: "3 CUOTAS SIN INTERÉS" },
];

export default function ProductDetail() {
    const [quantity, setQuantity] = useState(0);
    const increment = () => setQuantity(prev => prev + 1);
    const decrement = () => setQuantity(prev => (prev > 0 ? prev - 1 : 0));

    return (
        <main>
            <section className="container px-[2.4rem] min-[1000px]:px-[12rem] py-[6rem] text-dark">
                <article className="flex flex-col md:flex-row items-center gap-[4rem] md:gap-[8rem]">
                    {/* Image */}
                    <picture className="w-full max-w-[400px] md:max-w-1/2 flex justify-center">
                        <Image
                            src="/images/star-wars/baby-yoda-1.webp"
                            alt="Baby Yoda"
                            width={500}
                            height={500}
                            className="w-full h-auto object-contain"
                            priority
                        />
                    </picture>

                    {/* Content */}
                    <div className="flex flex-col gap-[2rem] w-full max-w-[500px]">
                        <p className="text-[1.6rem] font-medium uppercase text-gray-500">STAR WARS</p>
                        <h3 className="text-[3.2rem] font-bold uppercase leading-tight font-raleway">BABY YODA BLUEBALL</h3>
                        <p className="text-[1.8rem] font-light">
                            Figura coleccionable de Baby Yoda (Grogu) - The Mandalorian Saga, edición limitada.
                        </p>
                        <h3 className="text-[2.8rem] font-medium my-[1rem]">$ 1799,99</h3>

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
                            <button className="bg-dark-bg text-white px-[2.4rem] py-[0.8rem] text-[1.6rem] font-medium hover:bg-primary-900 transition-colors uppercase">
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
            <ProductSlider title="PRODUCTOS RELACIONADOS" products={relatedProducts} />
        </main>
    );
}
