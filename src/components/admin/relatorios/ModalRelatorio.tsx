import { FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"

// ✅ Tipos definidos corretamente
type Status = "Gerado" | "Erro" | "Andamento"

export interface Report {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  data: string; // usado na tabela
  dataInicio: string;
  dataFim: string;
  status: Status;
  pdfUrl?: string;
}

type Props = {
  report: Report | null
  open: boolean
  onClose: () => void
}

export function ReportModal({ report, open, onClose }: Props){

  // ✅ Garantia contra null
  if (!open || !report) return null

  const r = report 

  // ✅ Abrir PDF
  function handleOpenPDF() {
    if (r.pdfUrl) {
      window.open(r.pdfUrl, "_blank")
    }
  }

  function handleDownloadPDF() {
    if (!r.pdfUrl) return

    const link = document.createElement("a")
    link.href = r.pdfUrl
    link.download = `${r.nome}.pdf`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const statusColor: Record<Status, string> = {
    Gerado: "bg-green-500",
    Erro: "bg-red-500",
    Andamento: "bg-yellow-500",
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* HEADER */}
        <h2 className="text-lg font-semibold mb-4">
          {r.nome} — {r.dataInicio} a {r.dataFim}
        </h2>

        {/* BODY */}
        <div className="border border-gray-300 rounded-lg p-4 space-y-3">

          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span
              className={`text-white font-semibold text-xs px-3 py-1 rounded-full ${statusColor[r.status]}`}
            >
              {r.status}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Tipo de relatório</span>
            <span className="font-medium text-gray-700">{r.categoria}</span>
          </div>

          <div>
            <span className="text-muted-foreground block mb-1">Descrição</span>
            <p className="font-medium text-gray-700 wrap-break-word max-w-95">{r.descricao}</p>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Período</span>
            <span className="font-medium text-gray-700">{r.dataInicio} — {r.dataFim}</span>
          </div>

        </div>

        {/* PREVIEW */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mt-4 flex flex-col items-center text-center">
          <FileText size={46} className="text-gray-700 mb-4" />
          <p className="text-sm font-semibold text-gray-700">Pré-visualização do PDF</p>
          <span className="text-xs text-muted-foreground">
            Baixe para visualizar o documento completo
          </span>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">

          <Button
            variant="outline"
            onClick={handleOpenPDF}
            disabled={!r.pdfUrl}
          >
            Abrir PDF
          </Button>

          <Button
            onClick={handleDownloadPDF}
            disabled={!r.pdfUrl}
          >
            Baixar PDF
          </Button>

        </div>


      </div>
    </div>
  )
}