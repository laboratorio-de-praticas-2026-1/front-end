import { Link, useLocation } from "react-router-dom";
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

export function AdminSidebar() {
  const location = useLocation();

const sidebarLinks: SidebarLink[] = [
  { name: "Solicitações", href: "/admin/solicitacoes", icon: FaRegHandshake },
  { name: "Serviços", href: "/admin/servicos", icon: FiSettings },
  { name: "Blog", href: "/admin/posts", icon: FiFileText },
  { name: "FAQ", href: "/admin/faq", icon: FiHelpCircle },
  { name: "Carrossel", href: "/admin/carrossel", icon: FiColumns },
  { name: "Publicidade", href: "/admin/publicidade", icon: FaBullhorn },
  { name: "Dashboard", href: "/admin/dashboard", icon: FiBarChart2 },
  { name: "Clientes", href: "/admin/clientes", icon: FiUsers },
];


interface AdminSidebarProps {
  onLinkClick?: () => void;
}

export function AdminSidebar({ onLinkClick }: AdminSidebarProps) {
  const currentUser = {
    name: "Amanda Oliveira C...",
  };

  const handleLogout = () => {
    console.log("Back-end: Inserir lógica de limpar token");
  };

  return (
    <aside className="w-[260px] min-h-screen bg-[#002845] flex flex-col text-white shadow-xl flex-shrink-0">
      
      {/* Logo Header (Restaurado do original) */}
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

      {/* Footer (Configurações e Sair) */}
      <div className="p-4 border-t border-white/10 space-y-4">
        <Link
          to="/admin/configuracoes"
          className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
            location.pathname.startsWith("/admin/configuracoes")
              ? "bg-white/10 font-semibold"
              : "text-zinc-300 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Settings size={20} />
          <span className="text-[15px]">Configurações</span>
        </Link>

        <div className="px-2">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 w-[100px] py-2.5 bg-[#1E84CF] hover:bg-[#166db0] text-white rounded-full transition-colors text-sm font-semibold shadow-md"
          >
            Sair
            <LogOut size={16} />
          </Link>
        </div>
      </div>
      
    </aside>
  );
}