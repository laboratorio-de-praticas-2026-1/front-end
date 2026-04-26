import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Loader2 } from "lucide-react"
import ServicoForm, { type ServicoFormData } from "@/components/sections/admin/servicos/ServicoForm"
import ModalConfirmacaoServico from "@/components/admin/servicos/ModalConfirmacaoServico"
import { servicosService } from "@/services/servicoService"

  type Servico = {
  id: number
  nome: string
  descricao: string
  valorBase: number
  prazoEstimadoDias: number
  status: "Ativo" | "Inativo"
}

export default function EditarServicoCMS() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [servico, setServico] = useState<Servico | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)

  function parseMoeda(valor: string): number {
  if (!valor) return 0

  return Number(
    valor
      .replace(/\./g, "") 
      .replace(",", ".")  
  )
}

  useEffect(() => {
    async function load() {
      try {
        setCarregando(true)

        if (!id) return

        const data = await servicosService.buscarPorId(Number(id))

        if (!data) {
          setServico(null)
          return
        }

        console.log("SERVIÇO API:", data)

        const adaptado = {
          id: data.id,
          nome: data.nome,
          descricao: data.descricao ?? "",
          valorBase: data.valorBase ? Number(data.valorBase) : 0,
          prazoEstimado: data.prazoEstimadoDias ?? 0,
          status: data.ativo ? "Ativo" : "Inativo",
        }

        setServico(adaptado)
      } catch (error) {
        console.error(error)
        setServico(null)
      } finally {
        setCarregando(false)
      }
    }

    load()
  }, [id])

  const handleSubmit = async (data: ServicoFormData) => {
    setSalvando(true)

    try {
      if (!id) return

      await servicosService.atualizar(Number(id), {
        nome: data.nome,
        descricao: data.descricao,
        valorBase: parseMoeda(data.valorBase),
        prazoEstimadoDias: data.prazoEstimado
          ? Number(data.prazoEstimado)
          : null,
        ativo: data.status === "Ativo",
      })

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
      if (!id) return

      await servicosService.deletar(Number(id))

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
