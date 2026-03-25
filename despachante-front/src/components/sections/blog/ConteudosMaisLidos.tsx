import type { BlogPost } from "@/services/blogService";

interface ConteudosMaisLidosProps {
  posts: BlogPost[];
  onPostClick: (id: number) => void;
}

export function ConteudosMaisLidos({ posts, onPostClick }: ConteudosMaisLidosProps) {
  if (posts.length === 0) return null;

  // Pegamos apenas o primeiro post para o destaque principal
  const postDestaque = posts[0]; 

  return (
    <section className="w-full bg-[#f4f9ff] pt-12 md:pt-16 pb-0 overflow-hidden">
      
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 md:gap-6 px-4 md:px-6 mb-10 md:mb-12">
        <div className="h-[2px] flex-1 max-w-[40px] md:max-w-[160px] bg-[#1E84CF]"></div> 
        <h2 className="text-center text-xl md:text-3xl font-medium text-zinc-800">
          Conteúdos <span className="font-bold text-[#1E84CF]">mais lidos</span>
        </h2>
        <div className="h-[2px] flex-1 max-w-[40px] md:max-w-[160px] bg-[#1E84CF]"></div> 
      </div>

      <div className="relative w-full h-[550px] md:h-[650px] lg:h-[700px] flex items-center">
        
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-[85%] lg:w-[70%] xl:w-[65%] rounded-tl-[3rem] md:rounded-tl-[5rem] overflow-hidden bg-[#f4f9ff]">
          
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat shadow-2xl"
            style={{ backgroundImage: `url(${postDestaque.imagem})` }}
          />
          
          <div className="absolute inset-x-0 bottom-0 h-32 md:h-48 bg-gradient-to-t from-[#f4f9ff] to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 flex justify-center md:justify-start">
          <div 
            onClick={() => onPostClick(postDestaque.id)}
            className="w-full max-w-sm md:max-w-md lg:max-w-lg bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-2 overflow-hidden mt-12 md:mt-0"
          >
            <div className="p-6 md:p-10 lg:p-12 space-y-4 md:space-y-6 flex-grow">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-secondary uppercase leading-snug line-clamp-3">
                {postDestaque.titulo}
              </h3>
              
              <p className="text-zinc-600 text-sm md:text-base font-medium leading-relaxed line-clamp-3">
                {postDestaque.conteudo}
              </p>
            </div>
            
            <button className="w-full bg-gradient-to-b from-secondary to-[#07182c] text-white py-4 lg:py-5 text-xs lg:text-sm font-bold tracking-wider uppercase transition-all hover:brightness-125">
              Ir para artigo
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}