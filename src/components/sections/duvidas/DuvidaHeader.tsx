import imgMobile from "../../../assets/header-duvida-mobile.png"

import imgDesktop from "../../../assets/header-duvida.png"
import { Search } from "lucide-react";

interface SearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}


export default function DuvidaHeader({
    searchQuery,
    setSearchQuery,
}: SearchProps) {
    return (
    <section className="relative w-full min-h-[600px] flex justify-center overflow-hidden md:h-[770px]">
      
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
      <div className="relative z-10 text-center mt-30 flex flex-col gap-1 md:mt-45">
        <h1 className="text-2xl font-light uppercase tracking-wide text-white md:text-5xl">
          Ficou com Alguma
        </h1>
        <h2 className="text-2xl font-bold uppercase tracking-wide text-white md:text-5xl">
          Dúvida?
        </h2>
        <p className="text-white tracking-wide font-regular mt-6 md:text-xl">
            Encontre respostas rápidas ou fale com nosso time
        </p>

        <div className="relative w-70 max-w-md mx-auto flex justify-center items-center mt-4 md:w-90">
          <input
            type="text"
            placeholder="Pesquise sua dúvida"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Pesquisar dúvidas"
            className="w-full px-4 py-3 rounded-full outline-none text-black bg-white"
          />

          <span className="absolute right-4 top-3 text-secondary text-center">
            <Search size={20} />
          </span>
        </div>

      </div>
    </section>
  );
}
