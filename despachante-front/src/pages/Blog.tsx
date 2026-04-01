import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// NOSSOS NOVOS IMPORTS DA PASTA CORRETA
import { BlogHeader } from "@/components/sections/blog/BlogHeader";
import { ConteudosMaisLidos } from "@/components/sections/blog/ConteudosMaisLidos";
import { BlogArtigos } from "@/components/sections/blog/BlogArtigos";

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

  const handleCategoryFilter = (_category: string) => {
    // Lógica futura de categoria
    setFilteredPosts(posts); 
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full">
        <BlogHeader onSearch={handleSearch} onCategoryFilter={handleCategoryFilter} />

        {carregando ? (
          <section className="w-full bg-white py-20">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-8 bg-primary rounded-full mb-4"></div>
                <p className="text-zinc-500 font-medium">Buscando as novidades do blog...</p>
              </div>
            </div>
          </section>
        ) : (
          <>
            <ConteudosMaisLidos posts={filteredPosts} onPostClick={handlePostClick} />
            <BlogArtigos 
              posts={filteredPosts} 
              onPostClick={handlePostClick} 
              onClearFilters={() => setFilteredPosts(posts)} 
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}