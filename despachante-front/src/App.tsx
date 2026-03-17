import { Navbar } from "@/components/layout/Navbar"
import { HeaderSection } from "./components/sections/HeaderSection"
import ServiceCarousel from "./components/sections/ServiceCarousel"
import AboutSection from "./components/sections/AboutSection"
import FAQ from "./components/sections/FAQ"

function App() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <Navbar />
      
      {/* Removemos o padding e as margens daqui. Agora a section vai bater no teto da tela! */}
      <main className="flex flex-col gap-20 md:gap-32">
        <HeaderSection />
        <ServiceCarousel/>
        
        {/* Futuras seções entrarão aqui embaixo */}
        <AboutSection />
        <FAQ />
      </main>
    </div>
  )
}

export default App