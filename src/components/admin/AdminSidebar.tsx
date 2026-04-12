import { 
  FiSettings, 
  FiHelpCircle, 
  FiColumns, 
  FiBarChart2, 
  FiUsers, 
  FiFileText,
  FiLogOut
} from "react-icons/fi";
import { FaRegHandshake, FaBullhorn } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import logoDespachante from "@/assets/logo-despachante.png";

type SidebarLink = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const sidebarLinks: SidebarLink[] = [
  { name: "Solicitações", href: "/admin/solicitacoes", icon: FaRegHandshake },
  { name: "Serviços", href: "/admin/servicos", icon: FiSettings },
  { name: "Blog", href: "/admin/posts", icon: FiFileText },
  { name: "FAQ", href: "/admin/faq", icon: FiHelpCircle },
  { name: "Carrossel", href: "/admin/carrossel", icon: FiColumns },
  { name: "Publicidade", href: "/admin/publicidade", icon: FaBullhorn },
  { name: "Dashboard", href: "/admin", icon: FiBarChart2 },
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
    <aside className="w-64 bg-secondary text-secondary-foreground flex flex-col h-full">
      <div className="h-28 flex items-center justify-center px-6 border-b border-white/10 shrink-0">
        <img 
          src={logoDespachante}
          alt="Grupo Bortone" 
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
          {currentUser.name}
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