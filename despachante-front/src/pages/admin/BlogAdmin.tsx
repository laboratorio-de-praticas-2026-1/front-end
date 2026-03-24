import { useEffect, useState } from "react";
import BuscaBlog from "@/components/sections/admin/blog/BuscaCadastroBlog"; // Verifique se o caminho do seu import está correto
import BlogTable from "@/components/tables/BlogTable";
import { blogService, type BlogPost } from "@/services/blogService";

export function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Assim que a tela abrir, ele chama a função carregarPosts
  useEffect(() => {
    carregarPosts();
  }, []);

  const carregarPosts = async () => {
    setCarregando(true);
    try {
      // Chama o back-end lá na nuvem (Railway)
      const dados = await blogService.listarTodos();
      console.log("Dados que chegaram do Back-end:", dados); 
      setPosts(dados);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <BuscaBlog />
      
      <BlogTable posts={posts} carregando={carregando} />
    </div>
  );
}