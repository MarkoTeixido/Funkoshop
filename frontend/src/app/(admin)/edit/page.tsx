import Image from "next/image";

export default function Edit() {
    return (
        <div className="container py-[4rem] text-dark px-[2.4rem] min-[1000px]:px-[12rem]">
            <h1 className="text-[3.2rem] font-bold uppercase mb-[4rem]">EDITAR ITEM</h1>

            <form className="max-w-[1000px] flex flex-col gap-[4rem]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[4rem]">
                    {/* Category */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="categoria">Categoría:</label>
                        <select id="categoria" name="categoria" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] bg-white outline-none cursor-pointer">
                            <option value="figuras-naruto">Naruto</option>
                            <option value="figuras-pokemon">Pokemon</option>
                        </select>
                    </div>
                    {/* License */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="licencia">Licencia:</label>
                        <select id="licencia" name="licencia" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] bg-white outline-none cursor-pointer">
                            <option value="licencia-naruto">Naruto Shippuden</option>
                            <option value="licencia-pokemon">Pokemon</option>
                        </select>
                    </div>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium" htmlFor="nombre-producto">Nombre del producto:</label>
                    <input type="text" id="nombre-producto" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-[1rem]">
                    <textarea name="texto" rows={6} placeholder="Descripción del producto" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400 resize-none"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-[4rem]">
                    {/* SKU */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="sku">SKU:</label>
                        <input id="sku" type="text" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                    </div>
                    {/* Price */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="precio">Precio:</label>
                        <input id="precio" type="text" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                    </div>
                    {/* Stock */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="stock">Stock:</label>
                        <input id="stock" type="text" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[4rem]">
                    {/* Discount */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="descuento">Descuento:</label>
                        <input id="descuento" type="text" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                    </div>
                    {/* Installments */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="cuotas">Cuotas:</label>
                        <select id="cuotas" name="cuotas" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] bg-white outline-none cursor-pointer">
                            <option value="numero-cuotas">3 Cuotas sin interés</option>
                            <option value="numero-cuotas">6 Cuotas sin interés</option>
                            <option value="numero-cuotas">12 Cuotas sin interés</option>
                        </select>
                    </div>
                </div>

                {/* Images */}
                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium" htmlFor="imagenes">Imágenes:</label>
                    <input type="file" id="imagenes" className="text-[1.6rem]" />
                </div>

                {/* Current Images */}
                <div className="flex gap-[4rem]">
                    <div className="flex flex-col gap-[1rem] items-center">
                        <Image src="/images/star-wars/baby-yoda-1.webp" alt="Frente" width={150} height={150} className="object-contain" />
                        <p className="text-[1.6rem] font-medium text-secondary">Frente</p>
                        <input type="button" value="Modificar Producto" className="bg-primary text-white px-[2.4rem] py-[0.8rem] text-[1.4rem] font-medium hover:bg-primary-900 transition-colors cursor-pointer" />
                    </div>
                    <div className="flex flex-col gap-[1rem] items-center">
                        <Image src="/images/star-wars/baby-yoda-box.webp" alt="Dorso" width={150} height={150} className="object-contain" />
                        <p className="text-[1.6rem] font-medium text-secondary">Dorso</p>
                    </div>
                </div>
            </form>
        </div>
    );
}
