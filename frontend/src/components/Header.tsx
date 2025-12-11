"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaXmark, FaChevronDown, FaChevronUp } from "react-icons/fa6";

interface HeaderProps {
    isAdmin?: boolean;
}

export default function Header({ isAdmin = false }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

    // Lock scroll when menu is open
    useEffect(() => {
        if (isMenuOpen && window.innerWidth < 1000) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        // Cleanup
        return () => { document.body.style.overflow = "auto"; };
    }, [isMenuOpen]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleSubmenu = () => setIsSubmenuOpen(!isSubmenuOpen);

    return (
        <header className="bg-dark-bg z-50 relative">
            <nav className="container mx-auto flex justify-between items-center px-[2.4rem] py-[0.8rem] min-[1000px]:px-[12.8rem] min-[1000px]:py-[2.8rem] relative">

                {/* Mobile Menu Button */}
                <div className="min-[1000px]:hidden text-white cursor-pointer z-50" onClick={toggleMenu}>
                    {isMenuOpen ? <FaXmark size={24} /> : <FaBars size={24} />}
                </div>

                {/* Logo */}
                <div className="max-w-[150px] min-[1000px]:max-w-[300px]">
                    <Link href="/">
                        <Image
                            src="/images/branding/logo_light_horizontal.svg"
                            alt="Funkoshop Logo"
                            width={200}
                            height={50}
                            className="w-full h-auto"
                            priority
                        />
                    </Link>
                </div>

                {/* Menu Items */}
                <ul className={`
            fixed top-[6.8rem] left-0 w-full h-[calc(100vh-6.8rem)] bg-primary flex flex-col items-center gap-[1.6rem] pt-[1.6rem] z-40 transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            min-[1000px]:translate-x-0 min-[1000px]:static min-[1000px]:h-auto min-[1000px]:w-auto min-[1000px]:bg-transparent min-[1000px]:flex-row min-[1000px]:gap-[2rem] min-[1000px]:pt-0
        `}>

                    {isAdmin ? (
                        /* Admin Menu */
                        <>
                            <li className="text-[1.8rem] font-medium text-white hover:bg-dark-bg min-[1000px]:hover:bg-primary-900 transition-colors px-[1.6rem] py-[0.8rem] w-full min-[1000px]:w-auto text-center">
                                <Link href="/shop" onClick={() => setIsMenuOpen(false)}>VER TIENDA</Link>
                            </li>
                            <li className="text-[1.8rem] font-medium text-white hover:bg-dark-bg min-[1000px]:hover:bg-primary-900 transition-colors px-[1.6rem] py-[0.8rem] w-full min-[1000px]:w-auto text-center">
                                <Link href="/admin" onClick={() => setIsMenuOpen(false)}>ADMIN</Link>
                            </li>
                            <li className="text-[1.8rem] font-medium text-white hover:bg-dark-bg min-[1000px]:hover:bg-primary-900 transition-colors px-[1.6rem] py-[0.8rem] w-full min-[1000px]:w-auto text-center">
                                <Link href="/" onClick={() => setIsMenuOpen(false)}>SALIR</Link>
                            </li>
                        </>
                    ) : (
                        /* Main Menu */
                        <>
                            {/* Shop Dropdown */}
                            <li className="group relative text-[1.8rem] font-medium text-white w-full min-[1000px]:w-auto flex flex-col items-center min-[1000px]:block">
                                <div className="flex items-center justify-center gap-1 cursor-pointer px-[1.6rem] py-[0.8rem] hover:bg-dark-bg min-[1000px]:hover:bg-primary-900 transition-colors w-full min-[1000px]:w-auto">
                                    <Link href="/shop" onClick={() => setIsMenuOpen(false)}>SHOP</Link>
                                    <span onClick={(e) => { e.preventDefault(); toggleSubmenu(); }} className="min-[1000px]:hidden p-2">
                                        {isSubmenuOpen ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                                    </span>
                                    <FaChevronDown className="hidden min-[1000px]:inline-block ml-1 size-4" />
                                </div>

                                {/* Submenu */}
                                <ul className={`
                    bg-dark-bg w-full items-center
                    ${isSubmenuOpen ? 'flex flex-col' : 'hidden'}
                    min-[1000px]:hidden min-[1000px]:group-hover:block min-[1000px]:absolute min-[1000px]:left-0 min-[1000px]:w-[150px] min-[1000px]:z-50
                `}>
                                    <li className="hover:bg-primary-900 px-[1.6rem] py-[0.8rem] w-full text-center min-[1000px]:text-left"><Link href="/shop" onClick={() => setIsMenuOpen(false)}>Funkos</Link></li>
                                    <li className="hover:bg-primary-900 px-[1.6rem] py-[0.8rem] w-full text-center min-[1000px]:text-left"><Link href="/shop" onClick={() => setIsMenuOpen(false)}>Ropa</Link></li>
                                    <li className="hover:bg-primary-900 px-[1.6rem] py-[0.8rem] w-full text-center min-[1000px]:text-left"><Link href="/shop" onClick={() => setIsMenuOpen(false)}>Accesorios</Link></li>
                                </ul>
                            </li>

                            <li className="text-[1.8rem] font-medium text-white hover:bg-dark-bg min-[1000px]:hover:bg-primary-900 transition-colors px-[1.6rem] py-[0.8rem] w-full min-[1000px]:w-auto text-center">
                                <Link href="/contact" onClick={() => setIsMenuOpen(false)}>CONTACTO</Link>
                            </li>
                            <li className="text-[1.8rem] font-medium text-white hover:bg-dark-bg min-[1000px]:hover:bg-primary-900 transition-colors px-[1.6rem] py-[0.8rem] w-full min-[1000px]:w-auto text-center">
                                <Link href="/login" onClick={() => setIsMenuOpen(false)}>LOGIN</Link>
                            </li>
                            <li className="hidden min-[1000px]:block">
                                <Link href="/cart">
                                    <div className="hover:opacity-80 transition-opacity">
                                        <Image src="/images/icons/cart-icon.svg" alt="Carrito" width={40} height={40} />
                                    </div>
                                </Link>
                            </li>
                        </>
                    )}

                </ul>

                {/* Mobile Cart (Non-Admin) */}
                {!isAdmin && (
                    <div className="min-[1000px]:hidden">
                        <Link href="/cart">
                            <Image src="/images/icons/cart-icon.svg" alt="Carrito" width={40} height={40} />
                        </Link>
                    </div>
                )}

            </nav>
        </header>
    );
}
