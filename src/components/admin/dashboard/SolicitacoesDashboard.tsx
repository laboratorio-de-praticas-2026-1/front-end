import mockDashboard from "@/mocks/mockDashboard.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Clock, CalendarX, CalendarClock } from "lucide-react";
import type { DashboardSolicitacoesResponse } from "@/services/dashboardService";
import { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboardService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SolicitacoesDashboard() {
  const [s, setS] = useState<DashboardSolicitacoesResponse>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const porStatus = s?.porStatus;

  const recebido = porStatus?.recebido ?? 0;
  const emAndamento = porStatus?.emAndamento ?? 0;
  const aguardandoPagamento = porStatus?.aguardandoPagamento ?? 0;
  const aguardandoDocumento = porStatus?.aguardandoDocumento ?? 0;
  const concluido = porStatus?.concluido ?? 0;
  const cancelado = porStatus?.cancelado ?? 0;

  const totalSolicitacoes =
    recebido +
    emAndamento +
    aguardandoPagamento +
    aguardandoDocumento +
    concluido +
    cancelado;

  const emAberto =
    recebido + emAndamento + aguardandoPagamento + aguardandoDocumento;

  const docPendentes = mockDashboard.documentos.pendentes;

  const calcPct = (v: number) =>
    totalSolicitacoes > 0 ? Math.round((v / totalSolicitacoes) * 100) : 0;

  const grafico = [
    { name: "Em aberto", value: calcPct(emAberto), fill: "#D1D5DB" },
    { name: "Concluídas", value: calcPct(concluido), fill: "#1B2A4A" },
    { name: "Doc. pendentes", value: calcPct(docPendentes), fill: "#3AADE4" },
  ];

  // Tempo medio por servico
  const tempoMedio = (s?.tempoConclusaoPorServico ?? []).map((t) => ({
    id: t.servicoId,
    servico: t.servicoNome,
    dias: t.mediaRealDias,
    prazo: t.prazoEstimadoDias,
  }));

  const tempoMedioGeral =
    tempoMedio.length > 0
      ? (
          tempoMedio.reduce((acc, t) => acc + t.dias, 0) / tempoMedio.length
        ).toFixed(1)
      : "—";  

  const maxDias =
    tempoMedio.length > 0
      ? Math.max(...tempoMedio.map((t) => Math.max(t.dias, t.prazo))) + 2
      : 15;

  const taxaCancelamentoPct = calcPct(cancelado ?? 0);

  useEffect(() => {
    dashboardService
      .getSolicitacoes()
      .then((data) => {
        setS(data);
      })
      .catch((err) => {
        console.error(
          "Erro ao buscar dados do dashboard de solicitações:",
          err,
        );
        setErrorMessage(
          "Erro ao carregar dados do dashboard de solicitações. Por favor, tente novamente mais tarde.",
        );
      });
  }, []);

  return (
    <>
      <span className="text-2xl font-bold text-secondary mb-6 block">
        Solicitações
      </span>

      {/* Top row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Donut */}
        <Card className="border-[#D2D5DB] shadow-none lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-center">
              Gráfico — Solicitações
            </CardTitle>
            {/* <p className="text-xs text-muted-foreground text-center">
              Janeiro – Abril 2026
            </p> */}
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="flex items-center gap-6">
              <div className="relative">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart className="z-10">
                    <Pie
                      data={grafico}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={78}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      strokeWidth={0}
                    >
                      {grafico.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => {
                        const numericValue =
                          typeof value === "number"
                            ? value
                            : Number(value ?? 0);

                        return `${Number.isFinite(numericValue) ? numericValue : 0}%`;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-1">
                  <span className="text-2xl font-bold">
                    {totalSolicitacoes}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Solicitações
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {grafico.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: s.fill }}
                    />
                    {s.name} {s.value}%
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 w-full pt-3 text-xs text-muted-foreground text-center space-y-1">
              <div className="font-medium text-[#333333]">
                Taxa de cancelamento:{" "}
                <span className="font-semibold">{taxaCancelamentoPct}%</span>
              </div>
              {/* <div>
                Débitos em aberto: R${" "}
                {debitosEmAbertoValorTotal.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* Info cards */}
        <div className="flex flex-col gap-4">
          <Card className="border-[#D2D5DB] shadow-none flex-1">
            <CardContent className="flex items-center gap-4 p-5 h-full">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1B2A4A] shrink-0">
                <CalendarClock className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-muted-foreground">
                  {s?.proximasDeVencer ? s.proximasDeVencer.quantidade : "0"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Próximas de vencer
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#D2D5DB] shadow-none flex-1">
            <CardContent className="flex items-center gap-4 p-5 h-full">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F5A623] shrink-0">
                <CalendarX className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-muted-foreground">
                  {s?.foraDoPrazo ? s.foraDoPrazo.quantidade : "0"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Fora do prazo
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tempo médio por serviço */}
      <Card className="border-[#D2D5DB] shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-bold text-[#333333] text-center">
            Tempo médio de conclusão por serviço (Em dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tempoMedio.length > 0 ? (
            <div className="relative">
              <ResponsiveContainer
                width="100%"
                height={Math.max(120, tempoMedio.length * 60)}
              >
                <BarChart
                  layout="vertical"
                  data={tempoMedio}
                  margin={{ left: 8, right: 100 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid horizontal={false} stroke="#F0F0F0" />
                  <XAxis
                    type="number"
                    domain={[0, maxDias]}
                    tickFormatter={(v) => `${v}d`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="servico"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6C6C6C" }}
                    width={100}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      const numericValue =
                        typeof value === "number" ? value : Number(value ?? 0);

                      return [
                        `${Number.isFinite(numericValue) ? numericValue : 0} dias`,
                        name === "dias" ? "Tempo real" : "Prazo estimado",
                      ];
                    }}
                    cursor={{ fill: "#F3F4F6" }}
                  />
                  <Bar
                    dataKey="prazo"
                    fill="#D1D5DB"
                    radius={[4, 4, 4, 4]}
                    name="prazo"
                  />
                  <Bar
                    dataKey="dias"
                    fill="#1B2A4A"
                    radius={[4, 4, 4, 4]}
                    name="dias"
                    label={{
                      position: "right",
                      formatter: (value) => `${Number(value ?? 0)} dias`,
                      fontSize: 12,
                      fill: "#6C6C6C",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>

              <div className="absolute bottom-2 right-0 flex items-center gap-3 border border-[#E9E9E9] rounded-xl px-4 py-3 bg-white shadow-sm">
                <Clock className="w-6 h-6 text-muted-foreground" />
                <div>
                  <div className="text-xs font-bold text-secondary">
                    Tempo médio geral
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {tempoMedioGeral} Dias
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-sm">
              Nenhum serviço concluído no período
            </p>
          )}
        </CardContent>
      </Card>

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

          <div className="flex justify-end">
            <Button onClick={() => setErrorMessage(null)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
