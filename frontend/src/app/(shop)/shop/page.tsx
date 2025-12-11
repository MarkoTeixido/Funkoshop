import ProductCard from "@/components/ProductCard";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const products = [
    { id: "1", category: "STAR WARS", name: "STORMTROOPER LIGHTSABER", price: "$ 1799,99", imageFront: "/images/star-wars/trooper-1.webp", imageBack: "/images/star-wars/trooper-box.webp", tag: "NUEVO", installments: "3 CUOTAS SIN INTERÉS" },
    { id: "2", category: "POKEMON", name: "PIDGEOTTO", price: "$ 1799,99", imageFront: "/images/pokemon/pidgeotto-1.webp", imageBack: "/images/pokemon/pidgeotto-box.webp", tag: "NUEVO", installments: "3 CUOTAS SIN INTERÉS" },
    { id: "3", category: "HARRY POTTER", name: "LUNA LOVEGOOD LION MASK", price: "$ 1799,99", imageFront: "/images/harry-potter/luna-1.webp", imageBack: "/images/harry-potter/luna-box.webp", tag: "NUEVO", installments: "3 CUOTAS SIN INTERÉS" },
];

export default function Shop() {
    return (
        <div className="container px-[2.4rem] py-[4rem] flex flex-col md:flex-row gap-[4rem] text-dark">
            <aside className="w-full md:w-[250px] shrink-0 space-y-[4rem]">
                {/* Search */}
                <div className="space-y-[1.2rem]">
                    <label className="text-[1.8rem] font-medium block" htmlFor="search">BUSCAR</label>
                    <div className="relative">
                        <input
                            className="w-full border-2 border-primary rounded-[50px] px-[1.6rem] py-[0.8rem] text-[1.6rem] placeholder:text-gray-400 focus:outline-none"
                            type="text"
                            name="buscar"
                            placeholder="item o categoria"
                        />
                    </div>
                </div>

                {/* Order */}
                <div className="space-y-[1.2rem]">
                    <label className="text-[1.8rem] font-medium block" htmlFor="order">ORDENAR POR</label>
                    <select className="w-full border-2 border-primary rounded-[50px] px-[1.6rem] py-[0.8rem] text-[1.6rem] bg-white focus:outline-none cursor-pointer">
                        <option value="" disabled defaultValue="">Mayor a menor</option>
                        <option value="price-ascending">Mayor a menor</option>
                        <option value="price-descending">Menor a mayor</option>
                        <option value="alpha-ascending">A-Z</option>
                        <option value="alpha-descending">Z-A</option>
                    </select>
                </div>

                {/* Price */}
                <div className="space-y-[1.2rem]">
                    <label className="text-[1.8rem] font-medium block" htmlFor="price">PRECIO</label>
                    <div className="flex items-center gap-4 justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[1.4rem]">MIN</span>
                            <input className="w-[7rem] border border-gray-300 rounded px-2 py-1 text-[1.4rem]" type="number" placeholder="0" min="0" />
                        </div>
                        <span className="text-[1.4rem]">-</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[1.4rem]">MAX</span>
                            <input className="w-[7rem] border border-gray-300 rounded px-2 py-1 text-[1.4rem]" type="number" placeholder="0" min="0" />
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="space-y-[1.2rem]">
                    <label className="text-[1.8rem] font-medium block" htmlFor="filter">FILTRAR</label>
                    <div className="space-y-[0.8rem]">
                        <div className="flex items-center gap-[0.8rem]">
                            <input type="checkbox" className="w-[1.8rem] h-[1.8rem] accent-primary" />
                            <label className="text-[1.6rem]">NUEVOS</label>
                        </div>
                        <div className="flex items-center gap-[0.8rem]">
                            <input type="checkbox" className="w-[1.8rem] h-[1.8rem] accent-primary" />
                            <label className="text-[1.6rem]">OFERTAS</label>
                        </div>
                        <div className="flex items-center gap-[0.8rem]">
                            <input type="checkbox" className="w-[1.8rem] h-[1.8rem] accent-primary" />
                            <label className="text-[1.6rem]">EDICIÓN ESPECIAL</label>
                        </div>
                        <div className="flex items-center gap-[0.8rem]">
                            <input type="checkbox" className="w-[1.8rem] h-[1.8rem] accent-primary" />
                            <label className="text-[1.6rem]">FAVORITOS</label>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex-1">
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2.4rem] mb-[4rem]">
                    {products.map((p, i) => (
                        <ProductCard key={i} {...p} />
                    ))}
                    {products.map((p, i) => (
                        <ProductCard key={i + 3} {...p} />
                    ))}
                    {products.map((p, i) => (
                        <ProductCard key={i + 6} {...p} />
                    ))}
                </section>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-[0.8rem] py-[4rem] text-[1.6rem]">
                    <a href="#" className="p-2 hover:text-primary transition-colors"><FaAngleLeft size={20} /></a>
                    <a href="#" className="w-[3.2rem] h-[3.2rem] flex items-center justify-center border border-gray-300 rounded-[4px] hover:bg-primary-900 hover:text-white transition-colors font-medium text-primary">1</a>
                    <a href="#" className="w-[3.2rem] h-[3.2rem] flex items-center justify-center border border-gray-300 rounded-[4px] hover:bg-primary-900 hover:text-white transition-colors font-medium">2</a>
                    <span className="p-2">...</span>
                    <a href="#" className="w-[3.2rem] h-[3.2rem] flex items-center justify-center border border-gray-300 rounded-[4px] hover:bg-primary-900 hover:text-white transition-colors font-medium">9</a>
                    <a href="#" className="w-[3.2rem] h-[3.2rem] flex items-center justify-center border border-gray-300 rounded-[4px] hover:bg-primary-900 hover:text-white transition-colors font-medium">10</a>
                    <a href="#" className="p-2 hover:text-primary transition-colors"><FaAngleRight size={20} /></a>
                </div>
            </div>
        </div>
    );
}
