import Link from "next/link";

export default function Login() {
    return (
        <div className="container py-[8rem] flex justify-center items-center">
            <form className="w-full max-w-[500px] flex flex-col gap-[2.4rem]">
                <h2 className="text-[3.8rem] font-bold text-center uppercase font-raleway mb-[2rem]">Ingresar a mi cuenta</h2>
                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium" htmlFor="email">Email</label>
                    <input className="border-b-2 border-primary py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" type="email" placeholder="johndoe@correo.com" />
                </div>
                <div className="flex flex-col gap-[1rem]">
                    <label className="text-[1.8rem] font-medium" htmlFor="password">Contraseña</label>
                    <input className="border-b-2 border-primary py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400" type="password" placeholder="•••••••••" />
                </div>
                <div className="flex items-center gap-[1rem]">
                    <button className="bg-dark-bg text-white px-[3.2rem] py-[1.2rem] text-[1.6rem] font-medium hover:bg-primary-900 transition-colors uppercase">Ingresar</button>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="remember" className="size-5 accent-primary" />
                        <label htmlFor="remember" className="text-[1.6rem]">Recordarme</label>
                    </div>
                </div>
                <Link href="#" className="text-[1.4rem] text-blue-500 hover:underline">Olvidé mi contraseña</Link>
            </form>
        </div>
    );
}
