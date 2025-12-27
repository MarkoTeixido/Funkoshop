"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaXmark, FaUser, FaRegBell, FaCartShopping, FaChevronDown } from "react-icons/fa6";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/cn";

interface HeaderProps {
    isAdmin?: boolean;
    notificationCount?: number;
}

export default function Header({ isAdmin = false, notificationCount = 0 }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle Scroll
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Handle Click Outside Dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        if (isUserMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isUserMenuOpen]);

    // Lock Body Scroll
    useEffect(() => {
        if (isMobileMenuOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
        return () => { document.body.style.overflow = "auto"; };
    }, [isMobileMenuOpen]);

    const navLinks = isAdmin ? [
        { name: "PRODUCTOS", href: "/admin/dashboard" },
        { name: "ACTIVIDAD", href: "/admin/activity" },
        { name: "REPORTES", href: "/admin/reports" },
    ] : [
        { name: "SHOP", href: "/shop" },
        { name: "CONTACTO", href: "/shop/contact" },
    ];

    const mobileMenuVariants = {
        closed: { opacity: 0, x: "100%" },
        open: { opacity: 1, x: 0, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    };

    const itemVariants = {
        closed: { opacity: 0, x: 50 },
        open: { opacity: 1, x: 0 }
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b",
                isScrolled
                    ? "bg-[#141414] border-white/10 shadow-lg py-3"
                    : "bg-transparent border-transparent py-5"
            )}
        >
            <nav className="container-custom flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="relative z-50">
                    <Image
                        src="https://res.cloudinary.com/dp7jr9k94/image/upload/v1765590926/logo_light_horizontal_cz3q8t.svg"
                        alt="Funkoshop Logo"
                        width={180}
                        height={45}
                        className="w-32 md:w-44 h-auto object-contain hover:opacity-90 transition-opacity"
                        priority
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8">
                    <ul className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "text-sm font-bold tracking-widest hover:text-primary transition-colors",
                                        pathname === link.href ? "text-primary" : "text-white"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Search Bar */}
                    <div className="relative group hidden xl:block">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-primary w-40 focus:w-64 transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
                    {/* Actions */}
                    <div className="flex items-center gap-4 lg:gap-6 lg:border-l lg:border-white/10 lg:pl-6">
                        {isAdmin && (
                            <button className="relative text-white hover:text-primary transition-colors">
                                <FaRegBell size={20} />
                                {notificationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] size-4 flex items-center justify-center rounded-full font-bold">
                                        {notificationCount}
                                    </span>
                                )}
                            </button>
                        )}

                        {!isAdmin && (
                            <Link href="/shop/cart" className="text-white hover:text-primary transition-colors relative group">
                                <FaCartShopping size={20} />
                            </Link>
                        )}

                        {user ? (
                            <>
                                {/* Mobile: Direct Link to Profile */}
                                <Link href="/shop/profile" className="lg:hidden text-white hover:text-primary transition-colors">
                                    <FaUser size={20} />
                                </Link>

                                {/* Desktop: Dropdown Menu */}
                                <div className="relative hidden lg:block" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 text-white hover:text-primary transition-colors"
                                    >
                                        <FaUser size={20} />
                                        <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                                        <FaChevronDown size={10} className="hidden sm:block" />
                                    </button>

                                    {/* Dropdown */}
                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full right-0 mt-4 w-48 bg-[#141414] border border-white/10 rounded-lg shadow-xl overflow-hidden py-2"
                                            >
                                                <Link href="/shop/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">Mi Perfil</Link>
                                                <Link href="/shop/wishlist" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">Lista de Deseos</Link>
                                                <Link href="/shop/orders" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">Mis Pedidos</Link>
                                                <button
                                                    onClick={logout}
                                                    className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-white/5"
                                                >
                                                    Cerrar Sesión
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <Link
                                href="/shop/login"
                                className="bg-primary hover:bg-primary-hover text-white text-xs font-bold p-2 lg:px-5 lg:py-2.5 rounded-full transition-all transform hover:scale-105 whitespace-nowrap flex items-center justify-center h-9 w-9 sm:w-auto sm:h-auto"
                            >
                                <span className="hidden sm:inline">INICIAR SESIÓN</span>
                                <span className="sm:hidden"><FaUser size={14} /></span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="lg:hidden text-white z-50 p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FaXmark size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        variants={mobileMenuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 bg-dark-bg z-40 flex flex-col items-center justify-center lg:hidden"
                    >
                        <ul className="flex flex-col items-center gap-8">
                            {navLinks.map((link) => (
                                <motion.li key={link.name} variants={itemVariants}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-2xl font-bold text-white hover:text-primary tracking-wider"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.li>
                            ))}

                            {/* User Links for Mobile */}
                            {user && !isAdmin && (
                                <>
                                    <motion.div variants={itemVariants} className="w-12 h-px bg-white/20 my-2" />

                                    {/* Link removed from here */}

                                    <motion.li variants={itemVariants}>
                                        <Link href="/shop/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-gray-300 hover:text-white">
                                            LISTA DE DESEOS
                                        </Link>
                                    </motion.li>
                                    <motion.li variants={itemVariants}>
                                        <Link href="/shop/orders" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-gray-300 hover:text-white">
                                            MIS PEDIDOS
                                        </Link>
                                    </motion.li>
                                    <motion.li variants={itemVariants}>
                                        <button
                                            onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                            className="text-xl font-bold text-primary hover:text-red-400"
                                        >
                                            CERRAR SESIÓN
                                        </button>
                                    </motion.li>
                                </>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
