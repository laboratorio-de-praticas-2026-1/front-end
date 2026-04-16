import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search } from "lucide-react"

export type StatusFiltro = "Todos" | "Ativo" | "Inativo"

interface ToolbarServicosProps {
  statusFilter: StatusFiltro
  searchQuery: string
  onStatusChange: (value: StatusFiltro) => void
  onSearchChange: (value: string) => void
}

export default function ToolbarServicos({
  statusFilter,
  searchQuery,
  onStatusChange,
  onSearchChange,
}: ToolbarServicosProps) {
  const navigate = useNavigate()

  return (
    <div className="w-full flex flex-col">
      <h1 className="font-bold text-secondary text-4xl mb-2">Serviços</h1>
      <p className="text-muted-foreground text-sm">
        Visualize, crie, organize e acompanhe todas os serviços oferecidos.
      </p>

      <div className="w-full flex flex-col sm:flex-row mt-10 md:mt-12 gap-3 items-stretch sm:items-center">

        {/* Container com borda azul — mesmo padrão do Blog */}
        <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:gap-0 border-2 border-secondary rounded-xl p-2 sm:p-1.5 bg-white w-full">

          {/* Dropdown de Status */}
          <div className="flex items-center gap-2 sm:pr-2 sm:border-r border-border">
            <Select
              value={statusFilter}
              onValueChange={(val) => onStatusChange(val as StatusFiltro)}
            >
              <SelectTrigger className="h-10 border-none bg-white focus:ring-0 focus:ring-offset-0 w-full sm:w-36 text-sm text-muted-foreground shadow-none">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Todos" className="hover:bg-[#f0f0f0] transition-colors">Todos</SelectItem>
                <SelectItem value="Ativo" className="hover:bg-[#f0f0f0] transition-colors">Ativo</SelectItem>
                <SelectItem value="Inativo" className="hover:bg-[#f0f0f0] transition-colors">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campo de busca */}
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
            <Input
              type="search"
              placeholder="Pesquisar serviço..."
              className="pl-9 border-none bg-transparent focus-visible:ring-0 h-10 w-full text-sm"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Botão Novo serviço */}
        <Button
          className="h-12 sm:h-auto rounded-xl px-5 text-sm cursor-pointer flex gap-2 items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] bg-primary text-white"
          type="button"
          onClick={() => navigate("/admin/servicos/novo")}
        >
          <Plus className="h-4 w-4" />
          Novo serviço
        </Button>
      </div>
    </div>
  )
}
