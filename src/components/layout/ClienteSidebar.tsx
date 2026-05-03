import { useState } from "react";
import { FiHome, FiCreditCard, FiFileText, FiLogOut } from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import logoDespachante from "@/assets/logo-despachante.png";
import { clearSession, getStoredUser } from "@/lib/authStorage";

type SidebarLink = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const sidebarLinks: SidebarLink[] = [
  { name: "Início", href: "/cliente/inicio", icon: FiHome },
  { name: "Meus Veículos", href: "/cliente/meus-veiculos", icon: FaCar },
  { name: "Débitos", href: "/cliente/debitos", icon: FiCreditCard },
  { name: "Solicitações", href: "/cliente/solicitacoes", icon: FiFileText },
];

interface ClienteSidebarProps {
  onLinkClick?: () => void;
}

interface Cliente {
  nome: string;
}

export function ClienteSidebar({ onLinkClick }: ClienteSidebarProps) {
  const navigate = useNavigate();
  const stored = getStoredUser();
  const [currentUser, setCurrentUser] = useState<Cliente | null>(
    stored ? { nome: stored.nome } : null,
  );

  const handleLogout = async () => {
    clearSession();
    sessionStorage.clear();
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-[#032a4e] text-white flex flex-col h-full">
        
      <div className="h-28 flex items-center justify-center px-6 border-b border-white/10 shrink-0">
        <img 
          src={logoDespachante}
          alt="BRTN Despachante" 
          className="h-16 w-auto object-contain"
        />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.href}
            end
            onClick={onLinkClick} 
            className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-lg text-sm font-medium transition-all duration-200 
              ${isActive 
                ? "bg-black/20 text-white shadow-inner" 
                : "text-white/80 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <link.icon className="h-5 w-5 shrink-0" />
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10 flex flex-col gap-4 shrink-0">
        <span className="font-bold text-sm text-white truncate px-1">
          {currentUser?.nome || "Carregando..."}
        </span>
        <Button 
          onClick={handleLogout}
          className="w-[120px] bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-between px-5 h-10 shadow-md transition-transform hover:scale-105"
        >
          Sair
          <FiLogOut className="h-4 w-4 stroke-[2.5]" />
        </Button>
      </div>
    </aside>
  );
}