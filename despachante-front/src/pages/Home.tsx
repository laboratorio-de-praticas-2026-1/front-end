import { Navbar } from "@/components/layout/Navbar";
import { HeaderSection } from "@/components/sections/HeaderSection";
import ServiceCarousel from "@/components/sections/ServiceCarousel"; // Ajuste se for export default
import SobreGrupo from '../components/sections/AboutSection';
import FAQ from '../components/sections/FaqSection';
import { Footer } from "@/components/layout/Footer";


export function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <Navbar />
      <main className="flex flex-col gap-20 md:gap-32">
        <HeaderSection /> 
        <ServiceCarousel />
        <SobreGrupo />
        <FAQ />
      </main>
      <Footer/>
    </div>
  );
}