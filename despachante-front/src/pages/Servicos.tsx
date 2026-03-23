import { Navbar } from "@/components/layout/Navbar";
import ServicosSection  from "@/components/sections/servicos/ServicosDisponiveis";
import { HeaderServicos } from "@/components/sections/servicos/HeaderServicos";
import { Footer } from "@/components/layout/Footer";

export function Servicos() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <Navbar />
      <main className="flex flex-col gap-20 md:gap-32">
        <HeaderServicos />
        <ServicosSection />
      </main>
      <Footer/>
    </div>
  );
}



