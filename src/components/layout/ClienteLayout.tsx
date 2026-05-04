import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ClienteSidebar } from "@/components/layout/ClienteSidebar";
import { FiMenu, FiX } from "react-icons/fi";
import ClientChatModal from "../chat/ClientChatModal";
import ChatFloatingButton from "../chat/ChatFloatingButton";
import { getStoredUser, getToken } from "@/lib/authStorage";
import { getChatSocket } from "@/services/socket";
import { useChatNotifications } from "@/hooks/useChatNotifications";

export function ClienteLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const t = getToken();
  const u = getStoredUser();
  const showClienteChat = !!(t && u?.nivel === "cliente");

  useEffect(() => {
    if (!showClienteChat) return;
    const tok = getToken();
    if (tok) getChatSocket(tok);
  }, [showClienteChat]);

  const { floatingCount } = useChatNotifications("cliente", isChatOpen);

  return (
    <div className="flex h-screen w-full bg-zinc-50 font-sans overflow-hidden">
      
      {/* SIDEBAR DESKTOP  */}
      <div className="hidden md:block">
        <ClienteSidebar />
      </div>

      {/* SIDEBAR MOBILE */}
      <div className="md:hidden">
        
        {/* Fundo preto com transparência (Overlay) */}
        <div 
          className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ease-in-out ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        <div 
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full shadow-none"
          }`}
        >
          {/* Botão X */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`absolute top-4 -right-12 p-2 text-white bg-black/50 hover:bg-black/80 rounded-full transition-opacity duration-300 delay-100 ${
              isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <FiX className="h-6 w-6" />
          </button>
          
          <ClienteSidebar onLinkClick={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>

      {/* ÁREA PRINCIPAL DA PÁGINA */}
      <main className="flex-1 flex flex-col overflow-y-auto w-full">
        

        {/* O conteúdo dinâmico (Tabelas, Formulários, etc) */}
        <div className="p-4 md:p-8 flex-1">
          <Outlet />
        </div>
        
      </main>
      {showClienteChat && (
        <>
          <ClientChatModal
            open={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
          <ChatFloatingButton
            onClick={() => setIsChatOpen((prev) => !prev)}
            unreadCount={floatingCount}
          />
        </>
      )}
    </div>
  );
}