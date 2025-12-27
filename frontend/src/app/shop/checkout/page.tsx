"use client";
import React, { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FaCreditCard, FaTruck, FaCheckCircle, FaLock, FaChevronRight, FaBoxOpen } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { authUtils } from '@/utils/auth.utils';

// Animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
};

const stepVariants: Variants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { x: -20, opacity: 0, transition: { duration: 0.3 } }
};

export default function CheckoutPage() {
    const { cartItems, subtotal, fetchCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
    const [processingPayment, setProcessingPayment] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialLoading(false);
        }, 800);
        fetchCart();
        return () => clearTimeout(timer);
    }, [fetchCart]);

    const [shippingData, setShippingData] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'Argentina',
        phone: ''
    });

    const [paymentData, setPaymentData] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessingPayment(true);

        // Simulate network delay for "processing payment"
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authUtils.getShopToken()}` // Ensure token is sent
                },
                body: JSON.stringify(shippingData)
            });

            if (res.status === 401 || res.status === 403) {
                alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
                router.push('/shop/login');
                return;
            }

            const data = await res.json();

            if (res.ok) {
                setOrderId(data.orderId);
                setStep(3); // Go to success step
                // Clear cart locally is handled by backend + re-fetch, but ideally we should clear context
                // For now, redirecting effectively resets view if we reload or re-fetch
            } else {
                alert(data.message || "Error al procesar el pedido");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            setProcessingPayment(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-dark-bg relative overflow-x-hidden pt-24 pb-20">
                <div className="container-custom relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                    {/* Header Skeleton */}
                    <div className="mb-12">
                        <div className="h-4 w-32 bg-white/10 rounded mb-4 animate-pulse"></div>
                        <div className="h-16 w-3/4 bg-white/10 rounded animate-pulse"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
                        {/* Form Skeleton */}
                        <div className="lg:col-span-7">
                            <div className="flex items-center mb-10 space-x-4 animate-pulse">
                                <div className="w-10 h-10 rounded-full bg-white/10"></div>
                                <div className="h-4 w-16 bg-white/5 rounded"></div>
                                <div className="h-0.5 w-16 bg-white/5"></div>
                                <div className="w-10 h-10 rounded-full bg-white/5"></div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] h-[500px] animate-pulse">
                                <div className="h-8 w-1/2 bg-white/10 rounded mb-8"></div>
                                <div className="space-y-6">
                                    <div className="h-14 w-full bg-white/5 rounded-xl"></div>
                                    <div className="h-14 w-full bg-white/5 rounded-xl"></div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="h-14 w-full bg-white/5 rounded-xl"></div>
                                        <div className="h-14 w-full bg-white/5 rounded-xl"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Skeleton */}
                        <div className="lg:col-span-5">
                            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] h-[400px] animate-pulse">
                                <div className="h-6 w-1/3 bg-white/10 rounded mb-8"></div>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 bg-white/5 rounded-2xl"></div>
                                        <div className="flex-1 space-y-2 py-2">
                                            <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                                            <div className="h-3 w-1/2 bg-white/5 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/5 my-4"></div>
                                    <div className="h-8 w-full bg-white/5 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0 && step !== 3) {
        return (
            <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dp7jr9k94/image/upload/v1735048386/pattern_grid_dark_g8m9q5.png')] opacity-10"></div>
                <div className="relative z-10 max-w-md">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                        <FaBoxOpen className="text-4xl text-gray-500" />
                    </div>
                    <h1 className="text-4xl font-black italic uppercase text-white mb-4">Tu Carrito está Vacío</h1>
                    <p className="text-gray-400 mb-8 text-lg">Parece que aún no has elegido tu próximo coleccionable.</p>
                    <Link href="/shop" className="bg-primary hover:bg-primary-hover text-white font-bold py-4 px-10 rounded-full transition-all uppercase tracking-wider shadow-lg shadow-primary/20 inline-flex items-center gap-2">
                        Explorar Tienda <FaChevronRight />
                    </Link>
                </div>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent"></div>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3rem] max-w-lg w-full shadow-2xl"
                >
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-green-500/50 shadow-lg">
                        <FaCheckCircle className="text-5xl text-white" />
                    </div>
                    <h1 className="text-4xl font-black italic uppercase text-white mb-2">¡Pedido Confirmado!</h1>
                    <p className="text-gray-300 mb-8 text-lg">Gracias por tu compra. Tu orden <span className="text-primary font-bold">#{orderId || 'PENDING'}</span> está siendo procesada.</p>

                    <div className="space-y-4">
                        <button onClick={() => router.push('/shop')} className="w-full bg-white text-dark-bg font-bold py-4 rounded-xl transition-transform hover:scale-[1.02]">
                            Seguir Comprando
                        </button>
                        <button onClick={() => router.push('/shop/profile')} className="w-full bg-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/20 transition-colors">
                            Ver Mis Pedidos
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg relative overflow-x-hidden pt-24 pb-20">
            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="container-custom relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-12 text-center md:text-left">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Checkout Seguro</span>
                    <h1 className="text-5xl md:text-6xl font-black italic uppercase text-white drop-shadow-2xl">Finalizar Compra</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">

                    {/* Left Column: Form Steps */}
                    <div className="lg:col-span-7">
                        {/* Step Progress */}
                        <div className="flex items-center justify-center md:justify-start mb-10 space-x-4">
                            <div className={`flex items-center transition-colors duration-300 ${step >= 1 ? 'text-primary' : 'text-gray-600'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${step >= 1 ? 'border-primary bg-primary/20' : 'border-gray-700 bg-transparent'}`}>1</div>
                                <span className="ml-3 font-bold uppercase hidden md:inline">Envío</span>
                            </div>
                            <div className={`h-0.5 w-16 ${step >= 2 ? 'bg-primary' : 'bg-gray-800'}`}></div>
                            <div className={`flex items-center transition-colors duration-300 ${step >= 2 ? 'text-primary' : 'text-gray-600'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${step >= 2 ? 'border-primary bg-primary/20' : 'border-gray-700 bg-transparent'}`}>2</div>
                                <span className="ml-3 font-bold uppercase hidden md:inline">Pago</span>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">
                                        <h2 className="text-2xl font-bold text-white uppercase mb-8 flex items-center gap-3">
                                            <FaTruck className="text-primary" /> Información de Envío
                                        </h2>
                                        <form onSubmit={handleShippingSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Dirección (Calle y Número)</label>
                                                    <input required value={shippingData.street} onChange={e => setShippingData({ ...shippingData, street: e.target.value })} type="text" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" placeholder="Av. Siempre Viva 742" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Ciudad</label>
                                                    <input required value={shippingData.city} onChange={e => setShippingData({ ...shippingData, city: e.target.value })} type="text" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" placeholder="Springfield" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Estado / Provincia</label>
                                                    <input required value={shippingData.state} onChange={e => setShippingData({ ...shippingData, state: e.target.value })} type="text" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" placeholder="New York" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Código Postal</label>
                                                    <input required value={shippingData.zip} onChange={e => setShippingData({ ...shippingData, zip: e.target.value })} type="text" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" placeholder="12345" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Teléfono</label>
                                                    <input required value={shippingData.phone} onChange={e => setShippingData({ ...shippingData, phone: e.target.value })} type="tel" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" placeholder="+54 11 1234 5678" />
                                                </div>
                                            </div>
                                            <div className="pt-6 flex justify-center">
                                                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-[1.02] shadow-lg shadow-primary/25 flex items-center gap-3">
                                                    Continuar a Pago <FaChevronRight />
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">
                                        <div className="flex items-center justify-between mb-8">
                                            <h2 className="text-xl md:text-2xl font-bold text-white uppercase flex items-center gap-3">
                                                <FaCreditCard className="text-primary shrink-0" /> Método de Pago
                                            </h2>
                                            <div className="flex gap-2 opacity-50">
                                                <div className="w-10 h-6 bg-white/10 rounded"></div>
                                                <div className="w-10 h-6 bg-white/10 rounded"></div>
                                            </div>
                                        </div>

                                        <form onSubmit={handlePaymentSubmit} className="space-y-6">
                                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-4 mb-6">
                                                <FaLock className="text-blue-400 mt-1 shrink-0" />
                                                <div>
                                                    <h4 className="font-bold text-blue-400 text-sm uppercase mb-1">Transacción Segura</h4>
                                                    <p className="text-xs text-blue-200/70">Tus datos están protegidos con encriptación de 256-bit.</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Nombre en Tarjeta</label>
                                                <input required value={paymentData.cardName} onChange={e => setPaymentData({ ...paymentData, cardName: e.target.value.toUpperCase() })} type="text" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" placeholder="JUAN PEREZ" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Número de Tarjeta</label>
                                                <input
                                                    required
                                                    value={paymentData.cardNumber}
                                                    onChange={e => {
                                                        const val = e.target.value.replace(/\D/g, '').substring(0, 16);
                                                        const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                                                        setPaymentData({ ...paymentData, cardNumber: formatted });
                                                    }}
                                                    type="text"
                                                    maxLength={19}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                                    placeholder="0000 0000 0000 0000"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Vencimiento</label>
                                                    <input
                                                        required
                                                        value={paymentData.expiry}
                                                        onChange={e => {
                                                            const val = e.target.value.replace(/\D/g, '').substring(0, 6);
                                                            let formatted = val;
                                                            if (val.length >= 2) {
                                                                formatted = val.substring(0, 2) + (val.length > 2 ? '/' + val.substring(2) : '');
                                                            }
                                                            // Better mask logic to handle deletion correctly? 
                                                            // Simple approach: Always reformat raw numbers.
                                                            // If deleting '/', user deletes char before it.
                                                            // If val has 2 chars (e.g. '12'), display '12'. User types 3rd char '123' -> '12/3'.
                                                            setPaymentData({ ...paymentData, expiry: formatted });
                                                        }}
                                                        type="text"
                                                        maxLength={7}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                                        placeholder="MM/AAAA"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">CVC</label>
                                                    <input
                                                        required
                                                        value={paymentData.cvc}
                                                        onChange={e => setPaymentData({ ...paymentData, cvc: e.target.value.replace(/\D/g, '').substring(0, 4) })}
                                                        type="text"
                                                        maxLength={4}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                                        placeholder="123"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-6 sm:gap-0">
                                                <button type="button" onClick={() => setStep(1)} className="text-gray-400 hover:text-white font-bold text-sm uppercase transition-colors">
                                                    Volver
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={processingPayment}
                                                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-[1.02] shadow-lg shadow-green-500/25 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {processingPayment ? (
                                                        <>Procesando <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div></>
                                                    ) : (
                                                        <>Pagar ${subtotal.toFixed(2)} <FaCheckCircle /></>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-32">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10"></div>

                                <h3 className="text-xl font-bold text-white uppercase mb-8 border-b border-white/10 pb-4">Resumen de Orden</h3>

                                <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto p-4 custom-scrollbar">
                                    {cartItems.map((item) => (
                                        <div key={item.cart_item_id} className="flex gap-4 group">
                                            <div className="w-20 h-20 bg-white/5 rounded-2xl p-2 border border-white/10 relative shrink-0">
                                                <Image
                                                    src={item.Product.image_front}
                                                    alt={item.Product.product_name}
                                                    width={80}
                                                    height={80}
                                                    className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center border border-dark-bg z-10 shadow-sm">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <h4 className="text-white font-bold truncate text-sm mb-1">{item.Product.product_name}</h4>
                                                <p className="text-gray-400 text-xs text-primary">{item.Product.is_new ? 'Nuevo' : 'En Stock'}</p>
                                            </div>
                                            <div className="flex flex-col justify-center text-right">
                                                <span className="text-white font-bold text-sm">${(Number(item.Product.price) * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-6 border-t border-white/10">
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Envío</span>
                                        <span className="text-green-400 font-bold">Gratis</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-4 mt-2 border-t border-white/10">
                                        <span className="text-white font-bold text-lg">Total</span>
                                        <span className="text-3xl font-black text-white italic">${subtotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
