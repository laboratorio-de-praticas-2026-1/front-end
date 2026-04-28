import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Info, CreditCard, Eye, Trash2, Save, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { Servico } from "@/mocks/mockServicos"

export type ServicoFormData = {
  nome: string
  descricao: string
  valorBase: string
  prazoEstimado: number
  status: "Ativo" | "Inativo"
}

interface ServicoFormProps {
  mode: "criar" | "editar"
  servico?: Servico
  onSubmit: (data: ServicoFormData) => void
  onExcluir?: () => void
  salvando?: boolean
}

function formatMoeda(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (!digits) return ""
  const number = parseFloat(digits) / 100
  return number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function ServicoForm({
  mode,
  servico,
  onSubmit,
  onExcluir,
  salvando = false,
}: ServicoFormProps) {
  const navigate = useNavigate()

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<ServicoFormData>({
    defaultValues: {
      nome: "",
      descricao: "",
      valorBase: "",
      prazoEstimado: 0,
      status: "Ativo",
    },
  })

  const statusAtual = watch("status")

  // Simula carregamento dos dados do mock ao editar
  useEffect(() => {
    if (mode === "editar" && servico) {
      reset({
        nome: servico.nome,
        descricao: servico.descricao,
        valorBase: servico.valorBase.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        prazoEstimado: servico.prazoEstimado,
        status: servico.status,
      })
    }
  }, [mode, servico, reset])

  const handleFormSubmit = (data: ServicoFormData) => {
    console.log("formData:", data)
    onSubmit(data)
  }

  const isEditar = mode === "editar"
  const idFormatado = servico ? `#${String(servico.id).padStart(3, "0")}` : ""

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-secondary">
              {isEditar ? `Detalhes do serviço ${idFormatado}` : "Criar novo serviço"}
            </h1>
            {isEditar && servico && (
              <Badge
                className={`rounded-full px-3 py-0.5 text-xs font-semibold border-transparent ${
                  statusAtual === "Ativo"
                    ? "bg-green-500 hover:bg-green-500 text-white"
                    : "bg-red-500 hover:bg-red-500 text-white"
                }`}
              >
                {statusAtual}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {isEditar
              ? "Gerencie e atualize as informações deste serviço."
              : "Preencha os campos abaixo para configurar seu novo serviço."}
          </p>
        </div>

        {isEditar && onExcluir && (
          <Button
            type="button"
            onClick={onExcluir}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 h-10 text-sm cursor-pointer"
          >
            <Trash2 size={15} />
            Excluir
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">

        {/* Card: Informações Gerais */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-100 bg-zinc-50/50">
            <Info size={18} className="text-secondary" />
            <h2 className="font-semibold text-zinc-800 text-sm">Informações Gerais</h2>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">
                Nome do serviço <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("nome", { required: "Nome obrigatório" })}
                placeholder=""
                className="h-10 border-zinc-300 focus-visible:ring-primary"
              />
              {errors.nome && (
                <p className="text-xs text-red-500">{errors.nome.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">
                Descrição detalhada <span className="text-red-500">*</span>
              </label>
              <Textarea
                {...register("descricao", { required: "Descrição obrigatória" })}
                rows={4}
                className="border-zinc-300 focus-visible:ring-primary resize-none"
              />
              {errors.descricao && (
                <p className="text-xs text-red-500">{errors.descricao.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Card: Precificação e prazo */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-100 bg-zinc-50/50">
            <CreditCard size={18} className="text-secondary" />
            <h2 className="font-semibold text-zinc-800 text-sm">Precificação e prazo</h2>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Valor base com máscara monetária */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">
                Valor base (R$) <span className="text-red-500">*</span>
              </label>
              <Controller
                name="valorBase"
                control={control}
                rules={{ required: "Valor obrigatório" }}
                render={({ field }) => (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">R$</span>
                    <Input
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(formatMoeda(e.target.value))
                      }}
                      className="h-10 pl-9 border-zinc-300 focus-visible:ring-primary"
                      placeholder="0,00"
                    />
                  </div>
                )}
              />
              {errors.valorBase && (
                <p className="text-xs text-red-500">{errors.valorBase.message}</p>
              )}
            </div>

            {/* Prazo estimado */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">
                Prazo estimado (Dias) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min={0}
                  {...register("prazoEstimado", {
                    required: "Prazo obrigatório",
                    valueAsNumber: true,
                    min: { value: 0, message: "Mínimo 0 dias" },
                  })}
                  className="h-10 border-zinc-300 focus-visible:ring-primary pr-24"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 pointer-events-none">
                  dias úteis
                </span>
              </div>
              {errors.prazoEstimado && (
                <p className="text-xs text-red-500">{errors.prazoEstimado.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Card: Status do serviço */}
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Eye size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-800 text-sm">Status do serviço</p>
                    <p className="text-xs text-muted-foreground">
                      Serviços inativos não aparecem no catálogo público.
                    </p>
                  </div>
                </div>

                {/* Toggle switch */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => field.onChange(field.value === "Ativo" ? "Inativo" : "Ativo")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
                      field.value === "Ativo" ? "bg-primary" : "bg-zinc-300"
                    }`}
                    aria-label="Toggle status"
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        field.value === "Ativo" ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className={`text-sm font-semibold ${field.value === "Ativo" ? "text-primary" : "text-zinc-400"}`}>
                    {field.value === "Ativo" ? "ATIVO" : "INATIVO"}
                  </span>
                </div>
              </div>
            </div>
          )}
        />

        {/* Rodapé com botões */}
        <div className="flex items-center justify-end gap-3 pt-2 pb-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/admin/servicos")}
            className="text-sm text-zinc-600 hover:text-zinc-800 cursor-pointer"
          >
            {isEditar ? "Cancelar alterações" : "Cancelar criação"}
          </Button>

          <Button
            type="submit"
            disabled={salvando}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg px-5 h-10 text-sm cursor-pointer"
          >
            {salvando ? (
              <Loader2 size={15} className="animate-spin" />
            ) : isEditar ? (
              <Save size={15} />
            ) : (
              <Plus size={15} />
            )}
            {isEditar ? "Salvar serviço" : "Criar serviço"}
          </Button>
        </div>
      </form>
    </div>
  )
}