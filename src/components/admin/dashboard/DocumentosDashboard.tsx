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

export default function DocumentosDashboard() {
  return (
    <div className="p-6 space-y-8 bg-white min-h-screen font-sans">
      
      <div className="flex flex-row items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1D3557]">Documentos</h1>
        
        <div className="relative flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
          <span className="text-xs text-gray-400 mr-2 font-medium">Assunto:</span>
          <select className="text-xs font-bold text-gray-700 bg-transparent outline-none appearance-none pr-6 cursor-pointer font-sans">
            <option>Documentos</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {summaryData.map((card, idx) => (
          <Card key={idx} className="rounded-3xl border border-gray-100 shadow-sm bg-white min-h-[160px] flex items-center">
            <CardContent className="flex flex-row items-center p-8 space-x-8 w-full">
              <div className="w-24 h-24 rounded-full border border-gray-100 shadow-[inset_0_4px_8px_rgba(0,0,0,0.12)] bg-white flex-shrink-0" />
              
              <div className="flex flex-col justify-center">
                <p className="text-[12px] text-black font-bold uppercase tracking-wider mb-2">{card.label}</p>
                <span className="text-4xl font-black text-black">{card.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        <Card className="rounded-[40px] border border-gray-100 shadow-sm bg-white overflow-hidden">
          <CardHeader className="pt-10 px-10 pb-0">
            <CardTitle className="text-xl font-bold text-gray-800">Solicitações travadas por falta de documentos</CardTitle>
          </CardHeader>
          
          <CardContent className="h-[600px] px-10 pt-12 pb-12">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                layout="vertical" 
                data={travadasData} 
                margin={{ left: 0, right: 100, top: 40, bottom: 20 }}
              >
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" hide />
                
                <Bar dataKey="value" radius={[25, 25, 25, 25]} barSize={55}>
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
                    style={{ fontSize: '24px', fill: '#000000', fontWeight: '900', fontFamily: 'sans-serif' }} 
                    offset={25}
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