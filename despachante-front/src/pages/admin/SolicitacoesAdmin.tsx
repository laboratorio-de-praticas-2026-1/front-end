import { useNavigate } from 'react-router-dom';
import { List, MoreHorizontal, Ban, CheckCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import mockData from '@/mocks/mockAdminSolicitacoes.json';

const COLUMNS = [
  { id: 'recebido', label: 'Recebido', headerColor: 'bg-slate-200', borderColor: 'border-slate-200' },
  { id: 'em_andamento', label: 'Em andamento', headerColor: 'bg-[#7ec8ff]', borderColor: 'border-[#7ec8ff]' },
  { id: 'aguardando_pagamento', label: 'Aguardando pagamento', headerColor: 'bg-[#ffc163]', borderColor: 'border-[#ffc163]' },
  { id: 'aguardando_documento', label: 'Aguardando documento', headerColor: 'bg-[#b37e00]', borderColor: 'border-[#b37e00]' },
  { id: 'cancelado', label: 'Cancelado', headerColor: 'bg-[#ffabab]', borderColor: 'border-[#ffabab]' },
  { id: 'finalizado', label: 'Finalizado', headerColor: 'bg-[#a3e4b8]', borderColor: 'border-[#a3e4b8]' },
];

const Solicitacoes = () => {
  const navigate = useNavigate();

  const getStatIcon = (type: string) => {
    switch (type) {
      case 'total': return <List className="text-orange-500" />;
      case 'progress': return <MoreHorizontal className="text-blue-500" />;
      case 'canceled': return <Ban className="text-red-500" />;
      case 'finished': return <CheckCircle className="text-green-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen space-y-6 font-sans">
      {/* Título */}
      <header>
        <h1 className="text-2xl font-bold text-secondary">Solicitações</h1>
        <p className="text-slate-500 text-sm">Visualize, organize e acompanhe todas as solicitações feitas pelos seus clientes.</p>
      </header>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {mockData.stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm h-28 flex items-center px-6">
            <div className="flex-1">
              <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">{getStatIcon(stat.type)}</div>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 items-center bg-white p-2 rounded-lg border">
        <Input type="text" placeholder="De" className="w-40 border-slate-200" onFocus={(e) => e.target.type = 'date'} />
        <Input type="text" placeholder="Até" className="w-40 border-slate-200" onFocus={(e) => e.target.type = 'date'} />
        <Select>
          <SelectTrigger className="w-48 text-slate-500"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            {COLUMNS.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex-1 relative min-w-[200px]">
          <Input placeholder="Pesquisar solicitação..." className="border-slate-200" />
        </div>
      </div>

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x h-[calc(100vh-350px)]">
        {COLUMNS.map((col) => (
          <div key={col.id} className="min-w-[260px] flex-1 flex flex-col rounded-lg bg-white border border-slate-100">
            <div className={`${col.headerColor} p-3 rounded-t-lg text-center font-semibold text-slate-700 text-sm`}>
              {col.label}
            </div>
            
            <div className="p-3 space-y-3 overflow-y-auto">
              {mockData.solicitacoes
                .filter(s => s.status === col.id)
                .map((item) => (
                  <Card 
                    key={item.id} 
                    className={`cursor-pointer border-l-4 ${col.borderColor} hover:shadow-md transition-shadow`}
                    onClick={() => navigate(`/admin/solicitacoes/${item.id}/editar`)}
                  >
                    <CardContent className="p-3 space-y-1">
                      <p className="font-bold text-slate-800 text-sm">#{item.id} {item.cliente}</p>
                      <p className="text-slate-500 text-xs">{item.servico}</p>
                      <p className="text-slate-400 text-[10px]">{item.data}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Solicitacoes;
