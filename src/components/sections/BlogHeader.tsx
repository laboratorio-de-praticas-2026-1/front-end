import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import imgHeader from "@/assets/img-header.jpg";

interface BlogHeaderProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
}

export function BlogHeader({ onSearch, onCategoryFilter }: BlogHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryQuery, setCategoryQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategoryQuery(value);
    onCategoryFilter(value);
  };

  return (
    <section className="relative w-full min-h-[50vh] md:min-h-[45vh] bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 flex items-center rounded-b-3xl overflow-hidden pt-20">
      {/* Background overlay com imagem desfocada */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src={imgHeader}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16 space-y-8">
        {/* Título */}
        <div className="text-center space-y-2">
          <p className="text-blue-100 text-sm md:text-base font-medium uppercase tracking-wide">
            Novidades
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Últimas do Blog
          </h1>
        </div>

        {/* Barra de busca */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-2xl mx-auto w-full">
          {/* Campo de categoria */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Filtrar por categoria..."
              value={categoryQuery}
              onChange={handleCategoryChange}
              className="w-full px-4 md:px-6 py-3 md:py-3.5 rounded-full bg-white text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Campo de busca */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Qual assunto procura?"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 md:px-6 py-3 md:py-3.5 rounded-full bg-white text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pl-4"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700 transition-colors">
              <FiSearch size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
