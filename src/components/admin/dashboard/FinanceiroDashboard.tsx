import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  dashboardService,
  type DashboardFinanceiroResponse,
} from "@/services/dashboardService";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const COLORS = ["#D5D5D5", "#002749", "#3498DB"];
const PAYMENT_LABELS: Record<string, string> = {
  cartao: "Cartão",
  pix: "Pix",
  avista: "À vista",
  parcelado: "Parcelado",
};

const getPaymentLabel = (value: string) =>
  PAYMENT_LABELS[value.toLowerCase()] ?? value;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const getMonthName = (dateStr: string) => {
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const parts = dateStr.split("-");
  const monthIndex = parseInt(parts[1]) - 1;
  return months[monthIndex];
};

export default function FinanceiroDashboard() {
  const [data, setData] = useState<DashboardFinanceiroResponse>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    dashboardService
      .getFinanceiro()
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados do dashboard financeiro:", error);
        setErrorMessage(
          "Erro ao carregar dados do dashboard financeiro. Por favor, tente novamente mais tarde.",
        );
      });
  }, []);

  const historicoRecente = data?.historicoMensal?.slice(-6) ?? [];

  const porMetodoPagamento = (data?.porMetodoPagamento ?? []).map((m) => ({
    metodo: m.metodo,
    label: getPaymentLabel(m.metodo),
    valorTotal: m.valorTotal,
  }));
  const porTipoPagamento = (data?.porTipoPagamento ?? []).map((t) => ({
    tipo: t.tipo,
    label: getPaymentLabel(t.tipo),
    valorTotal: t.valorTotal,
  }));

  const totalMetodoPagamento = porMetodoPagamento.reduce(
    (sum, item) => sum + item.valorTotal,
    0,
  );

  const totalTipoPagamento = porTipoPagamento.reduce(
    (sum, item) => sum + item.valorTotal,
    0,
  );

  return (
    <>
      <div className="p-6 space-y-8 bg-white min-h-screen font-sans">
        <div className="flex flex-row items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-[#002749]">Financeiro</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            {
              label: "Receita total realizada no período",
              value: data?.receitaRealizada ?? 0,
            },
            { label: "Receita pendente", value: data?.receitaPendente ?? 0 },
            { label: "Receita de taxa", value: data?.receitaTaxa ?? 0 },
            {
              label: "Receita média mensal geral",
              value: data?.mediaMensalReceita ?? 0,
            },
          ].map((card, i) => (
            <Card
              key={i}
              className="rounded-2xl border border-gray-100 bg-white min-h-[150px] flex items-center"
            >
              <CardContent className="flex flex-row items-center p-6 space-x-5 w-full">
                <div className="w-20 h-20 rounded-full border border-gray-100 shadow-[inset_0_4px_6px_rgba(0,0,0,0.05)] bg-gray-50 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-2 leading-tight">
                    {card.label}
                  </p>
                  <span className="text-xl font-black text-[#4A4A4A]">
                    {formatCurrency(card.value)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          <Card className="lg:col-span-6 rounded-[40px] border border-gray-50 p-8 bg-white">
            <div className="text-center mb-6">
              <h3 className="font-bold text-gray-800 text-lg">
                Gráfico - Histórico mensal da receita
              </h3>
              <p className="text-xs text-gray-400">Últimos 30 dias</p>
            </div>
            <div className="h-64 px-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={historicoRecente}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="#F3F4F6"
                    strokeDasharray="0"
                  />
                  <XAxis
                    dataKey="mes"
                    tickFormatter={getMonthName}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9CA3AF", fontWeight: 500 }}
                    dy={15}
                  />
                  <YAxis
                    domain={[0, "dataMax + 50"]}
                    axisLine={false}
                    tickLine={false}
                    tick={false}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    formatter={(value) => formatCurrency(Number(value ?? 0))}
                  />
                  <ReferenceLine
                    y={0}
                    stroke="#E5E7EB"
                    strokeWidth={2}
                    strokeDasharray="0"
                  />
                  <Bar
                    dataKey="receitaRealizada"
                    radius={[10, 10, 10, 10]}
                    barSize={45}
                  >
                    {historicoRecente.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === historicoRecente.length - 1
                            ? "#002749"
                            : "#3498DB"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="lg:col-span-6 rounded-[40px] border border-gray-50 p-8 bg-white flex flex-col md:flex-row justify-around items-center relative">
            <div className="flex flex-col items-center w-full">
              <p className="text-[18px] font-bold text-[#002749] mb-4 text-center px-2 leading-tight min-h-[48px]">
                Distribuição por método de pagamento
              </p>
              <PieChart width={200} height={200}>
                <Pie
                  data={porMetodoPagamento}
                  innerRadius={65}
                  outerRadius={95}
                  dataKey="valorTotal"
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  {porMetodoPagamento.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
              <div className="flex gap-6 mt-4">
                {porMetodoPagamento.map((item, index) => {
                  const percent =
                    totalMetodoPagamento > 0
                      ? (
                          (item.valorTotal / totalMetodoPagamento) *
                          100
                        ).toFixed(0)
                      : 0;

                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-[14px] font-bold text-black">
                          {item.label} {percent}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="h-3/4 w-[2px] bg-gray-100 hidden md:block mx-4" />

            <div className="flex flex-col items-center w-full mt-8 md:mt-0">
              <p className="text-[18px] font-bold text-[#002749] mb-4 text-center px-2 leading-tight min-h-[48px]">
                Distribuição por tipo de pagamento
              </p>
              <PieChart width={200} height={200}>
                <Pie
                  data={porTipoPagamento}
                  innerRadius={65}
                  outerRadius={95}
                  dataKey="valorTotal"
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  {porTipoPagamento.map((_, index) => (
                    <Cell
                      key={index}
                      fill={index === 0 ? COLORS[0] : COLORS[1]}
                    />
                  ))}
                </Pie>
              </PieChart>
              <div className="flex gap-6 mt-4">
                {porTipoPagamento.map((item, index) => {
                  const percent =
                    totalTipoPagamento > 0
                      ? (
                          (item.valorTotal / totalTipoPagamento) *
                          100
                        ).toFixed(0)
                      : 0;

                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor:
                            index === 0 ? COLORS[0] : COLORS[1],
                        }}
                      />
                      <span className="text-[14px] font-bold text-black">
                      {item.label} {percent}%
                      </span>
                    </div>
                  );
                })}
              </div>                
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          <Card className="rounded-[30px] border border-gray-100 p-8 bg-white flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#333333] mb-1">
                Previsão de Receita
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Valor nos próximos 30 dias
              </p>
              <h2 className="text-4xl font-black text-[#333333]">
                {formatCurrency(data?.previsaoCaixa30Dias?.valorTotal ?? 0)}
              </h2>
            </div>
            <div className="flex justify-end items-center mt-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#333333]">
                  {data?.previsaoCaixa30Dias?.quantidadeParcelas ?? 0}
                </span>
                <span className="text-sm font-bold text-[#333333]">
                  Parcelas com data próxima
                </span>
              </div>
            </div>
          </Card>

          <Card className="rounded-[30px] border border-gray-100 p-8 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <AlertCircle
                  size={24}
                  className="text-red-600 fill-current"
                  stroke="white"
                  strokeWidth={2.5}
                />
                <h3 className="text-xl font-bold text-[#333333]">
                  Inadimplência
                </h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Valor total de débitos vencidos
              </p>
              <h2 className="text-4xl font-black text-[#333333]">
                {formatCurrency(data?.inadimplencia?.valorTotal ?? 0)}
              </h2>
            </div>
            <div className="flex justify-end items-center mt-6">
              <div className="flex items-center gap-2">
                <AlertTriangle
                  size={30}
                  className="text-[#F39C12] fill-current"
                  stroke="white"
                  strokeWidth={2}
                />
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-[#333333]">
                    {data?.inadimplencia?.quantidadePagamentos ?? 0}
                  </span>
                  <span className="text-sm font-bold text-[#333333]">
                    Parcelas em atraso
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

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
