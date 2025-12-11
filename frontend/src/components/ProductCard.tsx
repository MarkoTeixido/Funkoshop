import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
    id: string; // or number
    category: string;
    name: string;
    price: string;
    imageFront: string;
    imageBack: string;
    tag?: string;
    installments?: string;
}

export default function ProductCard({ id, category, name, price, imageFront, imageBack, tag, installments }: ProductCardProps) {
    return (
        <article className="w-full">
            <Link href={`/shop/${id}`}>
                <figure className="relative group overflow-hidden">
                    {tag && (
                        <span className="absolute right-0 top-0 bg-primary text-white text-[1.4rem] font-medium uppercase px-[1.2rem] py-[0.8rem] z-10">
                            {tag}
                        </span>
                    )}
                    {/* Front Image */}
                    <div className="block group-hover:hidden animate-fade">
                        <Image
                            src={imageFront}
                            alt={name}
                            width={400}
                            height={400}
                            className="w-full h-auto object-cover aspect-square"
                            priority
                        />
                    </div>
                    {/* Back Image (Box) */}
                    <div className="hidden group-hover:block animate-fade">
                        <Image
                            src={imageBack}
                            alt={`${name} Box`}
                            width={400}
                            height={400}
                            className="w-full h-auto object-cover aspect-square"
                        />
                    </div>
                </figure>
                <div className="p-[1.6rem] flex flex-col gap-[1.2rem]">
                    <p className="text-[1.4rem] font-medium uppercase text-gray-500">{category}</p>
                    <h4 className="text-[1.8rem] font-bold uppercase leading-tight">{name}</h4>
                    <p className="text-[1.6rem]">{price}</p>
                    {installments && (
                        <p className="text-[1.4rem] font-bold text-secondary uppercase whitespace-nowrap">{installments}</p>
                    )}
                </div>
            </Link>
        </article>
    )
}
