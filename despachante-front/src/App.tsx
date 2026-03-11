import { Button } from "@/components/ui/button"
import { FaReact } from "react-icons/fa"

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100">

      <Button className="flex items-center gap-2 text-lg">
        <FaReact />
        Ambiente configurado
      </Button>

    </div>
  )
}

export default App