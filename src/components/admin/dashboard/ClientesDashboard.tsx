import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, 
  Tooltip, Cell, LabelList 
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const backendMock = {
  topPorVolume: [
    { usuarioId: 2, nome: "Bruno Costa", totalSolicitacoes: 96, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { usuarioId: 3, nome: "Carla Souza", totalSolicitacoes: 89, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { usuarioId: 4, nome: "Daniel Lima", totalSolicitacoes: 75, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { usuarioId: 5, nome: "Eduardo Rocha", totalSolicitacoes: 61, avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop" },
    { usuarioId: 6, nome: "Fabiana Melo", totalSolicitacoes: 58, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop" }
  ],
  topPorValorPago: [
    { usuarioId: 2, nome: "Bruno Costa", valorPago: 18200.00, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { usuarioId: 3, nome: "Carla Souza", valorPago: 15350.00, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { usuarioId: 4, nome: "Daniel Lima", valorPago: 14750.00, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { usuarioId: 5, nome: "Eduardo Rocha", valorPago: 11500.00, avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop" },
    { usuarioId: 6, nome: "Fabiana Melo", valorPago: 8750.00, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop" }
  ],
  comParcelasEmAtraso: [
    { usuarioId: 2, nome: "Bruno Costa", valorTotalAtrasado: 18200.00, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { usuarioId: 3, nome: "Carla Souza", valorTotalAtrasado: 15350.00, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { usuarioId: 4, nome: "Daniel Lima", valorTotalAtrasado: 14750.00, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { usuarioId: 5, nome: "Eduardo Rocha", valorTotalAtrasado: 11500.00, avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop" },
    { usuarioId: 6, nome: "Fabiana Melo", valorTotalAtrasado: 8750.00, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop" }
  ]
};

const GRADIENTS_VOLUME = [
  'url(#colorTop1)', 
  'url(#colorTop2)', 
  'url(#colorBlue)', 
  'url(#colorLightBlue)', 
  'url(#colorGray)'
];

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const ClienteItem = ({ nome, info, avatar }: any) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
        <img src={avatar} alt={nome} className="w-full h-full object-cover" />
      </div>
      <span className="text-sm font-medium text-gray-700">{nome}</span>
    </div>
    <span className="text-sm font-medium text-gray-700">{typeof info === 'number' ? formatCurrency(info) : info}</span>
  </div>
);

export default function ClientesDashboard() {
  const data = backendMock;

  return (
    <div className="p-6 space-y-8 bg-white min-h-screen font-sans">
      <div className="flex flex-row items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-[#002749]">Clientes</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto items-stretch">
        <Card className="rounded-[30px] border border-gray-100 shadow-sm p-5 bg-white flex flex-col justify-between">
          <h3 className="font-bold text-gray-800 text-center mb-6 leading-tight">
            Gráfico - Top clientes por volume de <br /> solicitação
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                layout="vertical" 
                data={data.topPorVolume} 
                margin={{ left: 20, right: 60, top: 20, bottom: 20 }}
                barGap={20}
              >
                <defs>
                  <linearGradient id="colorTop1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#001F3B" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#002546" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorTop2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#062D50" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#093B66" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorBlue" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#2980B9" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#3498DB" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorLightBlue" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#8ECAFF" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#A2D2FF" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorGray" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#C9C9C9" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#D5D5D5" stopOpacity={1}/>
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
                    const payload = data.topPorVolume[index];
                    return (
                      <foreignObject x={x - 45} y={y - 20} width={40} height={40}>
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100 shadow-sm">
                          <img 
                            src={payload.avatar} 
                            alt="Avatar" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </foreignObject>
                    );
                  }}
                />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="totalSolicitacoes" radius={[10, 10, 10, 10]} barSize={16}>
                  {data.topPorVolume.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={GRADIENTS_VOLUME[index % GRADIENTS_VOLUME.length]} 
                    />
                  ))}
                  <LabelList 
                    dataKey="nome" 
                    content={(props: any) => {
                      const { x, y, value } = props;
                      return (
                        <text x={x} y={y - 15} fill="#4A4A4A" fontSize="13" fontWeight="600" textAnchor="start">
                          {value}
                        </text>
                      );
                    }}
                  />
                  <LabelList 
                    dataKey="totalSolicitacoes" 
                    position="right" 
                    style={{ fontSize: '13px', fill: '#666666', fontWeight: 'bold' }} 
                    offset={15}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-[30px] border border-gray-100 shadow-sm flex flex-col bg-white overflow-hidden">
          <div className="bg-[#EAEAEA] py-4 text-center">
            <h3 className="font-bold text-gray-700">Top clientes por valor</h3>
          </div>
          <CardContent className="flex-1 px-6 py-2 flex flex-col justify-between">
            <div>
              {data.topPorValorPago.map((c, i) => (
                <ClienteItem key={i} nome={c.nome} info={c.valorPago} avatar={c.avatar} />
              ))}
            </div>
          </CardContent>
          <div className="p-6 flex justify-center border-t border-gray-200">
            <Button 
              variant="outline" 
              className="rounded-xl border border-gray-300 px-10 py-5 text-black font-semibold text-sm gap-2 hover:bg-gray-50 shadow-sm"
            >
              Ver Todos <ChevronRight size={18} />
            </Button>
          </div>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto">
        <Card className="rounded-[30px] border border-gray-100 shadow-sm bg-white overflow-hidden">
          <div className="p-6 text-center border-b border-gray-100">
            <h3 className="font-bold text-gray-700">Clientes com parcelas em atraso</h3>
          </div>
          
          <div className="bg-[#EAEAEA] grid grid-cols-2 px-12 py-3 text-sm font-bold text-gray-600">
            <span>Cliente</span>
            <span className="text-right pr-4">Valor em atraso</span>
          </div>

          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 px-12">
              {data.comParcelasEmAtraso.map((c, i) => (
                <div key={i} className="grid grid-cols-2 py-4 items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100 shadow-sm">
                      <img src={c.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-gray-700">{c.nome}</span>
                  </div>
                  <span className="text-right font-medium text-gray-700 pr-4">
                    {formatCurrency(c.valorTotalAtrasado)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="p-6 flex justify-center border-t border-gray-200">
              <Button 
                variant="outline" 
                className="rounded-xl border border-gray-300 px-10 py-5 text-black font-semibold text-sm gap-2 hover:bg-gray-50 shadow-sm"
              >
                Ver Todos <ChevronRight size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}