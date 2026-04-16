import { useState, useMemo } from "react"
import ToolbarServicos, { type StatusFiltro } from "@/components/sections/admin/servicos/ToolbarServicos"
import ServicosTable from "@/components/tables/ServicosTable"
import { mockServicos, type Servico } from "@/mocks/mockServicos"

const ITEMS_PER_PAGE = 9

export function ServicosAdmin() {

  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<StatusFiltro>("Todos")
  const [searchQuery, setSearchQuery] = useState("")


  const [servicos, setServicos] = useState<Servico[]>(mockServicos)

  const servicosFiltrados = useMemo(() => {
    return servicos.filter((s) => {
      const matchStatus =
        statusFilter === "Todos" || s.status === statusFilter
      const matchSearch =
        searchQuery.trim() === "" ||
        s.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.descricao.toLowerCase().includes(searchQuery.toLowerCase())
      return matchStatus && matchSearch
    })
  }, [servicos, statusFilter, searchQuery])

  const totalResultados = servicosFiltrados.length

  const servicosPaginados = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return servicosFiltrados.slice(start, start + ITEMS_PER_PAGE)
  }, [servicosFiltrados, currentPage])


  const handleStatusChange = (value: StatusFiltro) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleEditar = (servico: Servico) => {
    // Back-end: navegar para /admin/servicos/:id/editar
    console.log("Editar serviço:", servico.id)
  }

  const handleAlternarStatus = (servico: Servico) => {
    // Back-end: chamar API de inativar/ativar e depois recarregar lista
    setServicos((prev) =>
      prev.map((s) =>
        s.id === servico.id
          ? { ...s, status: s.status === "Ativo" ? "Inativo" : "Ativo" }
          : s
      )
    )
  }




  return (
    <div className="flex flex-col gap-6">
      <ToolbarServicos
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        onStatusChange={handleStatusChange}
        onSearchChange={handleSearchChange}
      />

      <ServicosTable
        servicos={servicosPaginados}
        currentPage={currentPage}
        totalResultados={totalResultados}
        onPageChange={setCurrentPage}
        onEditar={handleEditar}
        onAlternarStatus={handleAlternarStatus}
      />


    </div>
  )
}
