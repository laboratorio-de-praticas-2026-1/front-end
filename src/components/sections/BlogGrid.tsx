import { type BlogPost } from "@/services/blogService";
import { useState } from "react";

interface BlogGridProps {
  posts: BlogPost[];
  onPostClick: (id: number) => void;
}

const POSTS_PER_PAGE = 9;

export function BlogGrid({ posts, onPostClick }: BlogGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular paginação
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const displayedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        {/* Título */}
        <div className="flex items-center justify-center gap-4">
          <div className="h-1 w-12 bg-blue-600 rounded"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 text-center">
            Leia os artigos do <span className="text-blue-600">nosso Blog</span>
          </h2>
          <div className="h-1 w-12 bg-blue-600 rounded"></div>
        </div>

        {/* Grid de posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayedPosts.map((post) => {
            const dataFormatada = new Date(post.dataPublicacao).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            return (
              <article
                key={post.id}
                onClick={() => onPostClick(post.id)}
                className="flex flex-col h-full bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                {/* Imagem - Maior e mais destaque */}
                {post.imagem && (
                  <div className="h-56 md:h-64 overflow-hidden bg-zinc-200 relative">
                    <img
                      src={post.imagem}
                      alt={post.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Conteúdo - Minimalista */}
                <div className="p-5 md:p-6 flex flex-col flex-1 justify-between space-y-4">
                  {/* Data */}
                  <time className="text-xs text-zinc-600 font-medium">
                    {dataFormatada}
                  </time>

                  {/* Título */}
                  <h3 className="text-base md:text-lg font-bold text-zinc-900 leading-snug line-clamp-3">
                    {post.titulo}
                  </h3>

                  {/* Botão SAIBA MAIS - Destaque */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onPostClick(post.id);
                    }}
                    className="self-start bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-full transition-all duration-300 flex items-center gap-2 group/btn"
                  >
                    SAIBA MAIS
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {/* Botão anterior */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ←
            </button>

            {/* Números das páginas */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded-lg font-medium transition-all ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Botão próximo */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
