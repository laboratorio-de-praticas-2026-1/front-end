import { useState } from "react";
import { FiMenu, FiX, FiUser } from "react-icons/fi"; 

// Lista centralizada de rotas da navbar
const navLinks = [
  { name: "Sobre Nós", href: "#" },
  { name: "Serviços", href: "#" },
  { name: "Mapa", href: "#" },
  { name: "Blog", href: "#" },
  { name: "Dúvidas", href: "#" },
  { name: "Contato", href: "#" },
];

export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* HEADER PRINCIPAL (DESKTOP E BARRA DO MOBILE) backdrop-blur-sm*/}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 shadow-sm border-b border-border transition-all duration-300">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-12">
          
          {/* 1. Logo com animação de scale (aumento de 5%) */}
          <a href="/" className="flex-shrink-0">
            <img 
              src="/src/assets/logo-bortone-escura.png" 
              alt="Logo Bortone" 
              className="h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </a>

          {/* 2. Navegação Desktop (Escondida no Mobile) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-foreground/80 rounded-full transition-all duration-300 hover:bg-muted hover:text-foreground hover:[text-shadow:0_0_1px_currentColor]"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* 3. Botão Entrar Desktop */}
          <div className="bg-primary hidden md:block  rounded-full transition-all duration-300 hover:scale-105 hover:opacity-90">
            <a 
              href="/login"
              className="inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 text-base font-semibold text-white shadow-sm "
            >
              <FiUser className="h-5 w-5 stroke-[2.5]" />
              Entrar
            </a>
          </div>

          {/* 4. Ícone do Menu Hamburger */}
          <button 
            className="md:hidden p-2 text-foreground transition-transform duration-300 hover:scale-110"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Abrir menu"
          >
            <FiMenu className="h-6 w-6 stroke-[2]" />
          </button>
        </div>
      </header>

      {/* MENU MOBILE OVERLAY (Tela Cheia) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[#F9F9F9] animate-in slide-in-from-right-full duration-300">
          
          {/* Topo do Menu Mobile */}
          <div className="flex h-20 items-center justify-between px-6">
            <img 
              src="/src/assets/logo-bortone-escura.png" 
              alt="Logo Bortone" 
              className="h-10 w-auto object-contain"
            />
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="p-2 text-foreground transition-transform duration-300 hover:scale-110 hover:text-destructive"
              aria-label="Fechar menu"
            >
              <FiX className="h-6 w-6 stroke-[2]" />
            </button>
          </div>

          {/* Links do Menu Mobile */}
          <nav className="flex flex-col px-4 pt-6 pb-2 gap-2 overflow-y-auto">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileOpen(false)} 
                className="px-6 py-4 text-base font-medium text-foreground rounded-full transition-all duration-300 hover:bg-zinc-200 hover:[text-shadow:0_0_1px_currentColor]"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Botão Entrar no rodapé do Menu Mobile */}
          <div className="mt-auto p-6 pb-8">
            <a 
              href="/login"
              className="bg-primary flex w-full items-center justify-center gap-2.5 rounded-full h-14 text-lg font-semibold text-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:opacity-90"
            >
              <FiUser className="h-6 w-6 stroke-[2.5]" />
              Entrar
            </a>
          </div>
          
        </div>
      )}
    </>
  );
}