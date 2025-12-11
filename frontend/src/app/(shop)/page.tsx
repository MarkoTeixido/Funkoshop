import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";

const fallbackProducts = [
    { id: "1", category: "STAR WARS", name: "STORMTROOPER LIGHTSABER", price: "$ 1799,99", imageFront: "/images/star-wars/trooper-1.webp", imageBack: "/images/star-wars/trooper-box.webp", tag: "NUEVO", installments: "3 CUOTAS SIN INTERÉS" },
    { id: "2", category: "POKEMON", name: "PIDGEOTTO", price: "$ 1799,99", imageFront: "/images/pokemon/pidgeotto-1.webp", imageBack: "/images/pokemon/pidgeotto-box.webp", tag: "NUEVO", installments: "3 CUOTAS SIN INTERÉS" },
    { id: "3", category: "HARRY POTTER", name: "LUNA LOVEGOOD LION MASK", price: "$ 1799,99", imageFront: "/images/harry-potter/luna-1.webp", imageBack: "/images/harry-potter/luna-box.webp", tag: "NUEVO", installments: "3 CUOTAS SIN INTERÉS" },
];

async function getProducts() {
    try {
        const res = await fetch('http://localhost:3000/home', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch');
        const collections = await res.json();
        return collections.map((item: any) => ({
            id: item.product_id,
            category: item.licence.licence_name,
            name: item.product_name,
            price: `$ ${item.price}`,
            imageFront: item.image_front,
            imageBack: item.image_back,
            tag: "NUEVO",
            installments: "3 CUOTAS SIN INTERÉS"
        }));
    } catch (error) {
        console.error("Using fallback:", error);
        return fallbackProducts;
    }
}

export default async function Home() {
    const products = await getProducts();
    return (
        <>
            {/* Hero */}
            <section className="relative w-full bg-[url('/images/funkos-banner.webp')] bg-cover bg-top bg-fixed bg-no-repeat py-[6.8rem] min-[1000px]:py-[12.8rem]
                before:content-[''] before:absolute before:inset-0 before:bg-black/50 before:backdrop-blur-[2px] z-0"
            >
                <div className="container relative z-10 px-[2.4rem] min-[1000px]:px-[12.8rem] flex flex-col gap-[2rem] items-center min-[1000px]:items-start text-center min-[1000px]:text-left">
                    <h3 className="font-raleway text-[3rem] min-[1000px]:text-[3.8rem] font-bold text-white uppercase leading-tight drop-shadow-md">
                        Nuevos<br />Ingresos
                    </h3>
                    <p className="font-raleway text-[1.8rem] min-[1000px]:text-[2rem] text-white max-w-[600px] drop-shadow-sm">
                        Descubrí el próximo Funko Pop de tu colección
                    </p>
                    <Link href="/shop" className="inline-block bg-white text-dark text-[1.8rem] font-medium px-[6.8rem] py-[1.2rem] rounded-[50px] hover:bg-primary-900 hover:text-white transition-all uppercase mt-[2rem]">
                        Shop
                    </Link>
                </div>
            </section>

            {/* Collections */}
            <section className="container py-[4rem] px-[2.4rem] min-[1000px]:px-[12.8rem] text-dark">
                {/* Collection 1 */}
                <article className="grid grid-cols-1 min-[1000px]:grid-cols-2 items-center gap-[2rem] mb-[4rem]">
                    <div className="flex flex-col gap-[2.4rem] items-center min-[1000px]:items-start text-center min-[1000px]:text-left order-2 min-[1000px]:order-1">
                        <h3 className="font-raleway text-[2.4rem] text-dark font-light border-b-[3px] border-primary pb-[2rem] uppercase w-full max-w-[400px]">
                            Star Wars & The Mandalorian
                        </h3>
                        <p className="text-[1.8rem]">
                            Disfruta de una saga que sigue agregando personajes a su colección.
                        </p>
                        <Link href="/shop" className="inline-block bg-dark-bg text-white text-[1.8rem] px-[3.6rem] py-[1.6rem] rounded-[50px] hover:bg-primary-900 transition-colors uppercase">
                            Ver Colección
                        </Link>
                    </div>
                    <div className="order-1 min-[1000px]:order-2 flex justify-center">
                        <Image src="/images/star-wars/baby-yoda-1.webp" alt="Baby Yoda" width={400} height={400} className="w-full max-w-[300px] min-[1000px]:max-w-[400px] object-contain hover:scale-105 transition-transform" />
                    </div>
                </article>

                {/* Collection 2 */}
                <article className="grid grid-cols-1 min-[1000px]:grid-cols-2 items-center gap-[2rem] mb-[4rem]">
                    <div className="flex justify-center order-1">
                        <Image src="/images/pokemon/vulpix-1.webp" alt="Vulpix" width={400} height={400} className="w-full max-w-[300px] min-[1000px]:max-w-[400px] object-contain hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex flex-col gap-[2.4rem] items-center min-[1000px]:items-start text-center min-[1000px]:text-left order-2">
                        <h3 className="font-raleway text-[2.4rem] text-dark font-light border-b-[3px] border-primary pb-[2rem] uppercase w-full max-w-[400px]">
                            Pokemon Indigo
                        </h3>
                        <p className="text-[1.8rem]">
                            Atrapa todos los que puedas y disfruta de una colección llena de amigos.
                        </p>
                        <Link href="/shop" className="inline-block bg-dark-bg text-white text-[1.8rem] px-[3.6rem] py-[1.6rem] rounded-[50px] hover:bg-primary-900 transition-colors uppercase">
                            Ver Colección
                        </Link>
                    </div>
                </article>

                {/* Collection 3 */}
                <article className="grid grid-cols-1 min-[1000px]:grid-cols-2 items-center gap-[2rem]">
                    <div className="flex flex-col gap-[2.4rem] items-center min-[1000px]:items-start text-center min-[1000px]:text-left order-2 min-[1000px]:order-1">
                        <h3 className="font-raleway text-[2.4rem] text-dark font-light border-b-[3px] border-primary pb-[2rem] uppercase w-full max-w-[400px]">
                            Harry Potter
                        </h3>
                        <p className="text-[1.8rem]">
                            Revive los recuerdos de una saga llena de magia y encanto.
                        </p>
                        <Link href="/shop" className="inline-block bg-dark-bg text-white text-[1.8rem] px-[3.6rem] py-[1.6rem] rounded-[50px] hover:bg-primary-900 transition-colors uppercase">
                            Ver Colección
                        </Link>
                    </div>
                    <div className="order-1 min-[1000px]:order-2 flex justify-center">
                        <Image src="/images/harry-potter/snape-patronus-1.webp" alt="Snape Patronus" width={400} height={400} className="w-full max-w-[300px] min-[1000px]:max-w-[400px] object-contain hover:scale-105 transition-transform" />
                    </div>
                </article>
            </section>

            {/* Latest Releases */}
            <section className="container py-[4rem] px-[2.4rem] min-[1000px]:px-[12.8rem] text-dark">
                <h2 className="text-[3.2rem] font-bold text-center uppercase mb-[4rem]">Últimos Lanzamientos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2.4rem]">
                    {products.map((p: any) => (
                        <ProductCard key={p.id} {...p} />
                    ))}
                </div>
            </section>
        </>
    )
}
