import { Search, Filter } from "lucide-react";
import headerBlog from "@/assets/header-blog.jpg";

interface BlogHeaderProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
}

export function BlogHeader({ onSearch, onCategoryFilter }: BlogHeaderProps) {
  return (
    <section className="relative w-full min-h-[500px] md:min-h-[60vh] flex items-center justify-center rounded-b-[2.5rem] md:rounded-b-[4rem] overflow-hidden px-6 pt-24 pb-16 shadow-lg">
      
      {/* 1. IMAGEM DE FUNDO */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${headerBlog})` }}
      />
      
      {/* 2. OVERLAY (FILTRO AZUL ESCURO) */}
      <div className="absolute inset-0 z-0 bg-[#0a2647]/80 mix-blend-multiply" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a51c4]/50 to-[#0a2647]/90" />

      {/* 3. CONTEÚDO (Textos e Inputs) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center mt-12">
        <h1 className="text-2xl md:text-4xl font-light text-white mb-2 tracking-wide uppercase">
          Novidades
        </h1>
        <h2 className="text-4xl md:text-6xl font-black text-white mb-12 drop-shadow-md uppercase tracking-tight">
          Últimas do Blog
        </h2>

        {/* Formulário de Busca e Filtro */}
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-3xl">
          
          {/* Select de Categoria */}
          <div className="relative w-full md:w-2/5">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-primary h-5 w-5" />
            <select 
              onChange={(e) => onCategoryFilter(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-full bg-white text-zinc-700 outline-none focus:ring-2 focus:ring-primary shadow-lg cursor-pointer appearance-none font-medium text-sm md:text-base transition-shadow"
            >
              <option value="">Filtrar por categorias:</option>
              <option value="veiculos">Veículos</option>
              <option value="dicas">Dicas</option>
            </select>
          </div>

          {/* Input de Busca */}
          <div className="relative w-full md:w-3/5">
            <input 
              type="text"
              placeholder="O que você procura?"
              onChange={(e) => onSearch(e.target.value)}
              className="w-full h-14 pl-6 pr-14 rounded-full bg-white text-zinc-700 outline-none focus:ring-2 focus:ring-primary shadow-lg font-medium text-sm md:text-base transition-shadow"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 hover:bg-zinc-100 rounded-full flex items-center justify-center transition-colors cursor-pointer">
              <Search className="text-primary h-5 w-5 font-bold" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}