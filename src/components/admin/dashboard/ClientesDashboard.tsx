import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  dashboardService,
  type DashboardClientesResponse,
} from "@/services/dashboardService";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const GRADIENTS_VOLUME = [
  "url(#colorTop1)",
  "url(#colorTop2)",
  "url(#colorBlue)",
  "url(#colorLightBlue)",
  "url(#colorGray)",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );

const ClienteItem = ({
  nome,
  info,
}: {
  nome: string;
  info: string | number;
}) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
        {nome.charAt(0)}
      </div>
      <span className="text-sm font-medium text-gray-700">{nome}</span>
    </div>
    <span className="text-sm font-medium text-gray-700">
      {typeof info === "number" ? formatCurrency(info) : info}
    </span>
  </div>
);

export default function ClientesDashboard() {
  const [clientesData, setClientesData] = useState<DashboardClientesResponse>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const topPorVolume = clientesData?.topPorVolume.map((c) => ({
    usuarioId: c.usuarioId,
    nome: c.nome,
    totalSolicitacoes: c.totalSolicitacoes,
  }));

  const topPorValorPago = clientesData?.topPorValorPago.map((c: any) => ({
    usuarioId: c.usuarioId,
    nome: c.nome,
    valorPago: c.valorPago ?? 0,
  }));

  const comParcelasEmAtraso = clientesData?.comParcelasEmAtraso.map((c) => ({
    usuarioId: c.usuarioId,
    nome: c.nome,
    valorTotalAtrasado: c.valorTotalAtrasado,
  }));

  const fetchData = () => {
    dashboardService
      .getClientes()
      .then((data) => {      
        const normalizedData: DashboardClientesResponse = {
          topPorVolume: Array.isArray((data as any)?.topPorVolume)
            ? (data as any).topPorVolume
            : Array.isArray((data as any)?.top_por_volume)
              ? (data as any).top_por_volume
              : [],
          topPorValorPago: Array.isArray((data as any)?.topPorValorPago)
            ? (data as any).topPorValorPago
            : Array.isArray((data as any)?.top_por_valor_pago)
              ? (data as any).top_por_valor_pago
              : [],
          comParcelasEmAtraso: Array.isArray((data as any)?.comParcelasEmAtraso)
            ? (data as any).comParcelasEmAtraso
            : Array.isArray((data as any)?.com_parcelas_em_atraso)
              ? (data as any).com_parcelas_em_atraso
              : [],
        };

        setClientesData(normalizedData);
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

  return (
    <div className="p-6 space-y-8 bg-white min-h-screen font-sans">
      <div className="flex flex-row items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-[#002749]">Clientes</h1>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto items-stretch">
            <Card className="rounded-[30px] border border-gray-100 p-5 bg-white flex flex-col justify-between">
              <h3 className="font-bold text-gray-800 text-center mb-6 leading-tight">
                Gráfico - Top clientes por volume de <br /> solicitação
              </h3>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={topPorVolume}
                    margin={{ left: 20, right: 60, top: 20, bottom: 20 }}
                    barGap={20}
                  >
                    <defs>
                      <linearGradient
                        id="colorTop1"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="5%" stopColor="#001F3B" stopOpacity={1} />
                        <stop
                          offset="95%"
                          stopColor="#002546"
                          stopOpacity={1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorTop2"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="5%" stopColor="#062D50" stopOpacity={1} />
                        <stop
                          offset="95%"
                          stopColor="#093B66"
                          stopOpacity={1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorBlue"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="5%" stopColor="#2980B9" stopOpacity={1} />
                        <stop
                          offset="95%"
                          stopColor="#3498DB"
                          stopOpacity={1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorLightBlue"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="5%" stopColor="#8ECAFF" stopOpacity={1} />
                        <stop
                          offset="95%"
                          stopColor="#A2D2FF"
                          stopOpacity={1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorGray"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="5%" stopColor="#C9C9C9" stopOpacity={1} />
                        <stop
                          offset="95%"
                          stopColor="#D5D5D5"
                          stopOpacity={1}
                        />
                      </linearGradient>
                    </defs>

                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="nome"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      width={60}
                      tick={(props: any) => {
                        const { x, y, index } = props;
                        const payload = topPorVolume?.[index];
                        return (
                          <foreignObject
                            x={x - 45}
                            y={y - 20}
                            width={40}
                            height={40}
                          >
                            <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                              {payload?.nome.charAt(0)}
                            </div>
                          </foreignObject>
                        );
                      }}
                    />
                    <Tooltip cursor={{ fill: "transparent" }} />
                    <Bar
                      dataKey="totalSolicitacoes"
                      radius={[10, 10, 10, 10]}
                      barSize={16}
                    >
                      {topPorVolume?.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            GRADIENTS_VOLUME[index % GRADIENTS_VOLUME.length]
                          }
                        />
                      ))}
                      <LabelList
                        dataKey="nome"
                        content={(props: any) => {
                          const { x, y, value } = props;
                          return (
                            <text
                              x={x}
                              y={y - 15}
                              fill="#4A4A4A"
                              fontSize="13"
                              fontWeight="600"
                              textAnchor="start"
                            >
                              {value}
                            </text>
                          );
                        }}
                      />
                      <LabelList
                        dataKey="totalSolicitacoes"
                        position="right"
                        style={{
                          fontSize: "13px",
                          fill: "#666666",
                          fontWeight: "bold",
                        }}
                        offset={15}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="rounded-[30px] border border-gray-100 flex flex-col bg-white overflow-hidden">
              <div className="bg-[#EAEAEA] py-4 text-center">
                <h3 className="font-bold text-gray-700">
                  Top clientes por valor
                </h3>
              </div>
              <CardContent className="flex-1 px-6 py-2 flex flex-col justify-between">
                <div>
                  {topPorValorPago && topPorValorPago.length > 0 ? (
                    topPorValorPago.map((c, i) => (
                      <ClienteItem key={i} nome={c.nome} info={c.valorPago} />
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-8">
                      Nenhum dado disponível
                    </p>
                  )}
                </div>
              </CardContent>
              <div className="p-6 flex justify-center border-t border-gray-200">
                <Button
                  variant="outline"
                  className="rounded-xl border border-gray-300 px-10 py-5 text-black font-semibold text-sm gap-2 hover:bg-gray-50"
                >
                  Ver Todos <ChevronRight size={18} />
                </Button>
              </div>
            </Card>
          </div>

          <div className="max-w-7xl mx-auto">
            <Card className="rounded-[30px] border border-gray-100 bg-white overflow-hidden">
              <div className="p-6 text-center border-b border-gray-100">
                <h3 className="font-bold text-gray-700">
                  Clientes com parcelas em atraso
                </h3>
              </div>

              <div className="bg-[#EAEAEA] grid grid-cols-2 px-12 py-3 text-sm font-bold text-gray-600">
                <span>Cliente</span>
                <span className="text-right pr-4">Valor em atraso</span>
              </div>

              <CardContent className="p-0">
                <div className="divide-y divide-gray-200 px-12">
                  {comParcelasEmAtraso && comParcelasEmAtraso.length > 0 ? (
                    comParcelasEmAtraso.map((c, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-2 py-4 items-center"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                            {c.nome.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-700">
                            {c.nome}
                          </span>
                        </div>
                        <span className="text-right font-medium text-gray-700 pr-4">
                          {formatCurrency(c.valorTotalAtrasado)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-8">
                      Nenhuma parcela em atraso
                    </p>
                  )}
                </div>

                <div className="p-6 flex justify-center border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="rounded-xl border border-gray-300 px-10 py-5 text-black font-semibold text-sm gap-2 hover:bg-gray-50"
                  >
                    Ver Todos <ChevronRight size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
