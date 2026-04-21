import { CgMenuLeft } from "react-icons/cg";
import { BiGitPullRequest, BiSupport } from "react-icons/bi";
import { FaCogs, FaWallet } from "react-icons/fa";
import { RiCarFill } from "react-icons/ri";
import { BsFileEarmarkTextFill } from "react-icons/bs";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

type SidebarLink = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const dashboardSidebarLinks: SidebarLink[] = [
  { name: "Geral", href: "/admin/dashboard/geral", icon: CgMenuLeft },
  { name: "Solicitações", href: "/admin/dashboard/solicitacoes", icon: BiGitPullRequest },
  { name: "Veículos", href: "/admin/dashboard/veiculos", icon: RiCarFill },
  { name: "Serviços", href: "/admin/dashboard/servicos", icon: FaCogs },
  { name: "Documentos", href: "/admin/dashboard/documentos", icon: BsFileEarmarkTextFill },
  { name: "Financeiro", href: "/admin/dashboard/financeiro", icon: FaWallet },
  { name: "Clientes", href: "/admin/dashboard/clientes", icon: BiSupport },
];

type SearchItem = {
  label: string;
  description?: string;
  href: string;
  page: string;
};

const searchIndex: SearchItem[] = [
  // Geral
  { label: "Solicitações em aberto", page: "Geral", href: "/admin/dashboard/geral" },
  { label: "Solicitações concluídas", page: "Geral", href: "/admin/dashboard/geral" },
  { label: "Documentos Pendentes", page: "Geral", href: "/admin/dashboard/geral" },
  { label: "Clientes Novos", page: "Geral", href: "/admin/dashboard/geral" },
  { label: "Taxa de cancelamento", page: "Geral", href: "/admin/dashboard/geral" },
  { label: "Débitos em Aberto", page: "Geral", href: "/admin/dashboard/geral" },
  { label: "Parcelas Vencidas", page: "Geral", href: "/admin/dashboard/geral" },
  // Solicitações
  { label: "Gráfico de Solicitações", description: "Donut com status", page: "Solicitações", href: "/admin/dashboard/solicitacoes" },
  { label: "Solicitações por Status", page: "Solicitações", href: "/admin/dashboard/solicitacoes" },
  { label: "Próximas de vencer", page: "Solicitações", href: "/admin/dashboard/solicitacoes" },
  { label: "Fora do prazo", page: "Solicitações", href: "/admin/dashboard/solicitacoes" },
  { label: "Tempo médio de conclusão por serviço", page: "Solicitações", href: "/admin/dashboard/solicitacoes" },
  { label: "Recebido", description: "Status de solicitação", page: "Solicitações", href: "/admin/dashboard/solicitacoes" },
  { label: "Em Andamento", description: "Status de solicitação", page: "Solicitações", href: "/admin/dashboard/solicitacoes" },
  { label: "Aguardando Pagamento", description: "Status de solicitação", page: "Solicitações", href: "/admin/dashboard/solicitacoes" },
  { label: "Aguardando Documento", description: "Status de solicitação", page: "Solicitações", href: "/admin/dashboard/solicitacoes" },
  { label: "Concluído", description: "Status de solicitação", page: "Solicitações", href: "/admin/dashboard/solicitacoes" },
  { label: "Cancelado", description: "Status de solicitação", page: "Solicitações", href: "/admin/dashboard/solicitacoes" },
  // Veículos
  { label: "Total de veículos cadastrados", page: "Veículos", href: "/admin/dashboard/veiculos" },
  { label: "Veículos com solicitação ativa", page: "Veículos", href: "/admin/dashboard/veiculos" },
  { label: "Veículos com débito pendente", page: "Veículos", href: "/admin/dashboard/veiculos" },
  { label: "Débitos pendentes por placa", page: "Veículos", href: "/admin/dashboard/veiculos" },
  { label: "Valor total de débitos pendentes", page: "Veículos", href: "/admin/dashboard/veiculos" },
  // Serviços
  { label: "Serviços ativos", page: "Serviços", href: "/admin/dashboard/servicos" },
  { label: "Serviços pausados", page: "Serviços", href: "/admin/dashboard/servicos" },
  { label: "Mais solicitados", description: "Ranking de serviços", page: "Serviços", href: "/admin/dashboard/servicos" },
  { label: "Receita por serviço", page: "Serviços", href: "/admin/dashboard/servicos" },
  // Documentos
  { label: "Documentos pendentes", page: "Documentos", href: "/admin/dashboard/documentos" },
  { label: "Documentos aprovados", page: "Documentos", href: "/admin/dashboard/documentos" },
  { label: "Documentos rejeitados", page: "Documentos", href: "/admin/dashboard/documentos" },
  { label: "Solicitações travadas por documento", page: "Documentos", href: "/admin/dashboard/documentos" },
  // Financeiro
  { label: "Receita realizada", page: "Financeiro", href: "/admin/dashboard/financeiro" },
  { label: "Receita pendente", page: "Financeiro", href: "/admin/dashboard/financeiro" },
  { label: "Ticket médio", page: "Financeiro", href: "/admin/dashboard/financeiro" },
  { label: "Inadimplência", page: "Financeiro", href: "/admin/dashboard/financeiro" },
  { label: "Previsão de caixa 30 dias", page: "Financeiro", href: "/admin/dashboard/financeiro" },
  { label: "Histórico mensal de receita", page: "Financeiro", href: "/admin/dashboard/financeiro" },
  { label: "Pagamentos por método", description: "Pix / Cartão", page: "Financeiro", href: "/admin/dashboard/financeiro" },
  // Clientes
  { label: "Top clientes por volume", page: "Clientes", href: "/admin/dashboard/clientes" },
  { label: "Top clientes por valor pago", page: "Clientes", href: "/admin/dashboard/clientes" },
  { label: "Clientes com parcelas em atraso", page: "Clientes", href: "/admin/dashboard/clientes" },
];

