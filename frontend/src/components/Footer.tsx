import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-dark-bg py-[3.6rem] px-[2.4rem] md:px-[6.8rem] lg:px-[12.8rem] text-light-font">
            <nav className="container max-w-[1150px] mx-auto flex flex-col md:flex-row justify-between items-center">
                <ul className="flex flex-col md:flex-row items-center gap-[2rem] md:gap-[1rem]">
                    <li className="font-medium text-[2rem] md:text-[1.8rem]">
                        <Link href="/shop" className="px-[1.6rem] py-[0.8rem] hover:bg-primary-900 transition-colors inline-block text-white">SHOP</Link>
                    </li>
                    <li className="font-medium text-[2rem] md:text-[1.8rem]">
                        <Link href="/login" className="px-[1.6rem] py-[0.8rem] hover:bg-primary-900 transition-colors inline-block text-white">INGRESAR</Link>
                    </li>
                    <li className="font-medium text-[2rem] md:text-[1.8rem]">
                        <Link href="/contact" className="px-[1.6rem] py-[0.8rem] hover:bg-primary-900 transition-colors inline-block text-white">CONTACTO</Link>
                    </li>
                </ul>
                <picture className="p-[0.8rem] md:p-[2rem] max-w-[120px] md:max-w-none">
                    <Image
                        src="/images/branding/isotype.svg"
                        alt="Isotipo de Funkoshop"
                        width={80}
                        height={80}
                        className="w-full h-auto"
                    />
                </picture>
            </nav>
            <p className="text-center text-[1.8rem] pt-[3.6rem] font-medium">
                All rights reserved 2023 - Funkoshop &copy;
            </p>
        </footer>
    );
}
