"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaCircleXmark } from "react-icons/fa6";

export default function Cart() {
    const [quantity, setQuantity] = useState(0);

    const increment = () => setQuantity(prev => prev + 1);
    const decrement = () => setQuantity(prev => (prev > 0 ? prev - 1 : 0));

    return (
        <div className="container py-[8rem] text-dark relative">
            <section className="flex flex-col gap-[4rem] px-[2.4rem] min-[1000px]:px-[12rem] mb-[4rem]">
                <h1 className="text-[3.8rem] font-bold uppercase border-b-[4px] border-primary pb-[1.2rem] w-full max-w-[600px]">CARRITO DE COMPRAS</h1>

                <div className="flex flex-col gap-[2rem]">
                    {/* Header (Hidden on Mobile usually, but let's keep simple) */}
                    <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_auto] gap-[2rem] font-bold text-[1.8rem] px-[2rem] shadow-sm pb-4 rounded-[10px]">
                        <p>DETALLE DEL PRODUCTO</p>
                        <p>CANTIDAD</p>
                        <p>TOTAL</p>
                        <p></p>
                    </div>

                    {/* Item */}
                    <div className="bg-light-bg rounded-[10px] p-[2rem] shadow-md grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr_auto] gap-[2rem] items-center relative">
                        <div className="flex items-center gap-[2rem]">
                            <Image src="/images/star-wars/baby-yoda-1.webp" alt="Baby Yoda" width={100} height={100} className="w-[80px] h-auto object-contain" />
                            <div className="flex flex-col gap-[0.4rem]">
                                <h3 className="text-[1.8rem] font-bold">BABY YODA BLUEBALL</h3>
                                <p className="text-[1.4rem] font-medium text-gray-500">STAR WARS</p>
                                <p className="text-[1.4rem] font-medium">PRECIO: $ 1799,99</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={quantity}
                                readOnly
                                className="w-[6rem] text-center border border-dark rounded-[10px] py-[0.4rem] text-[1.6rem]"
                            />
                            <div className="flex flex-col gap-1">
                                <button onClick={increment} className="bg-dark-bg text-white w-[2rem] h-[2rem] rounded-[4px] flex items-center justify-center text-[1.2rem] hover:opacity-90 transition-opacity">+</button>
                                <button onClick={decrement} className="bg-dark-bg text-white w-[2rem] h-[2rem] rounded-[4px] flex items-center justify-center text-[1.2rem] hover:opacity-90 transition-opacity">-</button>
                            </div>
                        </div>

                        <p className="text-[1.8rem] font-medium text-primary">$ {(1799.99 * 2).toFixed(2)}</p>

                        <button className="text-secondary hover:text-red-500 transition-colors absolute top-4 right-4 md:static">
                            <FaCircleXmark size={24} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Resumen */}
            <section className="flex flex-col gap-[4rem] px-[2.4rem] min-[1000px]:px-[12rem] items-end">
                <h2 className="text-[3.8rem] font-bold uppercase border-b-[4px] border-primary pb-[1.2rem] w-full max-w-[600px] text-right">RESUMEN</h2>
                <div className="bg-light-bg rounded-[10px] w-full max-w-[600px] shadow-md">
                    <div className="p-[2rem] flex justify-between items-center text-[1.8rem] border-b border-gray-300">
                        <p>CANTIDAD DE ELEMENTOS</p>
                        <p>3</p>
                    </div>
                    <div className="p-[2rem] flex justify-between items-center text-[1.8rem] border-b border-gray-300">
                        <p>SUBTOTAL</p>
                        <p>$ 5399,97</p>
                    </div>
                    <div className="p-[2rem] flex justify-between items-center text-[1.8rem] border-b border-gray-300">
                        <p>ENVIO</p>
                        <p>$ 0,00</p>
                    </div>
                    <div className="p-[2rem] flex justify-between items-center text-[2.4rem] font-bold text-primary">
                        <p>TOTAL</p>
                        <p>$ 5399,97</p>
                    </div>
                </div>
                <button className="bg-dark-bg text-white w-full max-w-[600px] py-[1.6rem] text-[1.8rem] font-medium hover:bg-primary-900 transition-colors uppercase">IR A PAGAR</button>
            </section>
        </div>
    );
}
