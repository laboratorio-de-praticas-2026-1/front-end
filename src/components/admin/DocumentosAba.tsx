import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, 
  Cell, LabelList 
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const summaryData = [
  { label: 'Pendentes de avaliação', value: 58 },
  { label: 'Aprovados (Período)', value: 58 },
  { label: 'Rejeitados (Período)', value: 58 },
  { label: 'Solicitações travadas', value: 58 },
];

const travadasData = [
  { name: 'CRLV', value: 6, color: '#002749' },
  { name: 'Comprovante de residência', value: 9, color: '#093B66' },
  { name: 'Documento do proprietário', value: 4, color: '#3498DB' },
  { name: 'CNH', value: 1, color: '#D5D5D5' },
];

export default function DocumentosAba() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen font-sans">
      
      {/* Cabeçalho */}
      <div className="flex flex-row items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1D3557]">Documentos</h1>
        
        <div className="relative flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
          <span className="text-xs text-gray-400 mr-2 font-medium">Assunto:</span>
          <select className="text-xs font-bold text-gray-700 bg-transparent outline-none appearance-none pr-6 cursor-pointer">
            <option>Documentos</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {summaryData.map((card, idx) => (
          <Card key={idx} className="rounded-2xl border border-gray-100 shadow-sm bg-white">
            <CardContent className="flex flex-row items-center p-4 space-x-4">
              <div className="w-12 h-12 rounded-full border border-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] flex-shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase leading-tight">{card.label}</p>
                <span className="text-xl font-bold text-gray-700">{card.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico de Solicitações Travadas */}
      <div className="max-w-7xl mx-auto">
        <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="pt-8 px-8 pb-0">
            <CardTitle className="text-lg font-bold text-gray-800">Solicitações travadas por falta de documentos</CardTitle>
          </CardHeader>
          
          <CardContent className="h-[500px] px-8 pt-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                layout="vertical" 
                data={travadasData} 
                margin={{ left: 0, right: 60, top: 40, bottom: 20 }}
              >
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" hide />
                
                <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={28}>
                  {travadasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  
                  {/* Label do Nome - Alinhado à esquerda */}
                  <LabelList 
                    dataKey="name" 
                    content={(props: any) => {
                      const { x, y, value } = props;
                      return (
                        <text 
                          x={x} 
                          y={y - 12} 
                          fill="#4B5563" 
                          fontSize="13" 
                          fontWeight="600" 
                          textAnchor="start"
                        >
                          {value}
                        </text>
                      );
                    }}
                  />
                  
                  {/* Label do Valor - À direita da barra */}
                  <LabelList 
                    dataKey="value" 
                    position="right" 
                    style={{ fontSize: '16px', fill: '#111', fontWeight: '800' }} 
                    offset={15}
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