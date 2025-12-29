import Link from "next/link";
import ProductSlider from "@/components/shop/ProductSlider";
import { ProductCardProps } from "@/components/shop/ProductCard";

interface TrendingSectionProps {
    products: ProductCardProps[];
}

export default function TrendingSection({ products }: TrendingSectionProps) {
    return (
        <section className="py-20 bg-dark-bg relative">
            <div className="absolute -top-20 left-0 w-full h-32 bg-gradient-to-t from-dark-bg to-transparent z-10"></div>
            <div className="container-custom">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                    <div>
                        <p className="text-primary font-bold tracking-[0.2em] text-lg md:text-xl uppercase mb-1">Lanzamientos Exclusivos</p>
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic leading-[0.9]">Tendencias</h2>
                    </div>
                    <Link href="/shop" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                        Ver Todo <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
                <ProductSlider products={products.slice(0, 6)} />
            </div>
        </section>
    );
}
