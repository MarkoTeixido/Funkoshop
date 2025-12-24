import Image from "next/image";
import Link from "next/link";
import ProductSlider from "@/components/ProductSlider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Fallback products (Replace with real data hook later if needed)
const fallbackProducts = [
    { id: 1, category: "STAR WARS", name: "STORMTROOPER LIGHTSABER", price: 1799.99, imageFront: "/images/star-wars/trooper-1.webp", imageBack: "https://res.cloudinary.com/dp7jr9k94/image/upload/v1703182285/ironman_front_placeholder.png", tag: "NUEVO", installments: "3 CUOTAS SIN INTERÉS", stock: 10 },
    { id: 2, category: "POKEMON", name: "PIDGEOTTO", price: 1799.99, imageFront: "/images/pokemon/pidgeotto-1.webp", imageBack: "https://res.cloudinary.com/dp7jr9k94/image/upload/v1703182285/ironman_front_placeholder.png", tag: "NUEVO", installments: "3 CUOTAS SIN INTERÉS", stock: 5 },
    { id: 3, category: "HARRY POTTER", name: "LUNA LOVEGOOD", price: 1799.99, imageFront: "/images/harry-potter/luna-1.webp", imageBack: "https://res.cloudinary.com/dp7jr9k94/image/upload/v1703182285/ironman_front_placeholder.png", tag: "HOT", installments: "3 CUOTAS SIN INTERÉS", stock: 2 },
    { id: 4, category: "MARVEL", name: "IRON MAN MARK 85", price: 2100.00, imageFront: "https://res.cloudinary.com/dp7jr9k94/image/upload/v1703182285/ironman_front_placeholder.png", imageBack: "https://res.cloudinary.com/dp7jr9k94/image/upload/v1703182285/ironman_box_placeholder.png", tag: "SALE", installments: "6 CUOTAS SIN INTERÉS", stock: 15 },
];

async function getProducts() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch');
        const collections = await res.json();
        return collections.map((item: any) => ({
            id: item.product_id,
            category: item.licence?.licence_name || "General",
            name: item.product_name,
            price: item.price,
            imageFront: item.image_front,
            imageBack: item.image_back,
            tag: "NUEVO",
            installments: "3 CUOTAS SIN INTERÉS",
            stock: item.stock
        }));
    } catch (error) {
        console.error("Using fallback:", error);
        return fallbackProducts;
    }
}

