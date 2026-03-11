import { Navbar } from "@/components/layout/Navbar"
import { FaReact } from "react-icons/fa"
import { HeaderSection } from "./components/sections/header-section"

function App() {
  return (
<div className="min-h-screen bg-zinc-50 font-sans">
      <Navbar />
      
      {/* Removemos o padding e as margens daqui. Agora a section vai bater no teto da tela! */}
      <main>
        <HeaderSection />
        
        {/* Futuras seções entrarão aqui embaixo */}
      </main>
    </div>
  )
}

export default App