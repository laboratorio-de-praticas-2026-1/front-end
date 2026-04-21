import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { FiX } from "react-icons/fi";
import AdminChatModal from "../chat/AdminChatModal";
import ChatFloatingButton from "../chat/ChatFloatingButton";

export function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();

  // Rotas que não devem ter espaçamento padrão (ex: Dashboard)
  const noPaddingRoutes = [
    "/admin/dashboard",
    "/admin/dashboard/geral",
    "/admin/dashboard/solicitacoes",
    "/admin/dashboard/veiculos",
    "/admin/dashboard/servicos",
    "/admin/dashboard/documentos",
    "/admin/dashboard/financeiro",
    "/admin/dashboard/clientes"
  ];

  return (
    // Fundo da tela toda: Azul escuro (Secondary) 
    <div className="flex h-screen w-full bg-[#002845] font-sans overflow-hidden">

      {/* SIDEBAR DESKTOP  */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* SIDEBAR MOBILE */}
      <div className="md:hidden">

        {/* Fundo preto com transparência (Overlay) */}
        <div
          className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* A Sidebar que desliza suavemente da esquerda */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full shadow-none"
            }`}
        >
          {/* Botão X (Aparece suavemente após o menu abrir) */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className={`absolute top-4 -right-12 p-2 text-white bg-black/50 hover:bg-black/80 rounded-full transition-opacity duration-300 delay-100 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
          >
            <FiX className="h-6 w-6" />
          </button>

          <AdminSidebar onLinkClick={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>

      {/* ÁREA PRINCIPAL DA PÁGINA (Com bordas arredondadas e fundo branco) */}
      <main className="flex-1 flex flex-col overflow-y-auto m-2 rounded-[28px] bg-[#f8fafc]">

        {/* O conteúdo dinâmico (Tabelas, Formulários, etc) */}
        <div
          className={`flex-1 ${noPaddingRoutes.includes(location.pathname)
            ? "p-0"
            : "p-4 md:p-8"
            }`}
        >
          <Outlet />
        </div>

      </main>

      <AdminChatModal
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      <ChatFloatingButton
        onClick={() => setIsChatOpen((prev) => !prev)}
        unreadCount={1}
      />
    </div>
  );
}