const PAGE_ICONS: Record<string, React.ElementType> = {
  Geral: CgMenuLeft,
  Solicitações: BiGitPullRequest,
  Veículos: RiCarFill,
  Serviços: FaCogs,
  Documentos: BsFileEarmarkTextFill,
  Financeiro: FaWallet,
  Clientes: BiSupport,
};

interface AdminSidebarProps {
  onLinkClick?: () => void;
}

export function DashboardAdmin({ onLinkClick }: AdminSidebarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results =
    query.trim().length >= 2
      ? searchIndex.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.page.toLowerCase().includes(query.toLowerCase()) ||
          (item.description?.toLowerCase().includes(query.toLowerCase()) ?? false)
        ).slice(0, 8)
      : [];

  const showDropdown = focused && results.length > 0;

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function handleSelect(item: SearchItem) {
    navigate(item.href);
    setQuery("");
    setFocused(false);
    onLinkClick?.();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIndex]) handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setFocused(false);
    }
  }

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <div className="flex flex-row w-full h-full">
      <aside className="py-8 w-80 bg-[#E9E9E9] text-secondary-foreground flex flex-col h-full">
        <div className="flex flex-col px-8">
          <span className="font-bold text-2xl mb-4 text-secondary">Dashboard</span>
          <span className="text-[#6C6C6C]">
            Visualize e acompanhe todas as métricas da sua empresa.
          </span>
        </div>

        {/* Search box */}
        <div className="relative mt-6 mb-4 mx-4">
          <div className="flex flex-row bg-[#D9D9D9]/48 h-14 items-center px-2 text-[#6C6C6C]">
            <Input
              ref={inputRef}
              placeholder="Procurar assunto..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              onKeyDown={handleKeyDown}
              className="px-3 h-14 w-full text-[#656575] !text-base !rounded-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Search className="shrink-0 w-4 h-4 mr-2 text-[#6C6C6C]" />
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div
              ref={listRef}
              className="absolute top-full left-0 right-0 z-50 bg-white border border-[#D2D5DB] rounded-b-lg shadow-lg max-h-72 overflow-y-auto"
            >
              {results.map((item, i) => {
                const Icon = PAGE_ICONS[item.page] ?? CgMenuLeft;
                return (
                  <button
                    key={i}
                    data-index={i}
                    onMouseDown={() => handleSelect(item)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 transition-colors border-b border-[#F0F0F0] last:border-0 ${
                      i === activeIndex ? "bg-[#E9E9E9]" : "hover:bg-[#F5F5F5]"
                    }`}
                  >
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary shrink-0">
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-secondary truncate">
                        {item.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.page}
                        {item.description ? ` • ${item.description}` : ""}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* No results */}
          {focused && query.trim().length >= 2 && results.length === 0 && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white border border-[#D2D5DB] rounded-b-lg shadow-lg">
              <p className="px-4 py-3 text-sm text-muted-foreground">
                Nenhum resultado para "{query}"
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {dashboardSidebarLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              end
              onClick={onLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-lg text-lg font-medium transition-all duration-200 
              ${
                isActive
                  ? "bg-primary/20 text-secondary shadow-inner"
                  : "text-secondary/100 hover:bg-secondary/10 hover:text-secondary/80"
              }`
              }
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto p-8 w-full h-full bg-white">
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
