import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LabelList } from 'recharts';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const mockData = {
  status: [
    { name: 'Pausados', value: 10, color: '#D5D5D5' }, 
    { name: 'Ativos', value: 18, color: '#001F3F' }, 
  ],
  rotaReal: [
    { name: 'Serviço A', valor: 12500, color: '#002749', gradId: 'gradA' },
    { name: 'Serviço B', valor: 11750, color: '#093B66', gradId: 'gradB' },
    { name: 'Serviço C', valor: 8950, color: '#1E84CF', gradId: 'gradC' },
    { name: 'Serviço D', valor: 7250, color: '#E9E9E9', gradId: 'gradD' },
  ],
  maisSolicitados: [
    { name: 'Serviço A', qtd: 120, color: '#3498DB' },
    { name: 'Serviço B', qtd: 95, color: '#093B66' },
    { name: 'Serviço C', qtd: 85, color: '#3498DB' },
    { name: 'Serviço D', qtd: 68, color: '#093B66' },
    { name: 'Serviço E', qtd: 70, color: '#3498DB' },
    { name: 'Serviço F', qtd: 38, color: '#093B66' },
  ]
};

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function ServicosDashboard() {
  return (
    <div className="p-2 md:p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-bold text-secondary">Serviços</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico Donut */}
        <Card className="rounded-2xl border border-gray-200 shadow-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-sm font-bold text-[#1D3557]">Gráfico - Serviços Ativos e Pausados</CardTitle>
            <span className="text-[10px] text-gray-400">Janeiro - Abril 2026</span>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center relative">
            <div className="w-full h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockData.status}
                    innerRadius={65}
                    outerRadius={85}
                    dataKey="value"
                    stroke="none"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {mockData.status.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="text-3xl font-bold block text-secondary">28</span>
                <span className="text-[10px] uppercase text-gray-400">Serviços</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 ml-4 min-w-[100px]">
              {mockData.status.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm font-medium text-gray-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-gray-200 shadow-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-sm font-bold text-[#1D3557]">Gráfico - Rota real por serviços</CardTitle>
            <span className="text-[10px] text-gray-400">Janeiro - Abril 2026</span>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                layout="vertical" 
                data={mockData.rotaReal} 
                margin={{ right: 80, left: 10, top: 30, bottom: 10 }}
              >
                <defs>
                  {mockData.rotaReal.map((entry) => (
                    <linearGradient key={entry.gradId} id={entry.gradId} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={0.7}/>
                      <stop offset="100%" stopColor={entry.color} stopOpacity={1}/>
                    </linearGradient>
                  ))}
                </defs>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" hide />
                
                <Bar 
                  dataKey="valor" 
                  radius={[0, 10, 10, 0]} 
                  barSize={16}
                >
                  {mockData.rotaReal.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#${entry.gradId})`} />
                  ))}
                  
                  <LabelList
                    dataKey="name"
                    content={(props: any) => {
                      const { x, y, value } = props;
                      return (
                        <text
                          x={x}
                          y={y - 8}
                          fill="#1D3557"
                          fontSize={12}
                          fontWeight={600}
                          textAnchor="start"
                          dominantBaseline="middle"
                        >
                          {value}
                        </text>
                      );
                    }}
                  />

                  <LabelList 
                    dataKey="valor" 
                    position="right" 
                    offset={10}
                    formatter={(value: any) => formatter.format(Number(value))} 
                    style={{ fontSize: '11px', fill: '#333', fontWeight: 'bold' }} 
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-gray-200 shadow-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-sm font-bold text-[#1D3557]">Gráfico - Serviços mais solicitados no período</CardTitle>
            <span className="text-[10px] text-gray-400">Últimos 30 dias</span>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.maisSolicitados} margin={{ top: 20 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  style={{ fontSize: '11px', fontWeight: 'bold', fill: '#1D3557' }} 
                />
                <Bar dataKey="qtd" radius={[6, 6, 0, 0]} barSize={35}>
                  {mockData.maisSolicitados.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="qtd" 
                    position="top" 
                    style={{ fontSize: '11px', fill: '#1D3557', fontWeight: 'bold' }} 
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="text-center border-b border-gray-100">
            <CardTitle className="text-sm font-bold text-[#1D3557]">Serviços com mais renda</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#001F3F] hover:bg-[#001F3F]">
                <TableRow>
                  <TableHead className="text-white h-10 text-xs uppercase font-normal">Serviço</TableHead>
                  <TableHead className="text-white h-10 text-xs uppercase font-normal text-right">Receita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.rotaReal.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-gray-50">
                    <TableCell className="py-3 flex items-center gap-3 text-gray-600 font-medium">
                      <Star 
                        size={14} 
                        className={idx < 2 ? "fill-[#324587] text-[#324587]" : "text-gray-300"} 
                      />
                      {item.name}
                    </TableCell>
                    <TableCell className="py-3 text-right text-gray-500 font-semibold">
                      {formatter.format(item.valor)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}