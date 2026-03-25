import { Navbar } from "@/components/layout/Navbar";
import ServicosSection from "@/components/sections/servicos/ServicosDisponiveis";
import { HeaderServicos } from "@/components/sections/servicos/HeaderServicos";
import { Footer } from "@/components/layout/Footer";
import { PorQueEscolher } from "@/components/sections/servicos/PorQueEscolher";
import { OQueResolver } from "@/components/sections/servicos/OQueResolver";


export function Servicos() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <Navbar />
      <main className="flex flex-col gap-0">
        <HeaderServicos />
        <PorQueEscolher />
        <OQueResolver/>
        <ServicosSection />
      </main>
      <Footer/>
    </div>
  );
}