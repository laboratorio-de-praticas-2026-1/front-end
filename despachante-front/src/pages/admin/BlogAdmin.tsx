import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import BuscaBlog from "@/components/sections/admin/blog/BuscaCadastroBlog"; 
import BlogTable from "@/components/tables/BlogTable";
import { blogService } from "@/services/blogService";
import type { BlogPost } from "@/services/blogService";

export function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [carregando, setCarregando] = useState(true);
  
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

  return (
    <div className="flex flex-col gap-6">

      {/* 4. Passando a função irParaCriarPost para a prop onNovaPostagem */}
      <BuscaBlog onNovaPostagem={irParaCriarPost} />
      
      <BlogTable posts={posts} carregando={carregando} />
    </div>
  );
}