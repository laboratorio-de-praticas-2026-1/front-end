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
import { Slider } from "@/components/ui/slider"
import { Plus, Search } from "lucide-react"

export type StatusFiltro = "Todos" | "Ativo" | "Inativo"

interface ToolbarServicosProps {
  statusFilter: StatusFiltro
  searchQuery: string
  prazoRange: number[]
  valorRange: number[]
  onStatusChange: (value: StatusFiltro) => void
  onSearchChange: (value: string) => void
  onPrazoChange: (value: number[]) => void
  onValorChange: (value: number[]) => void
  onClearFilters: () => void
}

export default function ToolbarServicos({
  statusFilter,
  searchQuery,
  prazoRange,
  valorRange,
  onStatusChange,
  onSearchChange,
  onPrazoChange,
  onValorChange,
  onClearFilters,
}: ToolbarServicosProps) {
  const navigate = useNavigate()

  return (
    <div className="w-full flex flex-col gap-6">

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-bold text-secondary text-4xl mb-2">Serviços</h1>
          <p className="text-muted-foreground text-sm">
            Visualize, crie, organize e acompanhe todas os serviços oferecidos.
          </p>
        </div>
        <Button
          className="w-full sm:w-auto rounded-lg h-10 px-5 text-sm cursor-pointer flex gap-2 items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] bg-primary text-white"
          type="button"
          onClick={() => navigate("/admin/servicos/novo")}
        >
          <Plus className="h-4 w-4" />
          Novo serviço
        </Button>
      </div>

      <div className="w-full flex flex-col xl:flex-row gap-4 xl:gap-0 items-stretch xl:items-center border-2 border-secondary rounded-xl p-2 sm:p-1.5 bg-white">

        {/* Slider de Prazo */}
        <div className="flex flex-col justify-center w-full xl:w-48 px-3 py-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">Prazo (dias)</span>
            {/* Corrigido: exibe [0] e [1] separadamente */}
            <span className="text-xs font-medium text-slate-700">
              {prazoRange[0]} - {prazoRange[1]} dias
            </span>
          </div>
          <Slider
            min={0}
            max={30}
            step={1}
            value={prazoRange}
            onValueChange={onPrazoChange}
            className="w-full"
          />
        </div>

        <div className="hidden xl:block w-px h-8 bg-border mx-2" />

        {/* Slider de Valor */}
        <div className="flex flex-col justify-center w-full xl:w-56 px-3 py-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">Valor (R$)</span>
            {/* Corrigido: exibe [0] e [1] separadamente */}
            <span className="text-xs font-medium text-slate-700">
              R$ {valorRange[0]} - R$ {valorRange[1]}
            </span>
          </div>
          <Slider
            min={0}
            max={2000}
            step={50}
            value={valorRange}
            onValueChange={onValorChange}
            className="w-full"
          />
        </div>

        <div className="hidden xl:block w-px h-8 bg-border mx-2" />

        <Select
          value={statusFilter}
          onValueChange={(val) => onStatusChange(val as StatusFiltro)}
        >
          <SelectTrigger className="h-10 border-none bg-transparent focus:ring-0 shadow-none w-full xl:w-32 text-sm text-muted-foreground">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            <SelectItem value="Todos" className="cursor-pointer">Todos</SelectItem>
            <SelectItem value="Ativo" className="cursor-pointer">Ativo</SelectItem>
            <SelectItem value="Inativo" className="cursor-pointer">Inativo</SelectItem>
          </SelectContent>
        </Select>

        <div className="hidden xl:block w-px h-8 bg-border mx-2" />

        <div className="relative flex-1 group flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
          <Input
            type="search"
            placeholder="Pesquisar serviço..."
            className="pl-9 border-none bg-transparent focus-visible:ring-0 h-10 w-full text-sm shadow-none"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Button
          variant="secondary"
          className="w-full xl:w-auto h-10 bg-zinc-200 text-zinc-700 hover:bg-zinc-300 rounded-lg cursor-pointer ml-0 xl:ml-2"
          onClick={onClearFilters}
        >
          Limpar filtros
        </Button>

      </div>
    </div>
  )
}