import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, CircleEllipsis, CircleSlash, CheckCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from '@/components/ui/DatePicker';
import { Button } from '../../ui/button';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, useDroppable, useDraggable, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { solicitacoesService, type Solicitacao } from '@/services/solicitacoesService';
import ModalCancelarSolicitacao from './ModalCancelarSolicitacao';
import ModalRecuperarSolicitacao from './ModalRecuperarSolicitacao';

const COLUMNS = [
  { id: 'recebido', label: 'Recebido', headerColor: 'bg-[#E5E7EA]', borderColor: 'border-[#E5E7EA]' },
  { id: 'em_andamento', label: 'Em andamento', headerColor: 'bg-[#8ACEFF]', borderColor: 'border-[#8ACEFF]' },
  { id: 'aguardando_pagamento', label: 'Aguardando pagamento', headerColor: 'bg-[#FFC654]', borderColor: 'border-[#FFC654]' },
  { id: 'aguardando_documento', label: 'Aguardando documento', headerColor: 'bg-[#B57900]', borderColor: 'border-[#B57900]' },
  { id: 'cancelado', label: 'Cancelado', headerColor: 'bg-[#F7A9A7]', borderColor: 'border-[#F7A9A7]' },
  { id: 'concluido', label: 'Concluído', headerColor: 'bg-[#A9DEB4]', borderColor: 'border-[#A9DEB4]' },
];

type Column = {
  id: string;
  label: string;
  headerColor: string;
  borderColor: string;
};

type KanbanCardProps = {
  item: Solicitacao;
  borderColor: string;
  onClick: () => void;
};

type KanbanColumnProps = {
  col: Column;
  items: Solicitacao[];
  onCardClick: (id: string | number) => void;
};

// card do kanban
const KanbanCard = ({ item, borderColor, onClick }: KanbanCardProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: { item },
  });

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`
        cursor-grab active:cursor-grabbing border-l-5 ${borderColor}
        transition-opacity duration-150
        ${isDragging ? 'opacity-40' : 'opacity-100'}
      `}
    >
      <CardContent className="p-3 space-y-1">
        <p className="font-bold text-slate-800 text-sm">#{item.id} {item.cliente}</p>
        <p className="text-slate-500 text-xs">{item.servico}</p>
        <p className="text-slate-400 text-[10px]">
          {new Date(item.data + "T00:00:00").toLocaleDateString("pt-BR")}
        </p>
      </CardContent>
    </Card>
  );
};

