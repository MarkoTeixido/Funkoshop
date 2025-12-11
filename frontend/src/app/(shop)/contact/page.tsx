export default function Contact() {
    return (
        <div className="container py-[8rem] flex justify-center text-dark">
            <div className="flex flex-col lg:flex-row gap-[4rem] lg:gap-[8rem] w-full max-w-[1000px]">
                {/* Left Side: Info */}
                <section className="flex-1 flex flex-col gap-[4rem]">
                    <div className="flex flex-col gap-[1rem]">
                        <div className="flex items-center gap-[1rem]">
                            {/* Phone Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 512 512" className="fill-current"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" /></svg>
                            <h3 className="text-[2rem] font-bold">TELÉFONO</h3>
                        </div>
                        <p className="text-[1.8rem]">+54 011 4736-6830</p>
                        <p className="text-[1.8rem]">+54 011 4906-6880</p>
                    </div>

                    <div className="flex flex-col gap-[1rem]">
                        <div className="flex items-center gap-[1rem]">
                            {/* Envelope Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 512 512" className="fill-current"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" /></svg>
                            <h3 className="text-[2rem] font-bold">CORREO</h3>
                        </div>
                        <p className="text-[1.8rem]">cacfunkoshop@gmail.com</p>
                        <p className="text-[1.8rem]">info.funkoshopcac@gmail.com</p>
                    </div>

                    <div className="flex flex-col gap-[1rem]">
                        <div className="flex items-center gap-[1rem]">
                            {/* Location Dot Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 384 512" className="fill-current"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" /></svg>
                            <h3 className="text-[2rem] font-bold">UBICACIÓN</h3>
                        </div>
                        <p className="text-[1.8rem]">Recoleta, C1334</p>
                        <p className="text-[1.8rem]">CABA</p>
                    </div>
                </section>

                {/* Right Side: Form */}
                <section className="flex-1">
                    <h1 className="text-[3.8rem] font-bold uppercase font-raleway mb-[2rem]">CONTÁCTANOS</h1>
                    <form className="flex flex-col gap-[2rem]">
                        <input className="border-b-2 border-primary py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400 w-full" type="text" placeholder="Nombre Completo" />
                        <input className="border-b-2 border-primary py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400 w-full" type="email" placeholder="Email" />
                        <input className="border-b-2 border-primary py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400 w-full" type="text" placeholder="Asunto" />
                        <textarea className="border-b-2 border-primary py-[0.8rem] text-[1.6rem] outline-none placeholder:text-gray-400 w-full resize-none" rows={10} placeholder="Escriba Su Mensaje..."></textarea>
                        <button className="bg-dark-bg text-white px-[3.2rem] py-[1.2rem] text-[1.6rem] font-medium hover:bg-primary-900 transition-colors uppercase self-start">Enviar</button>
                    </form>
                </section>
            </div>
        </div>
    );
}
