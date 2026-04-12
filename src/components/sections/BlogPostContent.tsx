import { type BlogPost } from "@/services/blogService";

interface BlogPostContentProps {
  post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  // Formatar a data
  const dataFormatada = new Date(post.dataPublicacao).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      {/* Header do artigo com imagem */}
      <div className="relative w-full">
        {/* Imagem do artigo */}
        <div className="h-64 md:h-80 lg:h-96 overflow-hidden bg-zinc-200">
          {post.imagem && (
            <img
              src={post.imagem}
              alt={post.titulo}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Conteúdo principal - Grid 2 colunas */}
        <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8 py-8 md:py-12">
          {/* Coluna esquerda - Artigo (2/3 em desktop) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Título e metadata */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 leading-tight">
                {post.titulo}
              </h1>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <span>📅</span>
                <time>{dataFormatada}</time>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-zinc-200 w-12"></div>

            {/* Conteúdo do artigo */}
            <article className="prose prose-zinc max-w-none">
              <div className="text-zinc-700 leading-relaxed space-y-6">
                {/* Renderizar o conteúdo - suporta markdown ou HTML básico */}
                <div
                  className="whitespace-pre-wrap text-lg"
                  dangerouslySetInnerHTML={{ __html: post.conteudo }}
                />
              </div>
            </article>

            {/* Call-to-action no final do artigo */}
            <div className="mt-12 pt-8 border-t border-zinc-200">
              <div className="bg-blue-50 rounded-lg p-6 md:p-8">
                <h3 className="text-2xl font-bold text-zinc-900 mb-3">
                  Precisa de um despachante?
                </h3>
                <p className="text-zinc-600 mb-6">
                  Entre em contato conosco e resolva tudo com praticidade e segurança.
                </p>
                <a
                  href="/#contato"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:opacity-90"
                >
                  Consulte agora
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar direita (1/3 em desktop) */}
          <aside className="lg:col-span-1">
            {/* Card de publicidade/CTA */}
            <div className="sticky top-24 space-y-6">
              {/* Widget 1 - Promoção */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg overflow-hidden text-white p-6 space-y-4">
                <h3 className="text-xl font-bold">Quando a internet cai, quem vem junto.</h3>
                <p className="text-sm font-light">
                  Resolvemos tudo que envolve o seu carro.
                </p>
                <button className="w-full bg-yellow-400 text-purple-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors">
                  Conheça a gente
                </button>
              </div>

              {/* Widget 2 - Links rápidos */}
              <div className="bg-zinc-100 rounded-lg p-6 space-y-4">
                <h3 className="font-bold text-zinc-900">Links Úteis</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/servicos"
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      → Nossos Serviços
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#sobre"
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      → Sobre Nós
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#contato"
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      → Entre em Contato
                    </a>
                  </li>
                  <li>
                    <a
                      href="/blog"
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      → Mais Artigos
                    </a>
                  </li>
                </ul>
              </div>

              {/* Widget 3 - Informações */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
                <h3 className="font-bold text-zinc-900">Saiba Mais</h3>
                <p className="text-sm text-zinc-700 leading-relaxed">
                  Fique sempre atualizado com nossos artigos e dicas sobre documentação veicular e regularização.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
