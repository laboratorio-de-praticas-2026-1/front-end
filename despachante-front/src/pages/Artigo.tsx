import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Image as ImageIcon } from "lucide-react"; // 1. ADICIONAMOS ImageIcon

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { blogService, type BlogPost } from "@/services/blogService";

// MOCK DO BANNER PUBLICITÁRIO (já puxando o dinâmico)
export function Artigo() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    const carregarPost = async () => {
      if (!id) return;
      try {
        const dados = await blogService.buscarPorId(Number(id));
        setPost(dados);
      } catch (error) {
        console.error("Erro ao carregar o artigo:", error);
      } finally {
        setCarregando(false);
      }
    };

    const carregarBanner = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "https://despachante-bortone-release-production.up.railway.app";
        // const resposta = await fetch(`${API_URL}/sua-rota-de-banners`);
        // if (resposta.ok) {
        //   const dadosBanner = await resposta.json();
        //   setBannerUrl(dadosBanner.imagem); 
        // }
      } catch (error) {
        console.error("Erro ao buscar publicidade:", error);
      }
    };

    carregarPost();
    carregarBanner(); 
  }, [id]);

  if (carregando) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-10 bg-[#1E84CF] rounded-full mb-4"></div>
            <p className="text-zinc-500 font-medium">Carregando artigo...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-20">
          <h1 className="text-3xl font-bold text-secondary mb-4">Artigo não encontrado</h1>
          <p className="text-zinc-600 mb-8">Desculpe, não conseguimos encontrar a postagem que você está procurando.</p>
          <button 
            onClick={() => navigate('/blog')}
            className="bg-[#1E84CF] text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
          >
            Voltar para o Blog
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full pb-24 relative">
        
        {/* HEADER INCLINADO (Background Azul) */}
        <div 
          className="absolute top-0 left-0 w-full h-[400px] md:h-[500px] bg-gradient-to-r from-[#1a51c4] to-[#0a2647] z-0"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 100%)" }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 md:pt-40 flex flex-col items-center">
          
          <div className="w-full flex justify-start mb-6">
            <button 
              onClick={() => navigate('/blog')}
              className="inline-flex items-center text-sm font-semibold text-white/80 hover:text-white transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Voltar ao Blog
            </button>
          </div>

          {/* 2. NOVO: Container da Imagem do Artigo Fixo (O container div sempre renderiza) */}
          <div className="w-full max-w-4xl h-64 md:h-[450px] bg-zinc-200 rounded-3xl shadow-2xl overflow-hidden border-4 border-white mb-16">
            
            {/* LÓGICA INTERNA: Verificamos se há imagem só aqui dentro */}
            {post.imagem ? (
              // Se o back-end devolveu a imagem, nós mostramos ela
              <img 
                src={post.imagem} 
                alt={post.titulo} 
                className="w-full h-full object-cover"
              />
            ) : (
              // Se não houver imagem, mostra o placeholder minimalista para não quebrar o layout
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 text-center gap-4 p-8">
                  <ImageIcon size={48} className="stroke-[1.5]" /> {/* Ícone de imagem */}
                  <p className="text-zinc-500 font-medium text-sm md:text-base">
                      Esta postagem não possui uma imagem de destaque.
                  </p>
              </div>
            )}
            
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Lado Esquerdo: Texto do Artigo */}
            <article className="lg:col-span-8 flex flex-col">
              <header className="mb-8">
                <h1 className="text-3xl md:text-[2.5rem] font-black text-secondary leading-tight mb-6 tracking-tight">
                  {post.titulo}
                </h1>
                <div className="flex items-center text-zinc-400 text-sm font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Publicado em {post.dataPublicacao}</span>
                </div>
              </header>

              <div className="prose prose-lg max-w-none text-zinc-600 leading-relaxed whitespace-pre-wrap font-medium">
                {post.conteudo}
              </div>
            </article>

            {/* Lado Direito: Sidebar / Banner Publicitário */}
            <aside className="lg:col-span-4 mt-8 lg:mt-32">
              <div className="sticky top-32 w-full rounded-[2rem] overflow-hidden shadow-xl border border-zinc-100 bg-white">
                
                {/* LÓGICA DO BANNER DINÂMICO */}
                {bannerUrl ? (
                  <img 
                    src={bannerUrl} 
                    alt="Publicidade" 
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="bg-[#5c2d91] p-8 text-white text-center aspect-[4/5] flex flex-col justify-center items-center">
                    <h3 className="font-black text-3xl mb-4 italic uppercase">Anuncie<br/>Aqui</h3>
                    <p className="text-sm opacity-80">Espaço para publicidade</p>
                  </div>
                )}

              </div>
            </aside>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}