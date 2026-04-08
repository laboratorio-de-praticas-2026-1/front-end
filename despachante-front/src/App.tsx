import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Home } from "@/pages/Home"; 
import { Servicos } from "@/pages/Servicos"; 
import { Blog } from "@/pages/Blog";
import { Artigo } from "@/pages/Artigo";

import SolicitacoesAdmin from "./components/admin/solicitacoes/SolicitacoesAdmin";
import SolicitacaoSucesso from "@/pages/cliente/SolicitacaoSucesso";
import HistoricoSolicitacoes from "@/pages/cliente/HistoricoSolicitacoes";
import DetalhesSolicitacao from "@/pages/cliente/DetalhesSolicitacao";


import { ClienteLayout } from "@/components/layout/ClienteLayout";


import { AdminLayout } from "@/components/layout/AdminLayout";
import { BlogAdmin } from "@/pages/admin/blog/BlogAdmin";
import { CarouselAdmin } from "@/components/sections/admin/carrossel/CarouselAdmin";
import { CreateCarouselBanner } from "@/components/sections/admin/carrossel/CreateCarouselBanner";
import { EditCarouselBanner } from "@/components/sections/admin/carrossel/EditCarouselBanner";
import EditPostCMS from "@/components/sections/admin/blog/EditPostCMS";
import CreatePostCMS from "@/components/sections/admin/blog/CreatePostCMS";
import { Contato } from "@/pages/Contato";

import Solicitacoes from "@/pages/cliente/SolicitacoesAdmin";

import EditarSolicitacao from "@/components/admin/EditarSolicitacao";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === ROTAS PÚBLICAS === */}
        <Route path="/" element={<Home />} />
        <Route path="/servicos" element={<Servicos />} /> 
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<Artigo />} />
        <Route path="/contato" element={<Contato />} />
        

        {/* === ROTAS DO PORTAL DO CLIENTE === */}
        <Route path="/cliente" element={<ClienteLayout />}>
          <Route index element={<Navigate to="/cliente/solicitacoes" replace />} />

          <Route path="solicitacoes" element={<Solicitacoes />} />
          <Route path="solicitacoes/sucesso" element={<SolicitacaoSucesso />} />
          <Route path="solicitacoes/historico" element={<HistoricoSolicitacoes />} />
          <Route path="solicitacoes/:id" element={<DetalhesSolicitacao />} />


          
          {/* Tela temporária: Pega qualquer link dentro do /cliente e mostra a sidebar */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-center py-20">
               <h2 className="text-2xl font-bold mb-2 text-[#032a4e]">Bem-vindo ao Portal do Cliente 🚗</h2>
               <p>A sua sidebar já está funcionando! O Dev construirá as telas aqui no meio.</p>
            </div>
          } />
        </Route>


        {/* === ROTAS DO ADMIN === */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/posts" replace />} />
          <Route path="solicitacoes" element={<SolicitacoesAdmin />} />
          <Route path="solicitacoes/:id/editar" element={<EditarSolicitacao />} />
          
          {/* Rota da tabela de posts */}
          <Route path="posts" element={<BlogAdmin />} />

          {/* ROTA DE CRIAÇÃO DE BLOGS*/}
          <Route path="posts/novo" element={<CreatePostCMS />} />

          {/* ROTA DE EDIÇÃO (O :id é o que o React vai pegar) */}
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
