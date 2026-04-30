import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";

// ✅ Tipos definidos corretamente
type Status = "Gerado" | "Erro" | "Andamento";

export interface Report {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  dataGeracao: string; // usado na tabela
  periodoInicio: string;
  periodoFim: string;
  status: Status;
  urlDocumento?: string;
}

type Props = {
  report: Report | null;
  open: boolean;
  onClose: () => void;
};

export function ReportModal({ report, open, onClose }: Props) {
  // ✅ Garantia contra null
  if (!open || !report) return null;

  const r = report;

  // ✅ Abrir PDF
  function handleOpenPDF() {
    if (r.urlDocumento) {
      window.open(r.urlDocumento, "_blank");
    }
  }

  async function handleDownloadPDF() {
    if (!r.urlDocumento) return;

    try {
      const res = await fetch(r.urlDocumento.trim());

      if (!res.ok) {
        throw new Error("Erro ao baixar arquivo");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      const nomeSeguro = (r.nome || "relatorio")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9-_ ]/g, "");

      a.href = url;
      a.download = `${nomeSeguro}.pdf`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar arquivo:", error);
    }    
  }

  const statusColor: Record<Status, string> = {
    Gerado: "bg-green-500",
    Erro: "bg-red-500",
    Andamento: "bg-yellow-500",
  };

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
          {r.nome} — {r.periodoInicio} a {r.periodoFim}
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
            <p className="font-medium text-gray-700 wrap-break-word max-w-95">
              {r.descricao}
            </p>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Período</span>
            <span className="font-medium text-gray-700">
              {r.periodoInicio} — {r.periodoFim}
            </span>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mt-4 flex flex-col items-center text-center">
          <FileText size={46} className="text-gray-700 mb-4" />
          <p className="text-sm font-semibold text-gray-700">
            Pré-visualização do PDF
          </p>
          <span className="text-xs text-muted-foreground">
            Baixe para visualizar o documento completo
          </span>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleOpenPDF}
            disabled={!r.urlDocumento}
          >
            Abrir PDF
          </Button>

          <Button onClick={handleDownloadPDF} disabled={!r.urlDocumento}>
            Baixar PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
