"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-black/90 pt-16 pb-8 border-t border-white/5 w-full mt-auto">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Column 1: Links */}
                    <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
                        <Link href="/shop" className="text-gray-400 hover:text-primary text-sm transition-colors">SHOP</Link>
                        <Link href="/shop/login" className="text-gray-400 hover:text-primary text-sm transition-colors">INGRESAR</Link>
                        <Link href="/shop/contact" className="text-gray-400 hover:text-primary text-sm transition-colors">CONTACTO</Link>
                    </div>

                    {/* Column 2: Legal */}
                    <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
                        <Link href="/" className="text-gray-400 hover:text-primary text-sm transition-colors">TERMINOS & CONDICIONES</Link>
                        <Link href="/" className="text-gray-400 hover:text-primary text-sm transition-colors">POLITICA DE PRIVACIDAD</Link>
                        <Link href="/" className="text-gray-400 hover:text-primary text-sm transition-colors">AYUDA</Link>
                    </div>

                    {/* Column 3: About */}
                    <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-end gap-6 text-center md:text-right">
                        <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                            Funkoshop es tu destino premium para coleccionables.
                            Todos los derechos reservados.
                        </p>
                        <Image
                            src="https://res.cloudinary.com/dp7jr9k94/image/upload/v1765590926/logo_light_horizontal_cz3q8t.svg"
                            alt="Funkoshop"
                            width={120}
                            height={30}
                            className="opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
                        />
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-600">
                        &copy; {new Date().getFullYear()} Funkoshop Inc.
                    </p>
                    <div className="text-xs text-gray-600">
                        Diseñado con <span className="text-primary">♥</span> por Marko
                    </div>
                </div>
            </div>
        </footer>
    );
}
