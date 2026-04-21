import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LabelList, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import mockDashboard from '@/mocks/mockDashboard.json';

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function ServicosDashboard() {
  const servicos = mockDashboard.servicos;

  const statusData = [
    { name: 'Pausados', value: servicos.pausados, color: '#DEDEDE' },
    { name: 'Ativos', value: servicos.ativos, color: '#002546' },
  ];

  const totalServicos = servicos.ativos + servicos.pausados;

  const maisSolicitados = servicos.maisSolicitados.map((s, index) => ({
    name: s.nome,
    qtd: s.totalSolicitacoes,
    color: index % 2 === 0 ? '#3498DB' : '#002546',
  }));

  const receitaData = servicos.receitaPorServicoCompleto
    .filter(s => s.receitaTotal > 0)
    .map((s, index) => ({
      name: s.nome,
      valor: s.receitaTotal,
      color: index % 2 === 0 ? '#002546' : '#3498DB',
    }));

  return (
    <div className="p-4 md:p-6 space-y-6 bg-white min-h-screen font-sans">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-[#002546]">Serviços</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        <Card className="rounded-[32px] border border-gray-100 relative overflow-hidden z-10">
          <CardHeader className="text-center pb-0 space-y-1">
            <CardTitle className="text-sm font-bold text-gray-700">Gráfico - Serviços Ativos e Pausados</CardTitle>
            <p className="text-[10px] text-gray-400">Janeiro - Abril 2026</p>
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
            <p className="text-[10px] text-gray-400">Janeiro - Abril 2026</p>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                layout="vertical" 
                data={receitaData} 
                margin={{ right: 90, left: 20, top: 30, bottom: 10 }}
              >
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" hide />
                <Bar 
                  dataKey="valor" 
                  radius={[6, 6, 6, 6]} 
                  barSize={24}
                >
                  {receitaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList
                    dataKey="name"
                    content={(props: any) => {
                      const { x, y, value } = props;
                      return (
                        <text x={x} y={y - 12} fill="#1E293B" fontSize={13} fontWeight={700} textAnchor="start">
                          {value}
                        </text>
                      );
                    }}
                  />
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
    </div>
  );
}