// coluna do kanban
const KanbanColumn = ({ col, items, onCardClick }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  return (
    <div className={`
      min-w-8/10 sm:min-w-65 sm:max-w-65 flex-1 flex flex-col rounded-lg bg-white
      border transition-colors duration-150
      ${isOver ? 'border-blue-300 bg-blue-50/30' : 'border-slate-100'}
    `}>
      <div className={`${col.headerColor} m-3 p-3 rounded-lg text-center font-semibold text-slate-700 text-sm`}>
        {col.label}
      </div>

      <div ref={setNodeRef} className="p-3 space-y-3 overflow-y-auto flex-1 min-h-16">
        {items.length === 0 ? (
          <p className="text-center text-xs text-slate-400 mt-4">Ainda não há solicitações</p>
        ) : (
          items.map(item => (
            <KanbanCard
              key={item.id}
              item={item}
              borderColor={col.borderColor}
              onClick={() => onCardClick(item.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};


const SolicitacoesAdmin = () => {
  const navigate = useNavigate();


  const [isLoading, setIsLoading] = useState(true);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [activeItem, setActiveItem] = useState<Solicitacao | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateDe, setDateDe] = useState<Date | undefined>(undefined);
  const [dateAte, setDateAte] = useState<Date | undefined>(undefined);

  const [cancelando, setCancelando] = useState<{
    solicitacao: Solicitacao;
    novoStatus: string;
  } | null>(null);

  const [recuperando, setRecuperando] = useState<{
    solicitacao: Solicitacao;
    novoStatus: string;
  } | null>(null);

  useEffect(() => {
    const carregarSolicitacoes = async () => {
      setIsLoading(true);
      const dados = await solicitacoesService.listarTodas();
      setSolicitacoes(dados);
      setIsLoading(false);
    };
    carregarSolicitacoes();
  }, []);

  // pra saber quando é click ou drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const getStatIcon = (type: string) => {
    switch (type) {
      case 'total': return <div className="bg-[#F39200]/14 rounded-lg w-8 min-w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"><List className="text-orange-500 size-4 md:size-6" /></div>;
      case 'progress': return <div className="bg-[#7ec8ff]/14 rounded-lg w-8 min-w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"><CircleEllipsis className="text-blue-500 size-4 md:size-6" /></div>;
      case 'canceled': return <div className="bg-[#ffabab]/14 rounded-lg w-8 min-w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"><CircleSlash className="text-red-500 size-4 md:size-6" /></div>;
      case 'finished': return <div className="bg-[#a3e4b8]/14 rounded-lg w-8 min-w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"><CheckCircle className="text-green-500 size-4 md:size-6" /></div>;
      default: return null;
    }
  };

  const filteredSolicitacoes = useMemo(() => {
    return solicitacoes.filter(s => {
      const matchesSearch =
        (s.cliente ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (s.servico ?? "").toLowerCase().includes(search.toLowerCase()) ||
        String(s.id ?? "").includes(search);

      const dataSolicitacao = new Date(s.data + "T00:00:00");
      const inicio = dateDe ? new Date(dateDe.getFullYear(), dateDe.getMonth(), dateDe.getDate(), 0, 0, 0) : null;
      const fim = dateAte ? new Date(dateAte.getFullYear(), dateAte.getMonth(), dateAte.getDate(), 23, 59, 59) : null;

      return (
        matchesSearch &&
        (inicio ? dataSolicitacao >= inicio : true) &&
        (fim ? dataSolicitacao <= fim : true)
      );
    });
  }, [solicitacoes, search, dateDe, dateAte]);

  // quando começa a arrastar, guarda o item que ta sendo movido
  const handleDragStart = (event: DragStartEvent) => {
    const item = solicitacoes.find(s => s.id === event.active.id) ?? null;
    setActiveItem(item);
  };

  // quando o card é solto ele atualiza o status localmente
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const novoStatus = over.id as string;
    const solicitacao = solicitacoes.find(s => s.id === active.id);

    if (!solicitacao || solicitacao.status === novoStatus) return;

    const estaCancelando = novoStatus === 'cancelado';
    const estaRecuperando = solicitacao.status === 'cancelado' && novoStatus !== 'cancelado';

    if (estaCancelando) {
      setCancelando({
        solicitacao,
        novoStatus,
      });
      return;
    }

    if (estaRecuperando) {
      setRecuperando({
        solicitacao,
        novoStatus,
      });
      return;
    }

    setSolicitacoes(prev =>
      prev.map(s =>
        s.id === active.id ? { ...s, status: novoStatus } : s
      )
    );

    await solicitacoesService.atualizarStatus(active.id, novoStatus);
  };

  const confirmarCancelamento = async () => {
    if (!cancelando) return;

    const sucesso = await solicitacoesService.atualizarStatus(
      cancelando.solicitacao.id,
      cancelando.novoStatus
    );

    if (sucesso) {
      setSolicitacoes(prev =>
        prev.map(s =>
          s.id === cancelando.solicitacao.id
            ? { ...s, status: cancelando.novoStatus }
            : s
        )
      );
    }

    setCancelando(null);
  };

  const confirmarRecuperacao = async () => {
    if (!recuperando) return;

    const sucesso = await solicitacoesService.atualizarStatus(
      recuperando.solicitacao.id,
      recuperando.novoStatus
    );

    if (sucesso) {
      setSolicitacoes(prev =>
        prev.map(s =>
          s.id === recuperando.solicitacao.id
            ? { ...s, status: recuperando.novoStatus }
            : s
        )
      );
    }

    setRecuperando(null);
  };

  const fecharModal = () => {
    setCancelando(null);
    setRecuperando(null);
  };

  // coluna do card que tá sendo arrastado, usada para mostrar a borda colorida no card flutuante
  const activeColumn = activeItem
    ? COLUMNS.find(column => column.id === activeItem.status)
    : null;

  const stats = [
    {
      label: "Total solicitações",
      value: String(solicitacoes.length),
      type: "total",
    },
    {
      label: "Em progresso",
      value: String(
        solicitacoes.filter(
          (s) =>
            ["em_andamento", "aguardando_pagamento", "aguardando_documento"].includes(s.status)
        ).length
      ),
      type: "progress",
    },
    {
      label: "Cancelados",
      value: String(solicitacoes.filter((s) => s.status === "cancelado").length),
      type: "canceled",
    },
    {
      label: "Concluídos",
      value: String(solicitacoes.filter((s) => s.status === "concluido").length),
      type: "finished",
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-[#f8fafc] space-y-6 font-sans flex items-center justify-center min-h-screen">
        <p className="text-slate-500">Carregando solicitações...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] space-y-6 font-sans">


      {/* modal de cancelamento */}
      {cancelando && (
        <ModalCancelarSolicitacao
          solicitacao={cancelando.solicitacao}
          onConfirm={confirmarCancelamento}
          onCancel={fecharModal}
        />
      )}

      {recuperando && (
        <ModalRecuperarSolicitacao
          solicitacao={recuperando.solicitacao}
          onConfirm={confirmarRecuperacao}
          onCancel={fecharModal}
        />
      )}

      <header>
        <h1 className="text-2xl font-bold text-secondary">Solicitações</h1>
        <p className="text-slate-500 text-sm">Visualize, organize e acompanhe todas as solicitações feitas pelos seus clientes.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-primary/10 h-35 flex-1 justify-between p-4">
            <div className="flex justify-between h-17 flex-row-reverse xl:flex-row gap-3">
              <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
              {getStatIcon(stat.type)}
            </div>
            <p className="text-2xl md:text-3xl font-bold text-slate-800">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center bg-white p-2 rounded-lg border-[#002749] border-[1.5px] justify-between">
        <DatePicker date={dateDe} setDate={setDateDe} placeholder="De" className="w-full xl:w-auto min-w-35" />
        <DatePicker date={dateAte} setDate={setDateAte} placeholder="Até" className="w-full xl:w-auto min-w-35" />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="cursor-pointer w-full xl:w-auto min-w-35 text-slate-500">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white border-0">
            {COLUMNS.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1 relative w-full xl:w-auto min-w-35">
          <Input
            placeholder="Pesquisar solicitação..."
            className="border-slate-200"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <Button variant="outline" className='w-full xl:w-auto' onClick={() => {
          setSearch("");
          setStatusFilter("");
          setDateDe(undefined);
          setDateAte(undefined);
        }}>
          Limpar Filtros
        </Button>
      </div>

      {/* inicio do drag and drop */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x h-132">
          {COLUMNS
            .filter(col => !statusFilter || col.id === statusFilter)
            .map(col => (
              <KanbanColumn
                key={col.id}
                col={col}
                items={filteredSolicitacoes.filter(s => s.status === col.id)}
                onCardClick={id => navigate(`/admin/solicitacoes/${id}/editar`)}
              />
            ))}
        </div>

        {/* card flutuante que vai seguir o mouse enquanto ele estiver arrastando o card */}
        <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
          {activeItem && activeColumn && (
            <Card className={`border-l-5 ${activeColumn.borderColor} shadow-xl rotate-2 opacity-95`}>
              <CardContent className="p-3 space-y-1">
                <p className="font-bold text-slate-800 text-sm">#{activeItem.id} {activeItem.cliente}</p>
                <p className="text-slate-500 text-xs">{activeItem.servico}</p>
                <p className="text-slate-400 text-[10px]">
                  {new Date(activeItem.data + "T00:00:00").toLocaleDateString("pt-BR")}
                </p>
              </CardContent>
            </Card>
          )}
        </DragOverlay>
      </DndContext>

    </div>
  );
};

export default SolicitacoesAdmin;