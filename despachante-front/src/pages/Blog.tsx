import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogHeader } from "@/components/sections/BlogHeader";
import { MostReadSection } from "@/components/sections/MostReadSection";
import { BlogGrid } from "@/components/sections/BlogGrid";
import { blogService } from "@/services/blogService";
import type { BlogPost } from "@/services/blogService";

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarPosts = async () => {
      try {
        const dados = await blogService.listarTodos();
        setPosts(dados);
        setFilteredPosts(dados);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarPosts();
  }, []);

  const handlePostClick = (id: number) => {
    navigate(`/blog/${id}`);
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredPosts(posts);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = posts.filter(
        (post) =>
          post.titulo.toLowerCase().includes(lowerQuery) ||
          post.conteudo.toLowerCase().includes(lowerQuery)
      );
      setFilteredPosts(filtered);
    }
  };

  const handleCategoryFilter = (category: string) => {
    if (!category) {
      setFilteredPosts(posts);
    } else {
      // Se houve implementação de categorias, filtrar aqui
      // Por enquanto, apenas retorna todos os posts
      setFilteredPosts(posts);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        {/* Header com busca */}
        <BlogHeader onSearch={handleSearch} onCategoryFilter={handleCategoryFilter} />

        {/* Loading state */}
        {carregando ? (
          <section className="w-full bg-white py-20">
            <div className="flex justify-center items-center min-h-[400px]">
              <p className="text-zinc-600">Carregando artigos...</p>
            </div>
          </section>
        ) : (
          <>
            {/* Seção de conteúdos mais lidos */}
            {filteredPosts.length > 0 && (
              <MostReadSection posts={filteredPosts} onPostClick={handlePostClick} />
            )}

            {/* Grid de posts */}
            {filteredPosts.length > 0 ? (
              <BlogGrid posts={filteredPosts} onPostClick={handlePostClick} />
            ) : (
              <section className="w-full bg-white py-20">
                <div className="text-center space-y-4">
                  <p className="text-zinc-600">Nenhum artigo encontrado com os filtros aplicados.</p>
                  <button
                    onClick={() => {
                      setFilteredPosts(posts);
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-base font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:opacity-90"
                  >
                    Limpar filtros
                  </button>
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
