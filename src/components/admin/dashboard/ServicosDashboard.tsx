import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  dashboardService,
  type DashboardServicosResponse,
} from '@/services/dashboardService';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function ServicosDashboard() {
  const [servicos, setServicos] = useState<DashboardServicosResponse>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    dashboardService
      .getServicos()
      .then((data) => {
        setServicos(data);
      })
      .catch((error) => {
        console.error('Erro ao buscar dados do dashboard de serviços:', error);
        setErrorMessage(
          'Erro ao carregar dados do dashboard de serviços. Tente recarregar a página.',
        );
      });
  }, []);

  const servicosData = {
    ativos: servicos?.ativos ?? 0,
    pausados: servicos?.pausados ?? 0,
    maisSolicitados: servicos?.maisSolicitados ?? [],
    receitaPorServicoCompleto: servicos?.receitaPorServicoCompleto ?? [],
  };

  const statusData = [
    { name: 'Pausados', value: servicosData.pausados, color: '#DEDEDE' },
    { name: 'Ativos', value: servicosData.ativos, color: '#002546' },
  ];

  const totalServicos = servicosData.ativos + servicosData.pausados;

  const maisSolicitados = servicosData.maisSolicitados.map((s, index) => ({
    name: s.nome,
    qtd: s.totalSolicitacoes,
    color: index % 2 === 0 ? '#3498DB' : '#002546',
  }));

  const receitaData = servicosData.receitaPorServicoCompleto
    .filter(s => s.receitaTotal >= 0)
    .map((s, index) => ({
      name: s.nome,
      valor: s.receitaTotal,
      color: index % 2 === 0 ? '#002546' : '#3498DB',
    }))
    .sort((a, b) => b.valor - a.valor);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-white min-h-screen font-sans">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-[#002546]">Serviços</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        <Card className="rounded-[32px] border border-gray-100 relative overflow-hidden z-10">
          <CardHeader className="text-center pb-0 space-y-1">
            <CardTitle className="text-sm font-bold text-gray-700">Gráfico - Serviços Ativos e Pausados</CardTitle>
            {/* <p className="text-[10px] text-gray-400">Janeiro - Abril 2026</p> */}
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="w-[200px] h-[200px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                      <feOffset dx="2" dy="4" />
                      <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadow" />
                      <feFlood floodColor="#000" floodOpacity="0.15" />
                      <feComposite in2="shadow" operator="in" />
                      <feMerge>
                        <feMergeNode in="SourceGraphic" />
                        <feMergeNode />
                      </feMerge>
                    </filter>
                  </defs>
                  <Pie
                    data={statusData}
                    innerRadius={70}
                    outerRadius={95}
                    dataKey="value"
                    stroke="none"
                    startAngle={90}
                    endAngle={-270}
                    filter="url(#innerShadow)"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-4xl font-bold block text-gray-800 leading-none">{totalServicos}</span>
                <span className="text-[11px] font-medium text-gray-400 mt-1 block tracking-tight">Serviços</span>
              </div>
            </div>

            <div className="flex flex-col gap-6 ml-8">
              {statusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm font-medium text-gray-500">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border border-gray-100 relative overflow-hidden z-10">
          <CardHeader className="text-center pb-0 space-y-1">
            <CardTitle className="text-sm font-bold text-gray-700">Gráfico - Rota real por serviços</CardTitle>
            {/* <p className="text-[10px] text-gray-400">Janeiro - Abril 2026</p> */}
          </CardHeader>
          <CardContent className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                layout="vertical" 
                data={receitaData} 
                margin={{ right: 90, left: 20, top: 20, bottom: 10 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={160}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#1E293B', fontWeight: 600 }}
                />
                <Bar 
                  dataKey="valor" 
                  radius={[6, 6, 6, 6]} 
                  barSize={24}
                  minPointSize={3}
                >
                  {receitaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="valor" 
                    position="right" 
                    offset={12}
                    formatter={(value: any) => formatter.format(Number(value))} 
                    style={{ fontSize: '13px', fill: '#1E293B', fontWeight: '700' }} 
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="relative z-0">
        <Card className="rounded-[32px] border border-gray-100 lg:col-span-2 relative overflow-hidden">
          <CardHeader className="text-center pb-4 space-y-1">
            <CardTitle className="text-sm font-bold text-gray-700">Gráfico - Serviços mais solicitados no período</CardTitle>
            <p className="text-[10px] text-gray-400">Últimos 30 dias</p>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maisSolicitados} margin={{ top: 20, bottom: 20 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 500, fill: '#94A3B8' }} 
                />
                <YAxis hide />
                <Bar 
                  dataKey="qtd" 
                  radius={[20, 20, 20, 20]}
                  barSize={80}
                >
                  {maisSolicitados.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="qtd" 
                    position="top" 
                    offset={10}
                    style={{ fontSize: '12px', fill: '#64748B', fontWeight: '500' }} 
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
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
    </div>
  );
}
