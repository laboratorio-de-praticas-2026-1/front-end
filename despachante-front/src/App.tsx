import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Home } from "@/pages/Home"; 
import { Servicos } from "@/pages/Servicos"; 
import { AdminLayout } from "@/components/layout/AdminLayout";
import { BlogAdmin } from "@/pages/admin/BlogAdmin";
import EditPostCMS from "@/components/sections/admin/blog/EditPostCMS";
import { Blog } from "@/pages/Blog";
import CreatePostCMS from "@/components/sections/admin/blog/CreatePostCMS";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === ROTAS PÚBLICAS === */}
        <Route path="/" element={<Home />} />
        <Route path="/servicos" element={<Servicos />} /> 
        
        {/* ROTA DA LANDING PAGE DO BLOG AQUI */}
        <Route path="/blog" element={<Blog />} /> 

        {/* === ROTAS ADMINISTRATIVAS === */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/posts" replace />} />
          
          {/* Rota da tabela de posts */}
          <Route path="posts" element={<BlogAdmin />} />
          
          {/* ROTA DE CRIAÇÃO DE BLOGS*/}
          <Route path="posts/novo" element={<CreatePostCMS />} />

          {/* ROTA DE EDIÇÃO (O :id é o que o React vai capturar) */}
          <Route path="posts/editar/:id" element={<EditPostCMS />} />
          
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500 text-center">
               <h2 className="text-2xl font-bold mb-2 text-zinc-700">Página em Construção 🚧</h2>
               <p>Esta área será implementada futuramente.</p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;