import { CgMenuLeft } from "react-icons/cg";
import { BiGitPullRequest, BiSupport } from "react-icons/bi";
import { FaCogs, FaWallet } from "react-icons/fa";
import { RiCarFill } from "react-icons/ri";
import { BsFileEarmarkTextFill } from "react-icons/bs";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

type SidebarLink = {
    name: string;
    href: string;
    icon: React.ElementType;
};

const dashboardSidebarLinks: SidebarLink[] = [
    { name: "Geral", href: "/admin/dashboard/geral", icon: CgMenuLeft },
    { name: "Solicitações", href: "/admin/dashboard/solicitacoes", icon: BiGitPullRequest },
    { name: "Veículos", href: "/admin/dashboard/veiculos", icon: RiCarFill }, // Versão preenchida
    { name: "Serviços", href: "/admin/dashboard/servicos", icon: FaCogs },
    { name: "Documentos", href: "/admin/dashboard/documentos", icon: BsFileEarmarkTextFill }, // Versão preenchida
    { name: "Financeiro", href: "/admin/dashboard/financeiro", icon: FaWallet },
    { name: "Clientes", href: "/admin/dashboard/clientes", icon: BiSupport },
];

interface AdminSidebarProps {
    onLinkClick?: () => void;
}

export function DashboardAdmin({ onLinkClick }: AdminSidebarProps) {
    return (
        <div className="flex flex-row w-full h-full">
            <aside className="py-8 w-80 bg-[#E9E9E9] text-secondary-foreground flex flex-col h-full">
                <div className="flex flex-col px-8">
                    <span className="font-bold text-2xl mb-4 text-secondary">Dashboard</span>
                    <span className="text-[#6C6C6C]">Visualize e acompanhe todas as métricas da sua empresa.</span>
                </div>
                <div className="w-full flex flex-row bg-[#D9D9D9]/48 h-18 align-middle items-center mt-6 mb-4 px-4 text-[#6C6C6C]">
                    <Input placeholder="Procurar assunto" className="px-8 h-18 w-full text-[#656575] !text-base !rounded-none"></Input>
                    <Search className="" />
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {dashboardSidebarLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.href}
                            end
                            onClick={onLinkClick}
                            className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-lg text-lg font-medium transition-all duration-200 
              ${isActive
                                    ? "bg-primary/20 text-secondary shadow-inner"
                                    : "text-secondary/100 hover:bg-secondary/10 hover:text-secondary/80"
                                }
            `}
                        >
                            <link.icon className="h-5 w-5 shrink-0" />
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

            </aside>
            <main className="flex-1 flex flex-col overflow-y-auto p-8 w-full h-full bg-white">

                {/* O conteúdo dinâmico (Tabelas, Formulários, etc) */}
                <div className="flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    )
};
