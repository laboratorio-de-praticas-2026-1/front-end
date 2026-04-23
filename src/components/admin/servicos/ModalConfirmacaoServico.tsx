import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export type TipoModalServico = "excluir" | "ativar" | "inativar"

export interface ModalConfirmacaoServicoProps {
  tipo: TipoModalServico
  nomeServico: string
  carregando?: boolean
  onConfirmar: () => void
  onVoltar: () => void
}

const configModal: Record<
  TipoModalServico,
  {
    titulo: string
    descricao: (nome: string) => string
    labelBotao: string
    classeBotao: string
  }
> = {
  excluir: {
    titulo: "Excluir serviço?",
    descricao: (nome) =>
      `Tem certeza que deseja excluir o serviço ${nome}? O serviço será removido de todas as páginas de serviço do portal do cliente.`,
    labelBotao: "Excluir",
    classeBotao: "bg-red-500 hover:bg-red-600 text-white",
  },
  inativar: {
    titulo: "Inativar serviço?",
    descricao: (nome) =>
      `Tem certeza que deseja inativar o serviço ${nome}? O serviço será removido de todas as páginas de serviço do portal do cliente.`,
    labelBotao: "Inativar",
    classeBotao: "bg-red-500 hover:bg-red-600 text-white",
  },
  ativar: {
    titulo: "Ativar serviço?",
    descricao: (nome) =>
      `Tem certeza que deseja ativar o serviço ${nome}? O serviço será adicionado de todas as páginas de serviços do portal do cliente.`,
    labelBotao: "Ativar",
    classeBotao: "bg-primary hover:bg-primary/90 text-white",
  },
}

export default function ModalConfirmacaoServico({
  tipo,
  nomeServico,
  carregando = false,
  onConfirmar,
  onVoltar,
}: ModalConfirmacaoServicoProps) {
  const config = configModal[tipo]


  const antes = `Tem certeza que deseja ${tipo === "excluir" ? "excluir" : tipo === "ativar" ? "ativar" : "inativar"} o serviço `


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8">

        {/* Título */}
        <h2 className="text-xl font-bold text-slate-800 mb-3">
          {config.titulo}
        </h2>

        {/* Descrição */}
        <p className="text-slate-600 text-sm leading-relaxed mb-8">
          {antes}
          <strong className="text-slate-800">{nomeServico}</strong>
          {"? "}
          {tipo === "ativar"
            ? "O serviço será adicionado de todas as páginas de serviços do portal do cliente."
            : "O serviço será removido de todas as páginas de serviço do portal do cliente."}
        </p>

        {/* Botões */}
        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onVoltar}
            disabled={carregando}
            className="cursor-pointer"
          >
            Voltar
          </Button>

          <Button
            onClick={onConfirmar}
            disabled={carregando}
            className={`${config.classeBotao} cursor-pointer min-w-[90px]`}
          >
            {carregando ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              config.labelBotao
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
