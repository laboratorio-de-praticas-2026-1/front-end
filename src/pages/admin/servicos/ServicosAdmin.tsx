import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import ToolbarServicos, { type StatusFiltro } from "@/components/sections/admin/servicos/ToolbarServicos"
import ServicosTable from "@/components/tables/ServicosTable"
import ModalConfirmacaoServico, { type TipoModalServico } from "@/components/admin/servicos/ModalConfirmacaoServico"

import { servicosService } from "@/services/servicoService"

import { type Servico } from "@/mocks/mockServicos"

const ITEMS_PER_PAGE = 9

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
  const [servicos, setServicos] = useState<Servico[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [modalLoading, setModalLoading] = useState(false)

  const [prazoRange, setPrazoRange] = useState<number[]>(PRAZO_INICIAL)
  const [valorRange, setValorRange] = useState<number[]>(VALOR_INICIAL)

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
    serviceId: null,
  })

  const servicoAtual =
    servicos.find((s) => s.id === modalState.serviceId) ?? null

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)

        const data = await servicosService.listarTodos()

        console.log("DADOS DA API:", data) 

        const adaptados = data.map((s) => ({
          id: s.id,
          nome: s.nome,
          descricao: s.descricao ?? "",
          valorBase: Number(s.valorBase) ?? 0,
          prazoEstimado: s.prazoEstimadoDias ?? 0,
          status: (s.ativo ? "Ativo" : "Inativo") as "Ativo" | "Inativo",
        }))

        console.log("ADAPTADOS:", adaptados) 

        setServicos(adaptados)
      } catch (e) {
        console.error(e)
        setError("Erro ao carregar serviços")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const servicosFiltrados = useMemo(() => {
    return servicos.filter((s) => {
      const matchStatus =
        statusFilter === "Todos" || s.status === statusFilter

      const matchSearch =
        searchQuery.trim() === "" ||
        s.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.descricao.toLowerCase().includes(searchQuery.toLowerCase())

      const matchPrazo =
        s.prazoEstimado >= prazoRange[0] && s.prazoEstimado <= prazoRange[1]

      const matchValor =
        s.valorBase >= valorRange[0] && s.valorBase <= valorRange[1]

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
      if (modalState.type === "excluir") {
        await servicosService.deletar(modalState.serviceId)

        setServicos((prev) =>
          prev.filter((s) => s.id !== modalState.serviceId)
        )
      } else {
        const novoStatus = modalState.type === "ativar"

        await servicosService.atualizar(modalState.serviceId, {
          ativo: novoStatus,
        })

        setServicos((prev) =>
          prev.map((s) =>
            s.id === modalState.serviceId
              ? { ...s, status: novoStatus ? "Ativo" : "Inativo" }
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

  if (loading) return <p className="text-center py-10">Carregando...</p>
  if (error) return <p className="text-center py-10">{error}</p>

  return (
    <div className="flex flex-col gap-6">
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