"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaXmark, FaChevronDown, FaChevronUp, FaUser, FaRegBell, FaCartShopping } from "react-icons/fa6";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
    isAdmin?: boolean;
    notificationCount?: number;
}

export default function Header({ isAdmin = false, notificationCount = 0 }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { user, logout } = useAuth();

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
    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

    return (
        <header className="bg-dark-bg z-50 relative">
            <nav className="standard-container mx-auto flex justify-between items-center py-[0.8rem] min-[1000px]:py-[2.8rem] relative">

                {/* Mobile Menu Button */}
                <div className="min-[1000px]:hidden text-white cursor-pointer z-50" onClick={toggleMenu}>
                    {isMenuOpen ? <FaXmark size={24} /> : <FaBars size={24} />}
                </div>

                {/* Logo */}
                <div className="max-w-[150px] min-[1000px]:max-w-[300px]">
                    <Link href="/">
                        <Image
                            src="https://res.cloudinary.com/dp7jr9k94/image/upload/v1765590926/logo_light_horizontal_cz3q8t.svg"
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
                    fixed top-[4.2rem] left-0 w-full h-[calc(100vh-4.5rem)] bg-primary flex flex-col items-center gap-[1.6rem] pt-[1.6rem] z-40 transition-all duration-300 ease-in-out
                    ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                    min-[1000px]:translate-x-0 min-[1000px]:static min-[1000px]:h-auto min-[1000px]:w-auto min-[1000px]:bg-transparent min-[1000px]:flex-row min-[1000px]:gap-[2rem] min-[1000px]:pt-0
                `}>

                    {isAdmin ? (
                        /* Admin Menu */
                        <>
                            <li className="text-[1.8rem] font-medium text-white hover:bg-dark-bg min-[1000px]:hover:bg-primary-900 transition-colors px-[1.6rem] py-[0.8rem] w-full min-[1000px]:w-auto text-center">
                                <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>PRODUCTOS</Link>
                            </li>
                            <li className="text-[1.8rem] font-medium text-white hover:bg-dark-bg min-[1000px]:hover:bg-primary-900 transition-colors px-[1.6rem] py-[0.8rem] w-full min-[1000px]:w-auto text-center">
                                <Link href="/admin/activity" onClick={() => setIsMenuOpen(false)}>ACTIVIDAD</Link>
                            </li>
                            <li className="text-[1.8rem] font-medium text-white hover:bg-dark-bg min-[1000px]:hover:bg-primary-900 transition-colors px-[1.6rem] py-[0.8rem] w-full min-[1000px]:w-auto text-center">
                                <Link href="/admin/reports" onClick={() => setIsMenuOpen(false)}>REPORTES</Link>
                            </li>
                            <li className="text-[1.8rem] font-medium text-white hover:bg-dark-bg min-[1000px]:hover:bg-primary-900 transition-colors px-[1.6rem] py-[0.8rem] w-full min-[1000px]:w-auto text-center">
                                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="uppercase">SALIR</button>
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
                                <Link href="/shop/contact" onClick={() => setIsMenuOpen(false)}>CONTACTO</Link>
                            </li>

                            {!user ? (
                                <li className="text-[1.8rem] font-medium text-white hover:bg-dark-bg min-[1000px]:hover:bg-primary-900 transition-colors px-[1.6rem] py-[0.8rem] w-full min-[1000px]:w-auto text-center">
                                    <Link href="/shop/login" onClick={() => setIsMenuOpen(false)}>LOGIN</Link>
                                </li>
                            ) : (
                                <li className="group relative hidden min-[1000px]:block">
                                    <div className="cursor-pointer text-white hover:text-primary transition-colors" onClick={toggleUserMenu}>
                                        <FaUser size={24} />
                                    </div>

                                    {/* User Dropdown */}
                                    <ul className={`
                                        bg-dark-bg w-[180px] absolute top-[40px] right-0 z-50 flex flex-col shadow-lg rounded-b-lg border border-primary
                                        ${isUserMenuOpen ? 'block' : 'hidden'}
                                    `}>
                                        <li className="hover:bg-primary-900 px-[1.6rem] py-[1.2rem] text-[1.4rem] font-medium text-white text-left">
                                            <Link href="/shop/profile" onClick={() => { setIsUserMenuOpen(false); setIsMenuOpen(false); }}>Mi Perfil</Link>
                                        </li>
                                        <li className="hover:bg-primary-900 px-[1.6rem] py-[1.2rem] text-[1.4rem] font-medium text-white text-left">
                                            <Link href="/shop/orders" onClick={() => { setIsUserMenuOpen(false); setIsMenuOpen(false); }}>Mis Pedidos</Link>
                                        </li>
                                        <li className="hover:bg-primary-900 px-[1.6rem] py-[1.2rem] text-[1.4rem] font-medium text-white text-left cursor-pointer" onClick={() => { logout(); setIsUserMenuOpen(false); setIsMenuOpen(false); }}>
                                            Cerrar Sesión
                                        </li>
                                    </ul>
                                </li>
                            )}

                            {/* Mobile User Links (Visible only on mobile when logged in) */}
                            {user && (
                                <>
                                    <li className="min-[1000px]:hidden text-[1.8rem] font-medium text-white hover:bg-dark-bg transition-colors px-[1.6rem] py-[0.8rem] w-full text-center">
                                        <Link href="/shop/profile" onClick={() => setIsMenuOpen(false)}>MI PERFIL</Link>
                                    </li>
                                    <li className="min-[1000px]:hidden text-[1.8rem] font-medium text-white hover:bg-dark-bg transition-colors px-[1.6rem] py-[0.8rem] w-full text-center">
                                        <Link href="/shop/orders" onClick={() => setIsMenuOpen(false)}>MIS PEDIDOS</Link>
                                    </li>
                                    <li className="min-[1000px]:hidden text-[1.8rem] font-medium text-white hover:bg-dark-bg transition-colors px-[1.6rem] py-[0.8rem] w-full text-center" onClick={() => { logout(); setIsMenuOpen(false); }}>
                                        CERRAR SESIÓN
                                    </li>
                                </>
                            )}
                            <li className="hidden min-[1000px]:block flex items-center">
                                <Link href="/shop/cart">
                                    <FaCartShopping size={32} className="text-white hover:text-primary transition-colors" />
                                </Link>
                            </li>
                        </>
                    )}

                </ul>

                {/* Right Side Icons */}
                <div className="flex items-center gap-4">
                    {/* Admin Bell */}
                    {isAdmin && (
                        <div className="relative cursor-pointer text-white hover:text-primary transition-colors" title="Notificaciones de Stock">
                            <FaRegBell size={24} />
                            {notificationCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[1rem] w-[1.6rem] h-[1.6rem] flex items-center justify-center rounded-full font-bold">
                                    {notificationCount}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Mobile Cart (Non-Admin) */}
                    {!isAdmin && (!user || (user as any).role_id !== 1) && (
                        <Link href="/shop/cart" className="min-[1000px]:hidden">
                            <FaCartShopping size={32} className="text-white hover:text-primary transition-colors" />
                        </Link>
                    )}
                </div>

            </nav>
        </header>
    );
}
