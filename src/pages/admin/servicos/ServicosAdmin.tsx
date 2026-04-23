import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import ToolbarServicos, { type StatusFiltro } from "@/components/sections/admin/servicos/ToolbarServicos"
import ServicosTable from "@/components/tables/ServicosTable"
import type { Servico } from "@/mocks/mockServicos"
import ModalConfirmacaoServico, { type TipoModalServico } from "@/components/admin/servicos/ModalConfirmacaoServico.tsx"
import { servicoService, type ServicoCms } from "@/services/servicoService"

const ITEMS_PER_PAGE = 9
const PRAZO_INICIAL: number[] = [0, 30]
const VALOR_INICIAL: number[] = [0, 2000]

type ModalState = {
    isOpen: boolean
    type: TipoModalServico | null
    serviceId: number | null
}

const normalizeServico = (servico: ServicoCms): Servico => ({
    id: Number(servico.id),
    nome: servico.nome || "Sem nome",
    descricao: servico.descricao || "",
    valorBase: Number(servico.valorBase || 0),
    prazoEstimado: Number(servico.prazoEstimadoDias || 0),
    status: servico.ativo ? "Ativo" : "Inativo",
})

export function ServicosAdmin() {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState<StatusFiltro>("Todos")
    const [searchQuery, setSearchQuery] = useState("")
    const [servicos, setServicos] = useState<Servico[]>([])
    const [carregandoBusca, setCarregandoBusca] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)

    const [prazoRange, setPrazoRange] = useState<number[]>(PRAZO_INICIAL)
    const [valorRange, setValorRange] = useState<number[]>(VALOR_INICIAL)

    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        type: null,
        serviceId: null,
    })

    useEffect(() => {
        const delay = setTimeout(async () => {
            setCarregandoBusca(true)
            try {
                const dados = await servicoService.buscarPorTermo(searchQuery)
                setServicos(dados.map(normalizeServico))
            } catch (error) {
                console.error("Erro ao buscar serviços:", error)
                setServicos([])
            } finally {
                setCarregandoBusca(false)
            }
        }, 350)

        return () => clearTimeout(delay)
    }, [searchQuery])

    const servicoAtual = servicos.find((s) => s.id === modalState.serviceId) ?? null

    const servicosFiltrados = useMemo(() => {
        return servicos.filter((s) => {
            const matchStatus = statusFilter === "Todos" || s.status === statusFilter
            const matchPrazo = s.prazoEstimado >= prazoRange[0] && s.prazoEstimado <= prazoRange[1]
            const matchValor = s.valorBase >= valorRange[0] && s.valorBase <= valorRange[1]

            return matchStatus && matchPrazo && matchValor
        })
    }, [servicos, statusFilter, prazoRange, valorRange])

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
            await new Promise((res) => setTimeout(res, 600))

            if (modalState.type === "excluir") {
                setServicos((prev) => prev.filter((s) => s.id !== modalState.serviceId))
            } else {
                setServicos((prev) =>
                    prev.map((s) =>
                        s.id === modalState.serviceId
                            ? { ...s, status: modalState.type === "ativar" ? "Ativo" : "Inativo" }
                            : s,
                    ),
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
                carregando={carregandoBusca}
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
