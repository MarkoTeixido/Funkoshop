import Link from "next/link";

export default function Register() {
    return (
        <div className="container py-[8rem] flex justify-center items-center">
            <section className="w-full max-w-[600px] flex flex-col gap-[2.4rem]">
                <div className="text-center space-y-2">
                    <h2 className="text-[3.8rem] font-bold uppercase font-raleway text-dark">CREA TU CUENTA</h2>
                    <p className="text-[1.8rem]">Completa el formulario para ser parte del mundo de los Funkos</p>
                </div>

                <form className="flex flex-col gap-[2rem]">
                    <div className="grid grid-cols-[1fr_2fr] gap-[2rem] items-center">
                        <div className="flex flex-col gap-[2rem] text-right">
                            <label className="text-[1.8rem] font-medium" htmlFor="name">Nombre:</label>
                            <label className="text-[1.8rem] font-medium" htmlFor="lastName">Apellido:</label>
                            <label className="text-[1.8rem] font-medium" htmlFor="email">Email:</label>
                            <label className="text-[1.8rem] font-medium" htmlFor="password">Contraseña:</label>
                            <label className="text-[1.8rem] font-medium" htmlFor="repPassword">Repita Contraseña:</label>
                        </div>
                        <div className="flex flex-col gap-[2rem]">
                            <input name="nombre" id="name" type="text" placeholder="John" className="border-b-2 border-primary py-[0.4rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                            <input name="apellido" id="lastName" type="text" placeholder="Doe" className="border-b-2 border-primary py-[0.4rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                            <input name="email" id="email" type="email" placeholder="johndoe@correo.com" className="border-b-2 border-primary py-[0.4rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                            <input name="contrasenia" id="password" type="password" placeholder="●●●●●●●●●●" className="border-b-2 border-primary py-[0.4rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                            <input name="repContrasenia" id="repPassword" type="password" placeholder="●●●●●●●●●●" className="border-b-2 border-primary py-[0.4rem] text-[1.6rem] outline-none placeholder:text-gray-400" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-[2rem] mt-[2rem]">
                        <button type="submit" className="bg-dark-bg text-white px-[3.2rem] py-[1.2rem] text-[1.6rem] font-medium hover:bg-primary-900 transition-colors uppercase">Registrar</button>
                        <div className="flex items-center gap-2">
                            <input id="termAndCondi" name="termAndCondi" type="checkbox" className="size-5 accent-primary" />
                            <label htmlFor="termAndCondi" className="text-[1.6rem]">Acepta <a href="#" className="text-secondary hover:underline">Terminos y Condiciones</a></label>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
}
