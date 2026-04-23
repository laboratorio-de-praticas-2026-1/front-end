"use client"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SquarePen, Trash2, ChevronRight, Loader2 } from "lucide-react"

export interface Publicidade {
  id: number
  imagem?: string
  titulo: string
  conteudo: string
  title?: string
  content?: string
}

interface PublicidadeTableProps {
  publicidades: Publicidade[]
  carregando: Boolean
  excluindoId?: number | null
  onExcluirPublicidade: (id: number) => Promise<void> | void
}

export default function PublicidadeTable({ publicidades, carregando, excluindoId, onExcluirPublicidade }: PublicidadeTableProps) {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  const totalPages = Math.ceil(publicidades.length / itemsPerPage) || 1
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = publicidades.slice(indexOfFirstItem, indexOfLastItem)

  const getPaginationItems = () => {
    const items = []
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
        <p>Buscando publicidades no banco de dados...</p>
      </div>
    )
  }

  if (!carregando && publicidades.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-zinc-500 bg-white rounded-xl shadow-sm border border-zinc-200 mt-6">
        <p className="text-lg font-medium text-zinc-800">Nenhuma publicidade encontrada</p>
        <p className="text-sm">As publicidades aparecerão aqui quando o back-end enviar algo.</p>
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
              <TableHead className="text-white font-medium w-32">Imagem</TableHead>
              <TableHead className="text-white font-medium min-w-[200px]">Título</TableHead>
              <TableHead className="text-white font-medium min-w-[350px]">Conteúdo</TableHead>
              <TableHead className="text-white font-medium text-right px-6 w-32">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="border-b border-zinc-200">
            {currentItems.map((item) => (
              <TableRow key={item.id} className="hover:bg-zinc-50 bg-white">
                <TableCell className="text-muted-foreground font-medium">{item.id}</TableCell>
                <TableCell>
                  {item.imagem ? (
                    <img src={item.imagem} alt="Thumb" className="w-20 h-14 object-cover rounded-md shadow-sm border border-zinc-200" />
                  ) : (
                    <div className="w-20 h-14 bg-zinc-100 rounded-md border border-zinc-200 flex items-center justify-center text-xs text-zinc-400 font-medium">Sem Foto</div>
                  )}
                </TableCell>
                <TableCell className="font-semibold text-zinc-800 truncate max-w-[200px]">{item.titulo || item.title || "Sem titulo"}</TableCell>
                <TableCell className="text-zinc-500 text-sm truncate max-w-[350px]">{item.conteudo || item.content || "-"}</TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`/admin/publicidade/editar/${item.id}`)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors cursor-pointer" title="Editar">
                      <SquarePen size={18} />
                    </button>
                    <button
                      onClick={() => onExcluirPublicidade(item.id)}
                      disabled={excluindoId === item.id}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      title={excluindoId === item.id ? "Excluindo..." : "Excluir"}
                    >
                      <Trash2 size={18} />
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
        <div className="hidden sm:block"></div>
        <div className="flex items-center justify-center gap-2 text-sm text-secondary">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="hover:text-primary font-medium disabled:opacity-30 cursor-pointer transition-all px-2"
          >
            Anterior
          </button>

          <div className="flex items-center gap-1">
            {getPaginationItems().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-md transition-all font-medium ${currentPage === page
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
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="disabled:opacity-30 cursor-pointer transition-all flex items-center font-medium hover:text-primary px-2"
          >
            Próxima <ChevronRight size={16} className="ml-1" />
          </button>
        </div>

        <div className="text-sm text-zinc-500 text-center sm:text-right">
          {publicidades.length} {publicidades.length === 1 ? 'resultado' : 'resultados'}
        </div>
      </div>
    </div>
  )
}
