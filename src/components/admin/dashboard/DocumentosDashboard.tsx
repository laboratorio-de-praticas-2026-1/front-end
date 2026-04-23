import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  dashboardService,
  type DashboardDocumentosResponse,
} from "@/services/dashboardService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DocumentosDashboard() {
  const [documentos, setDocumentos] =
    useState<DashboardDocumentosResponse>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);  

  const fetchData = () => {
    dashboardService
      .getDocumentos()
      .then((data) => {
        const normalizedData: DashboardDocumentosResponse = {
          pendentes: Number((data as any)?.pendentes ?? (data as any)?.pendentesValidacao ?? 0),
          aprovados: Number((data as any)?.aprovados ?? 0),
          rejeitados: Number((data as any)?.rejeitados ?? 0),
          solicitacoesTravadas: Number(
            (data as any)?.solicitacoesTravadas ??
              (data as any)?.solicitacoes_travadas ??
              0,
          ),
          rejeicoesPorTipo: Array.isArray((data as any)?.rejeicoesPorTipo)
            ? (data as any).rejeicoesPorTipo
            : Array.isArray((data as any)?.rejeicoes_por_tipo)
              ? (data as any).rejeicoes_por_tipo
              : [],
        };

        setDocumentos(normalizedData);
      })
      .catch((error) => {
        console.error(
          "Erro ao buscar dados do dashboard de documentos:",
          error,
        );
        setErrorMessage(
          "Erro ao carregar dados do dashboard de documentos. Tente recarregar a página.",
        );
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const summaryData = [
    { label: "Pendentes de avaliação", value: documentos?.pendentes ?? 0 },
    { label: "Aprovados (Período)", value: documentos?.aprovados ?? 0 },
    { label: "Rejeitados (Período)", value: documentos?.rejeitados ?? 0 },
    {
      label: "Solicitações travadas",
      value: documentos?.solicitacoesTravadas ?? 0,
    },
  ];

  const travadasData =
    documentos && documentos.rejeicoesPorTipo.length > 0
      ? documentos.rejeicoesPorTipo.map((item, index: number) => {
          const colors = ["#002749", "#093B66", "#3498DB", "#D5D5D5"];

          const tipoDocumento =
            (item as any)?.tipoDocumento ??
            (item as any)?.tipo_documento ??
            "Documento não informado";
          const totalRejeitados = Number(
            (item as any)?.totalRejeitados ??
              (item as any)?.total_rejeitados ??
              (item as any)?.quantidade ??
              0,
          );

          return {
            name: tipoDocumento,
            value: totalRejeitados,
            color: colors[index % colors.length],
          };
        }).filter((item) => item.value > 0)
      : [];

  return (
    <div className="p-6 space-y-8 bg-white min-h-screen font-sans">
      <div className="flex flex-row items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1D3557]">Documentos</h1>
      </div>

      {errorMessage ? (
        <div className="max-w-7xl mx-auto">
          <Dialog
            open={Boolean(errorMessage)}
            onOpenChange={(open) => {
              if (!open) {
                setErrorMessage(null);
              }
            }}
          >
            <DialogContent className="max-w-md bg-white">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-red-600">
                  Erro ao carregar dados
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  {errorMessage}
                </DialogDescription>
              </DialogHeader>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setErrorMessage(null)}>
                  Fechar
                </Button>                
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {summaryData.map((card, idx) => (
              <Card
                key={idx}
                className="rounded-3xl border border-gray-100 bg-white min-h-[160px] flex items-center"
              >
                <CardContent className="flex flex-row items-center p-8 space-x-8 w-full">
                  <div className="w-24 h-24 rounded-full border border-gray-100 shadow-[inset_0_4px_8px_rgba(0,0,0,0.12)] bg-white flex-shrink-0" />

                  <div className="flex flex-col justify-center">
                    <p className="text-[12px] text-black font-bold uppercase tracking-wider mb-2">
                      {card.label}
                    </p>
                    <span className="text-4xl font-black text-black">
                      {card.value}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-7xl mx-auto">
            <Card className="rounded-[40px] border border-gray-100 bg-white overflow-hidden">
              <CardHeader className="pt-10 px-10 pb-0">
                <CardTitle className="text-xl font-bold text-gray-800">
                  Solicitações travadas por falta de documentos                  
                </CardTitle>
              </CardHeader>
              {travadasData.length > 0 ? (
                // MÁGICA 1: Removido as alturas fixas gigantes (h-[520px] min-h-[360px])
                <CardContent className="px-10 pt-12 pb-12">
                  {/* MÁGICA 2: A altura agora acompanha a quantidade de barras, abraçando o gráfico sem deixar buracos */}
                  <ResponsiveContainer width="100%" height={Math.max(160, travadasData.length * 120)}>
                    <BarChart
                      layout="vertical"
                      data={travadasData}
                      margin={{ left: 0, right: 100, top: 40, bottom: 20 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" hide />

                      <Bar
                        dataKey="value"
                        radius={25} // CORREÇÃO EXTRA: Ajuste do radius para não estourar TS Error
                        barSize={55}
                      >
                        {travadasData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}

                        <LabelList
                          dataKey="name"
                          content={(props: any) => {
                            const { x, y, value } = props;
                            return (
                              <text
                                x={x}
                                y={y - 20}
                                fill="#000000"
                                fontSize="15"
                                fontWeight="700"
                                textAnchor="start"
                                className="font-sans"
                              >
                                {value}
                              </text>
                            );
                          }}
                        />

                        <LabelList
                          dataKey="value"
                          position="right"
                          style={{
                            fontSize: "24px",
                            fill: "#000000",
                            fontWeight: "900",
                            fontFamily: "sans-serif",
                          }}
                          offset={25}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              ) : (
                <CardContent className="min-h-[220px] px-10 pb-10 flex items-center justify-center">
                  <p className="text-gray-500 text-base text-center">
                    Nenhuma solicitação travada por falta de documentos no período.
                  </p>
                </CardContent>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}