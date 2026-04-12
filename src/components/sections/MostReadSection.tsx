import { type BlogPost} from "@/services/blogService";

interface MostReadSectionProps {
  posts: BlogPost[];
  onPostClick: (id: number) => void;
}

export function MostReadSection({ posts, onPostClick }: MostReadSectionProps) {
  if (posts.length === 0) return null;

  // Pega o primeiro post como destaque
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1, 4); // Próximos 3 posts

  return (
    <section className="w-full bg-zinc-50 py-12 md:py-16 lg:py-20 border-b border-zinc-200">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        {/* Título da seção */}
        <div className="flex items-center justify-center gap-4">
          <div className="h-1 w-12 bg-blue-600 rounded"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 whitespace-nowrap">
            Conteúdos mais lidos
          </h2>
          <div className="h-1 w-12 bg-blue-600 rounded"></div>
        </div>

        {/* Grid com featured post em destaque */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Post - Maior, lado esquerdo */}
          <div
            onClick={() => onPostClick(featuredPost.id)}
            className="relative overflow-hidden rounded-lg cursor-pointer group"
          >
            {/* Imagem com overlay */}
            <div className="relative h-80 md:h-96 overflow-hidden bg-zinc-300 rounded-lg">
              {featuredPost.imagem && (
                <img
                  src={featuredPost.imagem}
                  alt={featuredPost.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              {/* Overlay com conteúdo */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                  {featuredPost.titulo}
                </h3>
                <button className="self-start bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
                  ➜ PARA ARTIGO
                </button>
              </div>
            </div>
          </div>

          {/* Outros posts - lado direito */}
          <div className="flex flex-col gap-4">
            {otherPosts.map((post, index) => (
              <div
                key={post.id}
                onClick={() => onPostClick(post.id)}
                className="flex items-center gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer border border-zinc-200"
              >
                {/* Número */}
                <div className="text-3xl font-bold text-zinc-300 min-w-12">
                  {index + 2}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-zinc-900 line-clamp-2 text-sm md:text-base">
                    {post.titulo}
                  </h4>
                </div>

                {/* Ícone */}
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center ml-auto flex-shrink-0">
                  →
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
