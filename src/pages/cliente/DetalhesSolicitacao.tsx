import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Check, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DetalhesSolicitacao() {
  const { id } = useParams();
  const navigate = useNavigate();

  const solicitacao = {
    id,
    codigo: "SOL-260317-2122",
    status: "Recebido",
    veiculo: "DEF-5678 - Honda Civic",
    valor: "R$ 120,00",
    dataSolicitacao: "17/03/2026",
    prazo: "21/03/2026",
    documentos: [
      {
        nome: "comprovante_residencia.pdf",
        tipo: "PDF Document",
        status: "Validado",
      },
      {
        nome: "foto_carro.jpg",
        tipo: "JPEG Image",
        status: "Aguardando revisão",
      },
      {
        nome: "foto_documento.png",
        tipo: "PNG Image",
        status: "Negado",
      },
    ],
  };

  const etapas = [
    "Recebido",
    "Andamento",
    "Aguardando Pagamento",
    "Aguardando Documento",
    "Concluído",
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          className="mt-1"
          onClick={() => navigate("/cliente/solicitacoes/historico")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-lg md:text-xl font-semibold text-[#0F2A44]">
              Emissão de CRLV
            </h1>

            <div className="flex items-center gap-2 bg-[#E5E7EA] text-[#4D5461] px-3 py-1 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-[#4D5461] rounded-full"></span>
              {solicitacao.status}
            </div>
          </div>

          <span className="text-sm text-[#7F838F] mt-1">
            {solicitacao.codigo}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-zinc-200">
          <div className="p-4">
            <p className="text-[#7F838F] text-sm mb-2">Veículo</p>
            <p className="font-medium">{solicitacao.veiculo}</p>
          </div>
        </Card>

        <Card className="border border-zinc-200">
          <div className="p-4">
            <p className="text-[#7F838F] text-sm mb-2">Valor base</p>
            <p className="text-green-600 font-semibold">
              {solicitacao.valor}
            </p>
          </div>
        </Card>

        <Card className="border border-zinc-200">
          <div className="p-4">
            <p className="text-[#7F838F] text-sm mb-2">Datas</p>

            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">Solicitação</span>
                <span className="font-medium text-zinc-900">
                  {solicitacao.dataSolicitacao}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">Prazo</span>
                <span className="font-medium text-zinc-900">
                  {solicitacao.prazo}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border border-zinc-200">
        <div className="px-6 py-4 border-b border-zinc-200 bg-[#F9FAFB]">
          <h2 className="text-sm font-medium text-zinc-900">
            Progresso
          </h2>
        </div>

        <CardContent className="pt-6 bg-[#F9FAFB]">
          <div className="flex items-center justify-between relative">
            {etapas.map((etapa, index) => {
              const ativo = etapa === solicitacao.status;

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center relative"
                >
                  {index !== etapas.length - 1 && (
                    <div className="absolute top-5 left-1/2 w-full h-[3px] bg-gray-300 z-0"></div>
                  )}

                  <div
                    className={`z-10 w-12 h-12 flex items-center justify-center rounded-full border-4 ${
                      ativo
                        ? "border-green-600"
                        : "border-gray-400"
                    } bg-white`}
                  >
                    <Check
                      className={`w-6 h-6 ${
                        ativo ? "text-green-600" : "text-gray-400"
                      }`}
                      strokeWidth={3}
                    />
                  </div>

                  <span className="text-xs mt-2 text-center text-zinc-900">
                    {etapa}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-zinc-200">
        <div className="px-6 py-4 border-b border-zinc-200 bg-[#F9FAFB]">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-[#002749]" />
            <h2 className="text-sm font-medium text-black">
              Documentos enviados
            </h2>
          </div>
        </div>

        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-[#7F838F]">
              <tr className="border-b border-gray-200">
                <th className="py-3 px-6 font-medium">Arquivo</th>
                <th className="font-medium">Tipo</th>
                <th className="font-medium">Status</th>
                <th className="font-medium text-right pr-6">Ações</th>
              </tr>
            </thead>

            <tbody>
              {solicitacao.documentos.map((doc, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 px-6">{doc.nome}</td>
                  <td className="text-gray-500">{doc.tipo}</td>
                  <td>
                    <Badge
                      className={
                        doc.status === "Validado"
                          ? "bg-[#43B75D] text-white"
                          : doc.status === "Negado"
                            ? "bg-[#F16965] text-white"
                            : "bg-[#FFBB33] text-white"
                      }
                    >
                      {doc.status}
                    </Badge>
                  </td>
                  <td className="text-right pr-6">
                    <Button size="icon" variant="ghost">
                      <Download className="w-4 h-4 text-gray-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
