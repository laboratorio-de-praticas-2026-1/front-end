import imgMobile from "../../../assets/header-contato-mobile.png"
import imgDesktop from "../../../assets/header-contato.jpg"

export default function ContactHeader() {
  return (
    <section className="relative w-full h-[85vh] flex justify-center overflow-hidden">
      
      {/* Imagem de fundo */}
      <div className="absolute inset-0 z-0">
        <img
          src={imgMobile}
          className="block md:hidden w-full h-full object-cover"
          alt="Imagem mobile"
        />

        {/* DESKTOP */}
        <img
          src={imgDesktop}
          className="hidden md:block w-full h-full object-cover"
          alt="Imagem desktop"
        />

      </div>

      {/* Texto */}
      <div className="relative z-10 text-center mt-40">
        <h1 className="text-2xl font-light uppercase tracking-wide text-white md:text-5xl">
          Entre em
        </h1>
        <h2 className="text-2xl font-bold uppercase tracking-wide text-white md:text-5xl">
          Contato!
        </h2>
      </div>
    </section>
  );
}