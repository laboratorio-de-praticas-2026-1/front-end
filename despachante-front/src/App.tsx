import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Home } from "@/pages/Home"; 
import { Servicos } from "@/pages/Servicos"; 
import { AdminLayout } from "@/components/layout/AdminLayout";
import { BlogAdmin } from "@/pages/admin/BlogAdmin";

// 1. IMPORTANTE: Importe o seu componente CreatePostCMS aqui!
import CreatePostCMS from "@/components/sections/admin/blog/CreatePostCMS";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicos" element={<Servicos />} /> 

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/posts" replace />} />
          
          {/* Rota da tabela de posts */}
          <Route path="posts" element={<BlogAdmin />} />
          
          {/* ROTA DE CRIAÇÃO DE BLOGS*/}
          <Route path="posts/novo" element={<CreatePostCMS />} />
          
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500 text-center">
               <h2 className="text-2xl font-bold mb-2 text-zinc-700">Página em Construção 🚧</h2>
               <p>Esta área será implementada pelo back-end futuramente.</p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;