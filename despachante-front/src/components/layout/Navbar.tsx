import { useState } from "react";
import { FiMenu, FiX, FiUser } from "react-icons/fi"; 
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Sobre Nós", href: "/#sobre" },
  { name: "Serviços", href: "/servicos" },
  { name: "Mapa", href: "/#mapa" },
  { name: "Blog", href: "/#blog" },
  { name: "Dúvidas", href: "/#duvidas" },
  { name: "Contato", href: "/#contato" },
];

export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* HEADER PRINCIPAL */}
      <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white/80 backdrop-blur-sm shadow-sm border-b border-border transition-all duration-300">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-12">
          
          <Link to="/" className="flex-shrink-0">
            <img 
              src="/src/assets/logo-bortone-escura.png" 
              alt="Logo Bortone" 
              className="h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="px-4 py-2 text-sm font-medium text-foreground/80 rounded-full transition-all duration-300 hover:bg-muted hover:text-foreground hover:[text-shadow:0_0_1px_currentColor]"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="bg-primary hidden md:block rounded-full transition-all duration-300 hover:scale-105 hover:opacity-90">
            <Link 
              to="/login"
              className="inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 text-base font-semibold text-white shadow-sm "
            >
              <FiUser className="h-5 w-5 stroke-[2.5]" />
              Entrar
            </Link>
          </div>

          <button 
            className="md:hidden p-2 text-foreground transition-transform duration-300 hover:scale-110"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Abrir menu"
          >
            {/* CORREÇÃO 1: stroke estava incompleto, mudei para stroke-[2.5] */}
            <FiMenu className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* --- MENU MOBILE --- */}
      <div className="md:hidden">
        <div 
          className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />

        <div 
          // CORREÇÃO 2: A classe z- estava incompleta. Alterei para z-50 para ficar na frente do blur
          className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm flex flex-col bg-[#F9F9F9] shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isMobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-20 items-center justify-between px-6 border-b border-border/50 shrink-0">
            <img 
              src="/src/assets/logo-bortone-escura.png" 
              alt="Logo Bortone" 
              className="h-10 w-auto object-contain"
            />
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="p-2 -mr-2 text-foreground/70 hover:text-destructive bg-zinc-200/50 hover:bg-red-100 rounded-full transition-all duration-300"
              aria-label="Fechar menu"
            >
              <FiX className="h-6 w-6 stroke-[2.5]" />
            </button>
          </div>

          <nav className="flex flex-col flex-1 px-4 pt-6 pb-2 gap-2 overflow-y-auto custom-scrollbar">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMobileOpen(false)} 
                className="px-6 py-4 text-lg font-medium text-foreground/90 rounded-2xl transition-all duration-200 active:scale-[0.98] hover:bg-zinc-200 hover:text-foreground hover:[text-shadow:0_0_1px_currentColor]"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto p-6 pb-8 border-t border-border/50 bg-[#F9F9F9] shrink-0">
            <Link 
              to="/login"
              onClick={() => setIsMobileOpen(false)} 
              className="bg-primary flex w-full items-center justify-center gap-2.5 rounded-2xl h-14 text-lg font-semibold text-white shadow-md transition-all duration-300 active:scale-[0.98] hover:opacity-90"
            >
              <FiUser className="h-6 w-6 stroke-[2.5]" />
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}