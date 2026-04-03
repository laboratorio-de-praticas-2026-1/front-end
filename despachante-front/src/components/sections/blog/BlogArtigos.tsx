import { ChevronRight } from "lucide-react";
import type { BlogPost } from "@/services/blogService";

interface BlogArtigosProps {
  posts: BlogPost[];
  onPostClick: (id: number) => void;
  onClearFilters: () => void;
}

export function BlogArtigos({ posts, onPostClick, onClearFilters }: BlogArtigosProps) {
  // Estado vazio: Se os filtros não retornarem nada
  if (posts.length === 0) {
    return (
      <section className="w-full bg-[#f4f9ff] py-20 px-6">
        <div className="max-w-md mx-auto text-center space-y-6 bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-zinc-100">
          <p className="text-zinc-600 text-lg">Nenhum artigo encontrado com os filtros aplicados.</p>
          <button
            onClick={onClearFilters}
            className="inline-flex items-center justify-center rounded-full bg-[#1E84CF] px-8 py-3 text-base font-semibold text-white transition-all duration-300 hover:scale-105 shadow-md cursor-pointer"
          >
            Limpar filtros
          </button>
        </div>
      </section>
    );
  }

  // Removemos apenas o 1º post (porque ele já está no destaque da seção anterior)
  const gridPosts = posts.slice(1);

  // Se só existia 1 post no banco de dados, não renderizamos esta grade inferior
  if (gridPosts.length === 0) return null;

  return (
    <section className="w-full bg-[#f4f9ff] py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. TÍTULO DA SEÇÃO */}
        <div className="flex items-center justify-center gap-3 md:gap-6 mb-12 md:mb-16">
          <div className="h-[2px] flex-1 max-w-[40px] md:max-w-[120px] bg-[#1E84CF]"></div> 
          <h2 className="text-center text-xl md:text-3xl font-medium text-zinc-800">
            Leia os artigos do <span className="font-bold text-[#1E84CF]">nosso Blog</span>
          </h2>
          <div className="h-[2px] flex-1 max-w-[40px] md:max-w-[120px] bg-[#1E84CF]"></div> 
        </div>

        {/* 2. GRID DE ARTIGOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {gridPosts.map((post) => (
            <div 
              key={post.id} 
              onClick={() => onPostClick(post.id)}
              className="group cursor-pointer bg-white rounded-[1.5rem] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col h-full border border-zinc-100"
            >
              {/* Imagem do Card */}
              <div className="w-full h-48 md:h-52 overflow-hidden bg-zinc-200">
                {post.imagem ? (
                  <img 
                    src={post.imagem} 
                    alt={post.titulo} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">Sem imagem</div>
                )}
              </div>

              {/* Conteúdo do Card */}
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <p className="text-xs font-medium text-zinc-400 mb-3">{post.dataPublicacao}</p>
                
                <h3 className="text-lg md:text-xl font-bold text-zinc-800 leading-snug mb-4 line-clamp-3 group-hover:text-[#1E84CF] transition-colors">
                  {post.titulo}
                </h3>
                
                {/* Rodapé do Card (Saiba Mais + Botão Azul) */}
                <div className="mt-auto flex items-center justify-end gap-4 pt-4">
                  <span className="text-[10px] md:text-xs font-bold text-zinc-500 tracking-widest uppercase">
                    Saiba Mais
                  </span>
                  {/* Botão arredondado com gradiente */}
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-[#77bbed] to-[#4c9de5] flex items-center justify-center text-white shadow-sm group-hover:shadow-md group-hover:brightness-110 transition-all">
                    <ChevronRight strokeWidth={2.5} className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}