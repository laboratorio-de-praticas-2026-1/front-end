
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import SobreNosHeader from "@/components/sections/sobreNos/SobreNosHeader";
import TituloSecao from "@/components/sections/sobreNos/TituloSecao";
import DepoimentosSection from "@/components/sections/sobreNos/DepoimentosSection";

export default function SobreNos() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Navbar />

      <SobreNosHeader/>
      <TituloSecao/>
      <DepoimentosSection/>

      <Footer />
    </div>
  );
}