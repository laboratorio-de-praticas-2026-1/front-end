import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import ToolbarServicos, { type StatusFiltro } from "@/components/sections/admin/servicos/ToolbarServicos"
import ServicosTable from "@/components/tables/ServicosTable"
import { mockServicos, type Servico } from "@/mocks/mockServicos"
import ModalConfirmacaoServico, { type TipoModalServico } from "@/components/admin/servicos/ModalConfirmacaoServico.tsx"

const ITEMS_PER_PAGE = 9

type ModalState = {
  isOpen: boolean
  type: TipoModalServico | null
  serviceId: number | null
}

export function ServicosAdmin() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<StatusFiltro>("Todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [servicos, setServicos] = useState<Servico[]>(mockServicos)
  const [modalLoading, setModalLoading] = useState(false)

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
    serviceId: null,
  })

  const servicoAtual = servicos.find((s) => s.id === modalState.serviceId) ?? null

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
    navigate(`/admin/servicos/editar/${servico.id}`)
  }

  const handleAlternarStatus = (servico: Servico) => {
    setModalState({
      isOpen: true,
      type: servico.status === "Ativo" ? "inativar" : "ativar",
      serviceId: servico.id,
    })
  }

  const handleExcluir = (servico: Servico) => {
    setModalState({
      isOpen: true,
      type: "excluir",
      serviceId: servico.id,
    })
  }

  const handleFecharModal = () => {
    setModalState({ isOpen: false, type: null, serviceId: null })
  }

  const handleConfirmarModal = async () => {
    if (!modalState.type || !modalState.serviceId) return

    setModalLoading(true)
    try {
      // TODO: integração com API
      await new Promise((res) => setTimeout(res, 600))

      if (modalState.type === "excluir") {
        setServicos((prev) => prev.filter((s) => s.id !== modalState.serviceId))
      } else {
        setServicos((prev) =>
          prev.map((s) =>
            s.id === modalState.serviceId
              ? { ...s, status: modalState.type === "ativar" ? "Ativo" : "Inativo" }
              : s
          )
        )
      }

      handleFecharModal()
    } catch (error) {
      console.error("Erro ao executar ação:", error)
    } finally {
      setModalLoading(false)
    }
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
        onExcluir={handleExcluir}
      />

      {modalState.isOpen && modalState.type && servicoAtual && (
        <ModalConfirmacaoServico
          tipo={modalState.type}
          nomeServico={servicoAtual.nome}
          carregando={modalLoading}
          onConfirmar={handleConfirmarModal}
          onVoltar={handleFecharModal}
        />
      )}
    </div>
  )
}
