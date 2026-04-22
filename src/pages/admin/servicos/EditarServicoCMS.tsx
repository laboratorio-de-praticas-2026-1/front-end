import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Loader2 } from "lucide-react"
import ServicoForm, { type ServicoFormData } from "@/components/sections/admin/servicos/ServicoForm"
import { mockServicos, type Servico } from "@/mocks/mockServicos"
import ModalConfirmacaoServico from "@/components/admin/servicos/ModalConfirmacaoServico"

export default function EditarServicoCMS() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [servico, setServico] = useState<Servico | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)

  // Simula busca dos dados pelo ID
  useEffect(() => {
    setCarregando(true)
    setTimeout(() => {
      const found = mockServicos.find((s) => s.id === Number(id))
      setServico(found ?? null)
      setCarregando(false)
    }, 400)
  }, [id])

  const handleSubmit = async (data: ServicoFormData) => {
    setSalvando(true)
    try {
      // TODO: integração com API
      console.log("Salvar serviço:", { id, ...data })
      await new Promise((res) => setTimeout(res, 500))
      navigate("/admin/servicos")
    } catch (error) {
      console.error("Erro ao salvar serviço:", error)
    } finally {
      setSalvando(false)
    }
  }

  const handleExcluir = () => {
    setModalExcluirAberto(true)
  }

  const handleConfirmarExclusao = async () => {
    setExcluindo(true)
    try {
      // TODO: integração com API
      await new Promise((res) => setTimeout(res, 600))
      navigate("/admin/servicos")
    } catch (error) {
      console.error("Erro ao excluir serviço:", error)
    } finally {
      setExcluindo(false)
      setModalExcluirAberto(false)
    }
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-32 text-zinc-400">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!servico) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
        <p className="text-lg font-medium text-zinc-800">Serviço não encontrado</p>
        <p className="text-sm mt-1">O serviço com ID #{id} não existe.</p>
      </div>
    )
  }

  return (
    <div className="p-1">
      <ServicoForm
        mode="editar"
        servico={servico}
        onSubmit={handleSubmit}
        onExcluir={handleExcluir}
        salvando={salvando}
      />

      {modalExcluirAberto && (
        <ModalConfirmacaoServico
          tipo="excluir"
          nomeServico={servico.nome}
          carregando={excluindo}
          onConfirmar={handleConfirmarExclusao}
          onVoltar={() => setModalExcluirAberto(false)}
        />
      )}
    </div>
  )
}
