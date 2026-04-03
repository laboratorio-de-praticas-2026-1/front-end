import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogPostContent } from "@/components/sections/BlogPostContent";
import { blogService } from "@/services/blogService";
import type { BlogPost as BlogPostType } from "@/services/blogService";

export function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const carregarPost = async () => {
      if (!id) {
        setErro(true);
        setCarregando(false);
        return;
      }

      try {
        const dados = await blogService.buscarPorId(Number(id));
        if (dados) {
          setPost(dados);
        } else {
          setErro(true);
        }
      } catch (error) {
        console.error("Erro ao buscar post:", error);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    };

    carregarPost();
  }, [id]);

  if (carregando) {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-600">Carregando artigo...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (erro || !post) {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-zinc-700">Artigo não encontrado</h2>
            <p className="text-zinc-600">Desculpe, o artigo que você procura não existe.</p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-base font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:opacity-90"
            >
              Voltar ao início
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1">
        <BlogPostContent post={post} />
      </main>
      <Footer />
    </div>
  );
}
