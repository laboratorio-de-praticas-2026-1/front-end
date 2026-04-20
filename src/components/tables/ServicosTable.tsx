
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SquarePen, Trash2, RotateCcw, Ban, ChevronRight, Loader2 } from "lucide-react"
import type { Servico } from "@/mocks/mockServicos"

interface ServicosTableProps {
  servicos: Servico[]
  carregando?: boolean
  currentPage: number
  totalResultados: number
  onPageChange: (page: number) => void
  onEditar?: (servico: Servico) => void
  onAlternarStatus?: (servico: Servico) => void
  onExcluir?: (servico: Servico) => void
}

const ITEMS_PER_PAGE = 9

export default function ServicosTable({
  servicos,
  carregando = false,
  currentPage,
  totalResultados,
  onPageChange,
  onEditar,
  onAlternarStatus,
  onExcluir,
}: ServicosTableProps) {


  const totalPages = Math.ceil(totalResultados / ITEMS_PER_PAGE) || 1

  const getPaginationItems = () => {
    const items: number[] = []
    const maxVisiblePages = 3
    let startPage = Math.max(1, currentPage - 1)
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    for (let i = startPage; i <= endPage; i++) {
      items.push(i)
    }
    return items
  }

  if (carregando) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-zinc-500 bg-white rounded-xl shadow-sm border border-zinc-200 mt-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Carregando serviços...</p>
      </div>
    )
  }

  if (!carregando && servicos.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-zinc-500 bg-white rounded-xl shadow-sm border border-zinc-200 mt-6">
        <p className="text-lg font-medium text-zinc-800">Nenhum serviço encontrado</p>
        <p className="text-sm">Tente ajustar os filtros ou crie um novo serviço.</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden mt-6">
      <div className="w-full overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="bg-secondary">
            <TableRow className="hover:bg-secondary">
              <TableHead className="text-white font-medium w-16">ID</TableHead>
              <TableHead className="text-white font-medium min-w-[140px]">Nome</TableHead>
              <TableHead className="text-white font-medium min-w-[250px]">Descrição</TableHead>
              <TableHead className="text-white font-medium w-40">Valor base</TableHead>
              <TableHead className="text-white font-medium w-60 text-center">Prazo estimado (dias)</TableHead>
              <TableHead className="text-white font-medium w-40 text-center">Status</TableHead>
              <TableHead className="text-white font-medium text-right px-6 w-32">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="border-b border-zinc-200">
            {servicos.map((servico) => (
              <TableRow key={servico.id} className="hover:bg-zinc-50 bg-white">
                <TableCell className="text-muted-foreground font-medium">
                  #{String(servico.id).padStart(3, "0")}
                </TableCell>

                <TableCell className="font-semibold text-zinc-800">
                  {servico.nome}
                </TableCell>

                <TableCell className="text-zinc-500 text-sm truncate max-w-[220px]">
                  {servico.descricao}
                </TableCell>

                <TableCell className="text-zinc-700 font-medium">
                  {servico.valorBase.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>

                <TableCell className="text-zinc-600 text-sm text-center">
                  {servico.prazoEstimado} {servico.prazoEstimado === 1 ? "dia" : "dias"}
                </TableCell>

                <TableCell className="text-center">
                  {servico.status === "Ativo" ? (
                    <Badge className="bg-green-500 hover:bg-green-500 text-white border-transparent rounded-full px-3 py-0.5 text-xs font-semibold">
                      Ativo
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500 hover:bg-red-500 text-white border-transparent rounded-full px-3 py-0.5 text-xs font-semibold">
                      Inativo
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="text-right px-6">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEditar?.(servico)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <SquarePen size={17} />
                    </button>

                    <button
                      onClick={() => onAlternarStatus?.(servico)}
                      className={`p-2 rounded-md transition-colors cursor-pointer ${
                        servico.status === "Ativo"
                          ? "text-orange-500 hover:bg-orange-50"
                          : "text-green-600 hover:bg-green-50"
                      }`}
                      title={servico.status === "Ativo" ? "Inativar" : "Ativar"}
                    >
                      {servico.status === "Ativo" ? (
                        <Ban size={17} />
                      ) : (
                        <RotateCcw size={17} />
                      )}
                    </button>

                    <button
                      onClick={() => onExcluir?.(servico)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer Paginação */}
      <div className="py-4 grid grid-cols-1 sm:grid-cols-3 items-center border-t border-zinc-100 px-6 bg-white gap-4 sm:gap-0">
        <div className="hidden sm:block" />

        <div className="flex items-center justify-center gap-2 text-sm text-secondary">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="hover:text-primary font-medium disabled:opacity-30 cursor-pointer transition-all px-2"
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {getPaginationItems().map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-md transition-all font-medium ${
                  currentPage === page
                    ? "bg-primary text-white shadow-sm"
                    : "hover:bg-zinc-100 text-zinc-600 cursor-pointer"
                }`}
              >
                {page}
              </button>
            ))}
            {totalPages > 3 && currentPage < totalPages - 1 && (
              <span className="px-1 text-zinc-400">...</span>
            )}
          </div>

          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="disabled:opacity-30 cursor-pointer transition-all flex items-center font-medium hover:text-primary px-2"
          >
            Next <ChevronRight size={16} className="ml-1" />
          </button>
        </div>

        <div className="text-sm text-zinc-500 text-center sm:text-right">
          {totalResultados.toLocaleString("pt-BR")} {totalResultados === 1 ? "resultado" : "resultados"}
        </div>
      </div>
    </div>
  )
}