export default async function Home() {
    const products = await getProducts();

    return (
        <div className="bg-dark-bg min-h-screen flex flex-col">
            <Header />
            <main>
                {/* Hero Section */}
                <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
                    {/* Background with Parallax/Gradient */}
                    <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dp7jr9k94/image/upload/v1766491205/Generated_image_1_1_c66afj.png')] bg-cover bg-center bg-fixed opacity-60 scale-105"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/30 via-transparent to-dark-bg"></div>

                    <div className="container-custom relative z-10 flex flex-col items-start gap-5 px-8">
                        <span className="bg-primary/20 border border-primary text-primary px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase backdrop-blur-sm animate-fade-in">
                            Nueva Colección
                        </span>

                        <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tight uppercase leading-[0.9] drop-shadow-2xl">
                            Desata el <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500 pr-6">
                                Multiverso
                            </span>
                        </h1>

                        <p className="max-w-xl text-gray-200 text-lg md:text-xl font-semibold leading-relaxed drop-shadow-lg">
                            Sumérgete en la colección más exclusiva. Desde raras variantes chase hasta tus favoritos. Encuentra el Pop! que completa tu set.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-4">
                            <Link
                                href="/shop"
                                className="px-8 py-4 bg-primary hover:bg-primary-hover text-white text-lg font-bold rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(229,9,20,0.5)]"
                            >
                                Ver Colección
                            </Link>
                            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-lg font-bold rounded-full backdrop-blur-md border border-white/20 transition-all">
                                Ver Catálogo
                            </button>
                        </div>
                    </div>
                </section>

                {/* Trending Section */}
                <section className="py-20 bg-dark-bg relative">
                    <div className="absolute -top-20 left-0 w-full h-32 bg-gradient-to-t from-dark-bg to-transparent z-10"></div>
                    <div className="container-custom">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                            <div>
                                <h3 className="text-primary font-bold tracking-[0.2em] text-lg md:text-xl uppercase mb-1">Lanzamientos Exclusivos</h3>
                                <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic leading-[0.9]">Tendencias</h2>
                            </div>
                            <Link href="/shop" className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                                Ver Todo <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                        <ProductSlider products={products.slice(0, 6)} />
                    </div>
                </section>

                {/* Categories / Community Favorites */}
                <section className="py-24 bg-dark-surface relative overflow-hidden">
                    <div className="container-custom relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                            {/* Large Featured Card 1 */}
                            <div className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer border border-white/5">
                                <Image src="https://res.cloudinary.com/dp7jr9k94/image/upload/v1766493611/Google_AI_Studio_2025-12-23T12_32_58.985Z_hnyk28.png" alt="Star Wars" fill className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                                <div className="absolute bottom-10 left-10">
                                    <span className="text-primary font-bold tracking-wider mb-2 block">STAR WARS</span>
                                    <h3 className="text-4xl font-black text-white italic uppercase mb-4">Imperio <br /> Galáctico</h3>
                                    <span className="text-white border-b-2 border-white pb-1 group-hover:border-primary transition-colors">Comprar Ahora</span>
                                </div>
                            </div>

                            {/* Large Featured Card 2 */}
                            <div className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer border border-white/5">
                                <Image src="https://res.cloudinary.com/dp7jr9k94/image/upload/v1766495580/Generated_Image_December_23_2025_-_10_11AM_u3pxvj.png" alt="Pokemon" fill className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                                <div className="absolute bottom-10 left-10">
                                    <span className="text-primary font-bold tracking-wider mb-2 block">POKÉMON</span>
                                    <h3 className="text-4xl font-black text-white italic uppercase mb-4">Atrápalos <br /> a Todos</h3>
                                    <span className="text-white border-b-2 border-white pb-1 group-hover:border-primary transition-colors">Comprar Ahora</span>
                                </div>
                            </div>
                        </div>

                        {/* Smaller Categories Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['Harry Potter', 'Marvel', 'DC Comics', 'Disney'].map((cat) => (
                                <Link href={`/shop?search=${cat}`} key={cat} className="group relative h-40 rounded-2xl overflow-hidden border border-white/5 bg-white/5 hover:bg-white/10 transition-all">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <h4 className="text-xl font-bold text-white uppercase group-hover:scale-110 transition-transform">{cat}</h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* "Which Pop Are You?" / Interactive Section */}
                <section className="py-32 bg-primary relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://res.cloudinary.com/dp7jr9k94/image/upload/v1765590925/isotype_jca7v6.svg')] bg-repeat space"></div>
                    <div className="container-custom relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="text-center md:text-left max-w-2xl">
                            <span className="bg-black/20 text-white px-4 py-2 rounded-full font-bold text-sm mb-6 inline-block">QUIZ DIVERTIDO</span>
                            <h2 className="text-5xl md:text-6xl font-black text-white uppercase italic mb-6">¿Qué Pop! <br /> Eres Tú?</h2>
                            <p className="text-white/90 text-xl font-medium mb-8">Responde 3 preguntas rápidas para descubrir tu Funko ideal y obtener un código de descuento personalizado.</p>
                            <button className="bg-white text-primary text-xl font-bold px-10 py-4 rounded-full shadow-2xl hover:bg-gray-100 transition-colors">
                                Comenzar Quiz
                            </button>
                        </div>

                        {/* Interactive Card Mockup */}
                        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-400 font-bold text-xs uppercase">Pregunta 1 de 3</span>
                                <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-primary font-bold">?</span>
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-6">¿Cuál es tu actividad ideal de fin de semana?</h4>
                            <div className="space-y-3">
                                <div className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-primary cursor-pointer transition-all flex items-center justify-between group">
                                    <span className="font-medium text-gray-700 group-hover:text-primary">Combatir el Crimen</span>
                                </div>
                                <div className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-primary cursor-pointer transition-all flex items-center justify-between group">
                                    <span className="font-medium text-gray-700 group-hover:text-primary">Lanzar Hechizos</span>
                                </div>
                                <div className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-primary cursor-pointer transition-all flex items-center justify-between group">
                                    <span className="font-medium text-gray-700 group-hover:text-primary">Viajar al Espacio</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Newsletter / Club */}
                <section className="py-24 bg-dark-bg">
                    <div className="container-custom">
                        <div className="bg-gradient-to-r from-gray-900 to-black border border-white/10 rounded-[3rem] p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[400px]">
                            <div className="relative z-20 max-w-xl">
                                <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase mb-4">Únete al <span className="text-primary">FunkoClub</span></h2>
                                <p className="text-gray-400 text-lg mb-8">Desbloquea 10% de descuento en tu primer pedido, además de acceso anticipado a lanzamientos de edición limitada y ventas exclusivas para miembros.</p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <input type="email" placeholder="Ingresa tu correo electrónico" className="bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary w-full md:w-80" />
                                    <button className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-4 rounded-full transition-colors whitespace-nowrap">
                                        Suscribirme
                                    </button>
                                </div>
                                <p className="text-gray-600 text-xs mt-4">Al registrarte aceptas nuestros Términos y Condiciones.</p>
                            </div>

                            {/* Blended Background Image */}
                            <div className="absolute right-0 bottom-0 top-0 w-full md:w-1/2 pointer-events-none z-10">
                                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-20"></div>
                                <Image
                                    src="https://res.cloudinary.com/dp7jr9k94/image/upload/v1766491660/Google_AI_Studio_2025-12-23T12_07_11.596Z_r0bnhw.png"
                                    alt="Club Mascot"
                                    fill
                                    className="object-cover object-center opacity-80 mix-blend-lighten"
                                />
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    )
}

