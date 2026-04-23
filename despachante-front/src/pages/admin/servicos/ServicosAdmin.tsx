import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import ToolbarServicos, { type StatusFiltro } from "@/components/sections/admin/servicos/ToolbarServicos"
import ServicosTable from "@/components/tables/ServicosTable"
import { mockServicos, type Servico } from "@/mocks/mockServicos"
import ModalConfirmacaoServico, { type TipoModalServico } from "@/components/admin/servicos/ModalConfirmacaoServico.tsx"

const ITEMS_PER_PAGE = 9

// Valores iniciais extraídos como constante para reusar no reset
const PRAZO_INICIAL: number[] = [0, 30]
const VALOR_INICIAL: number[] = [0, 2000]

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

  // Corrigido: iniciados com [min, max] para ativar os dois handles no Slider
  const [prazoRange, setPrazoRange] = useState<number[]>(PRAZO_INICIAL)
  const [valorRange, setValorRange] = useState<number[]>(VALOR_INICIAL)

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

      // Corrigido: filtra pelo range de prazo
      const matchPrazo =
        s.prazoEstimado == null ||
        (s.prazoEstimado >= prazoRange[0] && s.prazoEstimado <= prazoRange[1])

      // Corrigido: filtra pelo range de valor
      const matchValor =
        s.valorBase == null ||
        (s.valorBase >= valorRange[0] && s.valorBase <= valorRange[1])

      return matchStatus && matchSearch && matchPrazo && matchValor
    })
  }, [servicos, statusFilter, searchQuery, prazoRange, valorRange])

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

  const handlePrazoChange = (value: number[]) => {
    setPrazoRange(value)
    setCurrentPage(1)
  }

  const handleValorChange = (value: number[]) => {
    setValorRange(value)
    setCurrentPage(1)
  }

  // Corrigido: reseta todos os filtros incluindo os ranges
  const handleClearFilters = () => {
    setStatusFilter("Todos")
    setSearchQuery("")
    setPrazoRange(PRAZO_INICIAL)
    setValorRange(VALOR_INICIAL)
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
      {/* Corrigido: todas as props agora passadas corretamente */}
      <ToolbarServicos
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        prazoRange={prazoRange}
        valorRange={valorRange}
        onStatusChange={handleStatusChange}
        onSearchChange={handleSearchChange}
        onPrazoChange={handlePrazoChange}
        onValorChange={handleValorChange}
        onClearFilters={handleClearFilters}
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
