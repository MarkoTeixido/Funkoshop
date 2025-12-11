export default function Create() {
    return (
        <div className="container py-[4rem] text-dark px-[2.4rem] min-[1000px]:px-[12rem]">
            <h1 className="text-[3.2rem] font-bold uppercase mb-[4rem]">CREAR NUEVO ITEM</h1>

            <form className="max-w-[1000px] flex flex-col gap-[4rem]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[4rem]">
                    {/* Category */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="category">Categoria:</label>
                        <select id="category" name="categoria" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] bg-white outline-none cursor-pointer">
                            <option disabled defaultValue="selected">Seleccionar</option>
                            <option value="starWars">Star Wars</option>
                            <option value="pokemon">Pokemon</option>
                            <option value="harryPotter">Harry Potter</option>
                        </select>
                    </div>
                    {/* License */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="license">Licencia:</label>
                        <select id="license" name="licencia" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] bg-white outline-none cursor-pointer">
                            <option disabled defaultValue="selected">Seleccionar</option>
                            <option value="licenNarutoShippuden">Naruto Shippuden</option>
                            <option value="licenPokemon">Pokemon</option>
                        </select>
                    </div>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium" htmlFor="nameProduct">Nombre del producto:</label>
                    <input type="text" name="nombreProducto" id="nameProduct" placeholder="Kakashi Hatake Shippuden Saga" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-[1rem]">
                    <textarea name="descriProduct" id="descriptionProduct" placeholder="Descripcion del producto" rows={10} className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400 resize-none"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-[4rem]">
                    {/* SKU */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="sku">SKU:</label>
                        <input id="sku" name="sku" type="text" placeholder="SSK111AB001" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                    </div>
                    {/* Price */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="price">Precio:</label>
                        <input id="price" name="precio" type="number" placeholder="$0.000,00" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                    </div>
                    {/* Stock */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="stock">Stock:</label>
                        <input id="stock" name="stock" type="number" placeholder="0" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[4rem]">
                    {/* Discount */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="discount">Descuento:</label>
                        <input id="discount" name="descuento" type="number" placeholder="0%" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                    </div>
                    {/* Installments */}
                    <div className="flex flex-col gap-[1rem]">
                        <label className="text-[1.8rem] font-medium" htmlFor="cuotas">Cuotas:</label>
                        <select id="cuotas" name="cuotas" className="border border-dark rounded-[10px] px-[1.6rem] py-[0.8rem] text-[1.6rem] bg-white outline-none cursor-pointer">
                            <option defaultValue="selected">3 Cuotas sin interes</option>
                            <option value="seisCuotas">6 Cuotas sin interes</option>
                            <option value="doceCuotas">12 Cuotas sin interes</option>
                            <option value="dieciOchoCuotas">18 Cuotas sin interes</option>
                            <option value="veintiCuatroCuotas">24 Cuotas sin interes</option>
                        </select>
                    </div>
                </div>

                {/* Images */}
                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium" htmlFor="image">Imágenes:</label>
                    <input type="file" name="image" id="image" accept="image/*" multiple className="text-[1.6rem]" />
                </div>

                <div className="flex gap-[2rem] mt-[2rem]">
                    <button type="submit" className="bg-primary text-white px-[3.2rem] py-[1.2rem] text-[1.6rem] font-medium hover:bg-primary-900 transition-colors">Agregar Producto</button>
                    <button type="reset" className="bg-dark-bg text-white px-[3.2rem] py-[1.2rem] text-[1.6rem] font-medium hover:bg-primary-900 transition-colors">Limpiar</button>
                </div>
            </form>
        </div>
    );
}
