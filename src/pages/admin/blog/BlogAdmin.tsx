import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import BuscaBlog from "@/components/sections/admin/blog/BuscaCadastroBlog"; 
import BlogTable from "@/components/tables/BlogTable";
import { blogService } from "@/services/blogService";
import type { BlogPost } from "@/services/blogService";
import { Button } from "@/components/ui/button";

export function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  
  // Inicializar o hook de navegação
  const navigate = useNavigate();

  useEffect(() => {
    carregarPosts();
  }, []);

  const carregarPosts = async () => {
    setCarregando(true);
    try {
      const dados = await blogService.listarTodos();
      setPosts(dados);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    } finally {
      setCarregando(false);
    }
  };

  // 3. Função que executa a navegação
  const irParaCriarPost = () => {
    navigate("/admin/posts/novo");
  };

  const solicitarExclusaoPost = (id: number) => {
    const postSelecionado = posts.find((post) => post.id === id) || null;
    setPostToDelete(postSelecionado);
  };

  const confirmarExclusaoPost = async () => {
    if (!postToDelete) return;

    setExcluindoId(postToDelete.id);
    try {
      await blogService.deletar(postToDelete.id);
      await carregarPosts();
      setPostToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir post:", error);
      alert("Não foi possível excluir a postagem.");
    } finally {
      setExcluindoId(null);
    }
  };

  const cancelarExclusaoPost = () => {
    if (excluindoId) return;
    setPostToDelete(null);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* 4. Passando a função irParaCriarPost para a prop onNovaPostagem */}
      <BuscaBlog onNovaPostagem={irParaCriarPost} />
      
      <BlogTable posts={posts} carregando={carregando} excluindoId={excluindoId} onExcluirPost={solicitarExclusaoPost} />

      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="p-4 text-center border-b border-zinc-200">
              <h3 className="text-lg font-bold text-zinc-900">Excluir postagem?</h3>
              <p className="mt-2 text-sm text-zinc-500">
                Tem certeza que deseja excluir a postagem #{postToDelete.id}?<br />
                Esta ação não poderá ser desfeita.
              </p>
            </div>
            <div className="flex justify-end gap-2 p-4">
              <Button variant="outline" onClick={cancelarExclusaoPost} className="h-10" disabled={Boolean(excluindoId)}>
                Voltar
              </Button>
              <Button variant="destructive" onClick={confirmarExclusaoPost} className="h-10" disabled={Boolean(excluindoId)}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}