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
import { Clock, CalendarX, CalendarClock, ArrowUpRight } from "lucide-react";
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
    { name: "Solicitações em aberto", value: calcPct(emAberto), fill: "#D1D5DB" },
    { name: "Solicitações concluídas", value: calcPct(concluido), fill: "#1B2A4A" },
    { name: "Documentos pendentes", value: calcPct(docPendentes), fill: "#3AADE4" },
  ];

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

  const taxaCancelamentoPct = cancelado > 0 ? calcPct(cancelado).toFixed(1).replace(".", ",") : "6,8";

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
      <span className="text-3xl font-extrabold text-[#1B2A4A] mb-8 block tracking-tight">
        Solicitações
      </span>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        
        {/* Donut Card */}
        <Card className="border-[#E5E7EB] shadow-sm rounded-2xl lg:col-span-3">
          <CardHeader className="pb-0 pt-6">
            <CardTitle className="text-base font-bold text-center text-[#333333]">
              Gráfico - Solicitações
            </CardTitle>
            <p className="text-xs text-muted-foreground text-center mt-1">
              Janeiro - Abril 2026
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-6 pb-6">
            <div className="flex items-center justify-center gap-8 w-full">
              <div className="relative">
                <ResponsiveContainer width={170} height={170}>
                  <PieChart className="z-10">
                    <Pie
                      data={grafico}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
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
                          typeof value === "number" ? value : Number(value ?? 0);
                        return `${Number.isFinite(numericValue) ? numericValue : 0}%`;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-1 mt-1">
                  <span className="text-3xl font-extrabold text-[#333333] leading-none">
                    24
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium mt-1">
                    Solicitações
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                {grafico.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[#4B5563]">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.fill }}
                    />
                    {item.name} <span className="font-semibold text-[#333333]">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 w-full flex flex-col items-center text-xs space-y-1.5">
              <div className="font-medium text-[#4B5563] flex items-center gap-1.5">
                Taxa de cancelamento: <span className="font-bold text-[#333333]">{taxaCancelamentoPct}%</span>
                <ArrowUpRight className="w-3.5 h-3.5 font-bold text-[#333333]" />
              </div>
              <div className="text-[#6B7280]">
                Total de créditos em aberto: 15.400
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info cards Laterais */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card className="border-[#E5E7EB] shadow-sm rounded-2xl flex-1">
            <CardContent className="flex items-center gap-5 p-6 h-full">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#002845] shrink-0 shadow-sm">
                <CalendarClock className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-3xl font-extrabold text-[#8A8A8A] leading-none">
                  {s?.proximasDeVencer ? s.proximasDeVencer.quantidade : "0"}
                </div>
                <div className="text-sm font-medium text-[#6B7280] mt-1 leading-tight">
                  Próximas de<br/>vencer
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-[#E5E7EB] shadow-sm rounded-2xl flex-1">
            <CardContent className="flex items-center gap-5 p-6 h-full">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#F5A623] shrink-0 shadow-sm">
                <CalendarX className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-3xl font-extrabold text-[#8A8A8A] leading-none">
                  {s?.foraDoPrazo ? s.foraDoPrazo.quantidade : "42"}
                </div>
                <div className="text-sm font-medium text-[#6B7280] mt-1 leading-tight">
                  Fora do prazo
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tempo médio por serviço */}
      <Card className="border-[#E5E7EB] shadow-sm rounded-2xl relative pb-4">
        <CardHeader className="pt-6 pb-8">
          <CardTitle className="text-lg font-extrabold text-[#333333] text-center">
            Tempo médio de conclusão por serviço (Em dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tempoMedio.length > 0 ? (
            <div className="relative">
              <ResponsiveContainer
                width="100%"
                height={Math.max(200, tempoMedio.length * 60)}
              >
                <BarChart
                  layout="vertical"
                  data={tempoMedio}
                  margin={{ left: 8, right: 100 }}
                  barGap={-20} // CORREÇÃO AQUI: Em vez de porcentagem, usamos o negativo do barSize exato (20px)
                >
                  <CartesianGrid horizontal={false} stroke="#F3F4F6" vertical={true} />
                  <XAxis
                    type="number"
                    domain={[0, maxDias]}
                    tickFormatter={(v) => `${v} Dias`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="servico"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 13, fill: "#6B7280", fontWeight: 500 }}
                    width={110}
                  />
                  <Tooltip
                    cursor={{ fill: "#F9FAFB" }}
                  />
                  
                  <Bar
                    dataKey="prazo"
                    fill="#E5E7EB"
                    radius={0}
                    name="Prazo estimado"
                    barSize={20}
                  />
                  
                  <Bar
                    dataKey="dias"
                    fill="#002845"
                    radius={0}
                    name="Tempo real"
                    barSize={20}
                    label={{
                      position: "right",
                      formatter: (value: any) => `${String(value ?? 0).replace('.', ',')} dias`,
                      fontSize: 14,
                      fill: "#6B7280",
                      fontWeight: 600
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>

              <div className="absolute bottom-[-10px] right-4 flex items-center gap-4 border border-[#E5E7EB] rounded-xl px-5 py-3 bg-white shadow-sm z-10">
                <Clock className="w-7 h-7 text-[#1B2A4A]" />
                <div>
                  <div className="text-xs font-bold text-[#333333]">
                    Tempo médio geral
                  </div>
                  <div className="text-xs text-[#6B7280] mt-0.5">
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