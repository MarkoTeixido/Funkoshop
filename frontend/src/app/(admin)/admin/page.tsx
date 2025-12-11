import Link from "next/link";
import Image from "next/image";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";

export default function AdminPage() {
    return (
        <div className="container px-[2.4rem] py-[4rem] text-dark">
            {/* Search */}
            <div className="flex items-center gap-4 mb-[4rem] max-w-[600px]">
                <FaMagnifyingGlass size={24} />
                <input
                    className="w-full border-2 border-primary rounded-[50px] px-[1.6rem] py-[0.8rem] text-[1.6rem] placeholder:text-gray-400 focus:outline-none"
                    type="text"
                    placeholder="código, nombre o categoria"
                />
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-[2rem] gap-4">
                <h1 className="text-[3.2rem] font-bold uppercase text-dark">LISTADO DE PRODUCTOS</h1>
                <div className="flex items-center gap-4">
                    <span className="text-[1.8rem] font-bold text-primary uppercase">AGREGAR</span>
                    <Link href="/create" className="bg-primary text-white p-3 rounded-[10px] hover:bg-primary-900 transition-colors">
                        <FaPlus size={24} />
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-[1.6rem] min-w-[600px]">
                    <thead>
                        <tr>
                            <th className="py-4 font-bold uppercase text-dark w-[5%]">ID</th>
                            <th className="py-4 font-bold uppercase text-dark w-[15%]">Código</th>
                            <th className="py-4 font-bold uppercase text-dark w-[40%]">Nombre del Producto</th>
                            <th className="py-4 font-bold uppercase text-dark w-[25%]">Categoria</th>
                            <th className="py-4 w-[15%]"></th>
                        </tr>
                    </thead>
                    <tbody className="font-medium text-[1.4rem]">
                        <tr className="border-t border-gray-300">
                            <td className="py-4">1</td>
                            <td className="py-4">STW001001</td>
                            <td className="py-4">Baby Yoda Blueball</td>
                            <td className="py-4">STAR WARS</td>
                            <td className="py-4 flex gap-4">
                                <Link href="/edit" className="hover:opacity-80"><Image src="/images/icons/edit_pencil.svg" alt="Edit" width={24} height={24} /></Link>
                                <button className="hover:opacity-80"><Image src="/images/icons/delete_trash.svg" alt="Delete" width={24} height={24} /></button>
                            </td>
                        </tr>
                        <tr className="border-t border-gray-300">
                            <td className="py-4">2</td>
                            <td className="py-4">STW001002</td>
                            <td className="py-4">Boba Fett Fighter</td>
                            <td className="py-4">STAR WARS</td>
                            <td className="py-4 flex gap-4">
                                <Link href="/edit" className="hover:opacity-80"><Image src="/images/icons/edit_pencil.svg" alt="Edit" width={24} height={24} /></Link>
                                <button className="hover:opacity-80"><Image src="/images/icons/delete_trash.svg" alt="Delete" width={24} height={24} /></button>
                            </td>
                        </tr>
                        <tr className="border-t border-gray-300">
                            <td className="py-4">3</td>
                            <td className="py-4">PKM001001</td>
                            <td className="py-4">Charmander Smiley</td>
                            <td className="py-4">POKEMON</td>
                            <td className="py-4 flex gap-4">
                                <Link href="/edit" className="hover:opacity-80"><Image src="/images/icons/edit_pencil.svg" alt="Edit" width={24} height={24} /></Link>
                                <button className="hover:opacity-80"><Image src="/images/icons/delete_trash.svg" alt="Delete" width={24} height={24} /></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
