import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Image as ImageIcon } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { blogService, type BlogPost } from "@/services/blogService";

export function Artigo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [bannerUrl] = useState<string | null>(null);

  useEffect(() => {
    const carregarPost = async () => {
      if (!id) return;
      try {
        const dados = await blogService.buscarPorId(Number(id));
        setPost(dados);
      } catch (error) {
        console.error(error);
      } finally {
        setCarregando(false);
      }
    };

    const carregarBanner = async () => {
      try {
      } catch (error) {
        console.error(error);
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

  const conteudo = post.conteudo || "";
  const meio = Math.floor(conteudo.length / 2);
  const espacoIndex = conteudo.indexOf(" ", meio);
  const pontoDeCorte = espacoIndex === -1 ? meio : espacoIndex;

  const coluna1 = conteudo.slice(0, pontoDeCorte);
  const coluna2 = conteudo.slice(pontoDeCorte).trimStart();

  let fraseDestaque = "";
  if (conteudo) {
    const frases = conteudo.split('. ');
    if (frases.length > 2) {
      fraseDestaque = `"${frases[Math.floor(frases.length / 2)].trim()}."`;
    } else {
      fraseDestaque = `"${conteudo.substring(0, 100).trim()}..."`;
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 w-full pb-24">
        <div className="w-full h-[350px] md:h-[500px] bg-zinc-200 rounded-b-[3rem] md:rounded-b-[5rem] overflow-hidden shrink-0">
          {post.imagem ? (
            <img
              src={post.imagem}
              alt={post.titulo}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={64} className="text-zinc-400 opacity-50" />
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-16">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-sm font-medium text-white rounded-full hover:bg-secondary shadow-sm transition-all mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform" />
            Voltar ao Blog
          </button>

          <header className="mb-12">
            <h1 className="text-3xl md:text-5xl font-black text-secondary leading-tight mb-6 tracking-tight">
              {post.titulo}
            </h1>
            <div className="flex items-center text-zinc-500 text-sm font-medium">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Publicado em {post.dataPublicacao}</span>
            </div>
          </header>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 text-zinc-600 leading-relaxed whitespace-pre-wrap font-medium text-justify">
            
            <div className="hidden lg:flex absolute top-[160px] left-1/2 -translate-x-1/2 w-[320px] h-[220px] items-center justify-center pointer-events-none z-10 bg-white">
              <p className="text-2xl font-bold text-[#0F2A44] text-center px-2 leading-snug">
                {fraseDestaque}
              </p>
            </div>

            <div className="relative z-0">
              <div className="hidden lg:block float-right w-[128px] h-[220px] mt-[160px]"></div>
              {coluna1}
            </div>

            <div className="lg:hidden w-full py-8 my-8 border-y-2 border-zinc-100 flex items-center justify-center">
              <p className="text-xl font-bold text-[#0F2A44] text-center px-4 leading-snug">
                {fraseDestaque}
              </p>
            </div>

            <div className="relative z-0">
              <aside className="w-[200px] md:w-[240px] float-right ml-6 mb-6 overflow-hidden shadow-lg border border-zinc-100 bg-white break-inside-avoid relative z-20">
                {bannerUrl ? (
                  <img
                    src={bannerUrl}
                    alt="Publicidade"
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="bg-[#5c2d91] p-6 text-white text-center aspect-[4/5] flex flex-col justify-center items-center">
                    <h3 className="font-black text-2xl mb-2 italic uppercase">Anuncie<br/>Aqui</h3>
                    <p className="text-xs opacity-80 leading-tight">Espaço para<br/>publicidade</p>
                  </div>
                )}
              </aside>
              <div className="hidden lg:block float-left w-[128px] h-[220px] mt-[160px]"></div>
              {coluna2}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}