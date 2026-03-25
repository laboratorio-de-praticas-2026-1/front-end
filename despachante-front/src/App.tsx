import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Home } from "@/pages/Home"; 
import { Servicos } from "@/pages/Servicos"; 
import { Blog } from "@/pages/Blog";
import { BlogPost } from "@/pages/BlogPost";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { BlogAdmin } from "@/pages/admin/blog/BlogAdmin";
import { CarouselAdmin } from "@/pages/admin/carrossel/CarouselAdmin";
import { CreateCarouselBanner } from "@/pages/admin/carrossel/CreateCarouselBanner";
import { EditCarouselBanner } from "@/pages/admin/carrossel/EditCarouselBanner";
import EditPostCMS from "@/components/sections/admin/blog/EditPostCMS";

// 1. IMPORTANTE: Importe o seu componente CreatePostCMS aqui!
import CreatePostCMS from "@/components/sections/admin/blog/CreatePostCMS";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicos" element={<Servicos />} /> 
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/posts" replace />} />
          
          {/* Rota da tabela de posts */}
          <Route path="posts" element={<BlogAdmin />} />

          {/* ROTA DE CRIAÇÃO DE BLOGS*/}
          <Route path="posts/novo" element={<CreatePostCMS />} />

          {/* ROTA DE EDIÇÃO (O :id é o que o React vai capturar) */}
          <Route path="posts/editar/:id" element={<EditPostCMS />} />

          {/* Rota do carrossel */}
          <Route path="carrossel" element={<CarouselAdmin />} />
          <Route path="carrossel/novo" element={<CreateCarouselBanner />} />
          <Route path="carrossel/:id/editar" element={<EditCarouselBanner />} />
          
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