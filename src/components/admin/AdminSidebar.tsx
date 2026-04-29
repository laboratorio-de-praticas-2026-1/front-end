import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Handshake,
  Settings,
  Newspaper,
  HelpCircle,
  GalleryHorizontal,
  Megaphone,
  LineChart,
  FileText,
  Building2,
  Users,
  LogOut
} from "lucide-react";
import logoDespachante from "@/assets/logo-despachante.png";

interface AdminSidebarProps {
  onLinkClick?: () => void;
}

interface AdminUser {
  nome: string;
}

export function AdminSidebar({ onLinkClick }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Estado preparado para receber os dados da API
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>({
    nome: "Admin Principal",
  });

  const navItems = [
    { icon: Handshake, label: "Solicitações", path: "/admin/solicitacoes" },
    { icon: Settings, label: "Serviços", path: "/admin/servicos" },
    { icon: Newspaper, label: "Blog", path: "/admin/posts" }, 
    { icon: HelpCircle, label: "FAQ", path: "/admin/faq" },
    { icon: GalleryHorizontal, label: "Carrossel", path: "/admin/carrossel" },
    { icon: Megaphone, label: "Publicidade", path: "/admin/publicidade" },
    { icon: LineChart, label: "Dashboard", path: "/admin/dashboard" },
    { icon: FileText, label: "Relatórios", path: "/admin/relatorios" },
    { icon: Building2, label: "Empresas", path: "/admin/empresas" },
    { icon: Users, label: "Usuários", path: "/admin/usuarios" },
  ];

  const handleLogout = async () => {
    // Equipe de integração: adicionar chamada de logout na API se necessário
    localStorage.removeItem("admin_token");
    sessionStorage.clear();
    setCurrentAdmin(null);
    navigate("/login");
  };

  return (
    <aside className="w-[260px] min-h-screen bg-[#002845] flex flex-col text-white shadow-xl flex-shrink-0">
      
      {/* Logo Header */}
      <div className="h-28 flex items-center justify-center px-6 border-b border-white/10 shrink-0">
        <img 
          src={logoDespachante}
          alt="Grupo Bortone" 
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* Navegação Principal (Scrollable) */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onLinkClick}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? "bg-white/10 font-semibold shadow-inner" 
                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[15px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer (Nome do Admin e Sair) */}
      <div className="p-4 border-t border-white/10 flex flex-col gap-4">
        
        <span className="font-semibold text-sm text-zinc-300 truncate px-2">
          {currentAdmin?.nome || "Carregando..."}
        </span>

        <div className="px-2">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-[100px] py-2.5 bg-[#1E84CF] hover:bg-[#166db0] text-white rounded-full transition-colors text-sm font-semibold shadow-md"
          >
            Sair
            <LogOut size={16} />
          </button>
        </div>
      </div>
      
    </aside>
  );
}