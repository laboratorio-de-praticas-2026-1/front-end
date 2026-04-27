import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Home } from "@/pages/Home"; 
import { Servicos } from "@/pages/Servicos"; 
import { Blog } from "@/pages/Blog";
import { Artigo } from "@/pages/Artigo";
import { Login } from "@/pages/Login";
import { Cadastro } from "@/pages/Cadastro"; 

import SolicitacoesAdmin from "./components/admin/solicitacoes/SolicitacoesAdmin";
import Relatorios from "./components/admin/relatorios/RelatoriosAdmin";
import SolicitacaoSucesso from "@/pages/cliente/solicitacoes/SolicitacaoSucesso";
import HistoricoSolicitacoes from "@/pages/cliente/solicitacoes/HistoricoSolicitacoes";
import DetalhesSolicitacao from "@/pages/cliente/solicitacoes/DetalhesSolicitacao";
import FAQ from "./components/admin/faq/FaqAdmin";


import { ClienteLayout } from "@/components/layout/ClienteLayout";


import { AdminLayout } from "@/components/layout/AdminLayout";
import { BlogAdmin } from "@/pages/admin/blog/BlogAdmin";
import { CarouselAdmin } from "@/components/sections/admin/carrossel/CarouselAdmin";
import { CreateCarouselBanner } from "@/components/sections/admin/carrossel/CreateCarouselBanner";
import { EditCarouselBanner } from "@/components/sections/admin/carrossel/EditCarouselBanner";
import EditPostCMS from "@/components/sections/admin/blog/EditPostCMS";
import CreatePostCMS from "@/components/sections/admin/blog/CreatePostCMS";
import { Contato } from "@/pages/Contato";
import SobreNos from "@/pages/SobreNos";

import { PublicidadeAdmin } from "@/pages/admin/publicidade/PublicidadeAdmin";
import CreatePublicidadeCMS from "@/components/sections/admin/publicidade/CreatePublicidadeCMS";
import CreateRelatorioCMS from "./components/admin/relatorios/CreateRelatorioCMS";
import EditPublicidadeCMS from "@/components/sections/admin/publicidade/EditPublicidadeCMS";
import Solicitacoes from "@/pages/cliente/solicitacoes/SolicitacoesAdmin";

import EditarSolicitacao from "@/components/admin/EditarSolicitacao"
import { ServicosAdmin } from "@/pages/admin/servicos/ServicosAdmin.tsx";
import NovoServicoCMS from "@/pages/admin/servicos/NovoServicoCMS";
import EditarServicoCMS from "@/pages/admin/servicos/EditarServicoCMS";

import { DashboardAdmin } from "@/pages/admin/dashboard/DashboardAdmin";  
import GeralDashboard from "./components/admin/dashboard/GeralDashboard";
import SolicitacoesDashboard from "./components/admin/dashboard/SolicitacoesDashboard";
import VeiculosDashboard from "./components/admin/dashboard/VeiculosDashboard";
import ServicosDashboard from "./components/admin/dashboard/ServicosDashboard";
import DocumentosDashboard from "./components/admin/dashboard/DocumentosDashboard";
import FinanceiroDashboard from "./components/admin/dashboard/FinanceiroDashboard";
import ClientesDashboard from "./components/admin/dashboard/ClientesDashboard";
import NovoRelatorio from "./components/admin/relatorios/CreateRelatorioCMS";


import Usuarios from "@/pages/admin/Usuarios";
import NovoUsuario from "@/pages/admin/usuarios/NovoUsuario";
import EditarUsuario from "@/pages/admin/usuarios/EditarUsuario";
import { Fa500Px } from "react-icons/fa";
import NovoFAQ from "./components/admin/faq/CreateFaqCMS";
import EditarFAQ from "./components/admin/faq/EditarFaqCMS";

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
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} /> 
        <Route path="/SobreNos" element={<SobreNos />} />
        

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
          <Route path="servicos" element={<ServicosAdmin />} />
          <Route path="servicos/novo" element={<NovoServicoCMS />} />
          <Route path="servicos/editar/:id" element={<EditarServicoCMS />} />
          <Route path="solicitacoes" element={<SolicitacoesAdmin />} />
          <Route path="solicitacoes/:id/editar" element={<EditarSolicitacao />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="relatorios/novo" element={<NovoRelatorio />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="faq/novo" element={<NovoFAQ />} />
          <Route path="/admin/faq/editar/:id" element={<EditarFAQ />} />
          
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
          
          {/* Rota de publicidade */}
          <Route path="publicidade" element={<PublicidadeAdmin />} />
          <Route path="publicidade/novo" element={<CreatePublicidadeCMS />} />
          <Route path="publicidade/editar/:id" element={<EditPublicidadeCMS />} />

          {/* Rota do dashboard*/}
          <Route path="dashboard" element={<DashboardAdmin />}>
            <Route index element={<Navigate to="/admin/dashboard/geral" replace />} />
            <Route path="geral" element={<GeralDashboard />} />
            <Route path="solicitacoes" element={<SolicitacoesDashboard />} />
            <Route path="veiculos" element={<VeiculosDashboard />} />
            <Route path="servicos" element={<ServicosDashboard />} />
            <Route path="documentos" element={<DocumentosDashboard />} />
            <Route path="financeiro" element={<FinanceiroDashboard />} />
            <Route path="clientes" element={<ClientesDashboard />} />
          </Route>
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="usuarios/novo" element={<NovoUsuario />} />
          <Route path="usuarios/editar/:id" element={<EditarUsuario />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;