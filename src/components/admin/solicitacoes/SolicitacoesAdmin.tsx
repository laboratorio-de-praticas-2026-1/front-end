import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  CircleEllipsis,
  CircleSlash,
  CheckCircle,
  Search,
  GripVertical,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "../../ui/button";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  solicitacoesService,
  type Solicitacao,
} from "@/services/solicitacoesService";
import ModalCancelarSolicitacao from "./ModalCancelarSolicitacao";
import ModalRecuperarSolicitacao from "./ModalRecuperarSolicitacao";
import { toast } from "sonner";

const COLUMNS = [
  {
    id: "recebido",
    label: "Recebido",
    headerColor: "bg-[#E5E7EA]",
    borderColor: "border-[#E5E7EA]",
  },
  {
    id: "em_andamento",
    label: "Em andamento",
    headerColor: "bg-[#8ACEFF]",
    borderColor: "border-[#8ACEFF]",
  },
  {
    id: "aguardando_pagamento",
    label: "Aguardando pagamento",
    headerColor: "bg-[#FFC654]",
    borderColor: "border-[#FFC654]",
  },
  {
    id: "aguardando_documento",
    label: "Aguardando documento",
    headerColor: "bg-[#B57900]",
    borderColor: "border-[#B57900]",
  },
  {
    id: "cancelado",
    label: "Cancelado",
    headerColor: "bg-[#F7A9A7]",
    borderColor: "border-[#F7A9A7]",
  },
  {
    id: "concluido",
    label: "Concluído",
    headerColor: "bg-[#A9DEB4]",
    borderColor: "border-[#A9DEB4]",
  },
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

const KanbanCard = ({ item, borderColor, onClick }: KanbanCardProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: { item },
  });

  return (
    <Card
      ref={setNodeRef}
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (!target.closest("[data-drag-handle='true']")) {
          onClick();
        }
      }}
      className={`
        cursor-pointer border-l-5 ${borderColor}
        transition-opacity duration-150
        ${isDragging ? "opacity-40" : "opacity-100"}
      `}
    >
      <CardContent className="p-3 space-y-1">
        <div className="flex items-start gap-2">
          <button
            type="button"
            {...listeners}
            {...attributes}
            data-drag-handle="true"
            aria-label={`Mover solicitação #${item.id}`}
            onClick={(event) => event.stopPropagation()}
            className="mt-0.5 cursor-grab rounded p-0.5 text-slate-300 transition hover:bg-slate-100 hover:text-slate-500 active:cursor-grabbing"
          >
            <GripVertical className="size-4" />
          </button>
          <div className="min-w-0">
            <p className="font-bold text-slate-800 text-sm">
              #{item.id} {item.cliente}
            </p>
            <p className="text-slate-500 text-xs">{item.servico}</p>
          </div>
          <button
            type="button"
            aria-label={`Abrir detalhes da solicitação #${item.id}`}
            onClick={(event) => {
              event.stopPropagation();
              onClick();
            }}
            className="ml-auto rounded p-1 text-slate-300 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <Eye className="size-4" />
          </button>
        </div>
        <p className="text-slate-400 text-[10px]">
          {new Date(item.data + "T00:00:00").toLocaleDateString("pt-BR")}
        </p>
      </CardContent>
    </Card>
  );
};

const KanbanColumn = ({ col, items, onCardClick }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  return (
    <div
      className={`
      min-w-8/10 sm:min-w-65 sm:max-w-65 flex-1 flex flex-col rounded-lg bg-white
      border transition-colors duration-150
      ${isOver ? "border-blue-300 bg-blue-50/30" : "border-slate-100"}
    `}
    >
      <div
        className={`${col.headerColor} m-3 p-3 rounded-lg text-center font-semibold text-slate-700 text-sm`}
      >
        {col.label}
      </div>

      <div
        ref={setNodeRef}
        className="p-3 space-y-3 overflow-y-auto flex-1 min-h-16"
      >
        {items.length === 0 ? (
          <p className="text-center text-xs text-slate-400 mt-4">
            Ainda não há solicitações
          </p>
        ) : (
          items.map((item) => (
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
  const [servicoFilter, setServicoFilter] = useState("");
  const [dateFiltro, setDateFiltro] = useState<Date | undefined>(undefined);

  const [cancelando, setCancelando] = useState<{
    solicitacao: Solicitacao;
    novoStatus: string;
  } | null>(null);

  const [recuperando, setRecuperando] = useState<{
    solicitacao: Solicitacao;
    novoStatus: string;
  } | null>(null);

  const carregarSolicitacoes = useCallback(
    async (
      options: { mostrarLoading?: boolean; mostrarErro?: boolean } = {},
    ) => {
      const { mostrarLoading = true, mostrarErro = true } = options;

      if (mostrarLoading) {
        setIsLoading(true);
      }

      try {
        const dados = await solicitacoesService.listarKanban();
        setSolicitacoes(dados);
        return dados;
      } catch {
        if (mostrarErro) {
          toast.error("Não foi possível carregar as solicitações.");
        }
        return null;
      } finally {
        if (mostrarLoading) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    carregarSolicitacoes();
  }, [carregarSolicitacoes]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const getStatIcon = (type: string) => {
    switch (type) {
      case "total":
        return (
          <div className="bg-[#F39200]/14 rounded-lg w-8 min-w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
            <List className="text-orange-500 size-4 md:size-6" />
          </div>
        );
      case "progress":
        return (
          <div className="bg-[#7ec8ff]/14 rounded-lg w-8 min-w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
            <CircleEllipsis className="text-blue-500 size-4 md:size-6" />
          </div>
        );
      case "canceled":
        return (
          <div className="bg-[#ffabab]/14 rounded-lg w-8 min-w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
            <CircleSlash className="text-red-500 size-4 md:size-6" />
          </div>
        );
      case "finished":
        return (
          <div className="bg-[#a3e4b8]/14 rounded-lg w-8 min-w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
            <CheckCircle className="text-green-500 size-4 md:size-6" />
          </div>
        );
      default:
        return null;
    }
  };

  const filteredSolicitacoes = useMemo(() => {
    return solicitacoes.filter((s) => {
      const matchesSearch =
        (s.cliente ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (s.servico ?? "").toLowerCase().includes(search.toLowerCase()) ||
        String(s.id ?? "").includes(search);

      const dataSolicitacao = new Date(s.data + "T00:00:00");
      const filtroInicio = dateFiltro
        ? new Date(
            dateFiltro.getFullYear(),
            dateFiltro.getMonth(),
            dateFiltro.getDate(),
            0,
            0,
            0,
          )
        : null;
      const filtroFim = dateFiltro
        ? new Date(
            dateFiltro.getFullYear(),
            dateFiltro.getMonth(),
            dateFiltro.getDate(),
            23,
            59,
            59,
          )
        : null;

      const matchesDate =
        filtroInicio && filtroFim
          ? dataSolicitacao >= filtroInicio && dataSolicitacao <= filtroFim
          : true;

      const matchesServico =
        servicoFilter && servicoFilter !== "todos"
          ? s.servico === servicoFilter
          : true;

      return matchesSearch && matchesDate && matchesServico;
    });
  }, [solicitacoes, search, dateFiltro, servicoFilter]);

  const handleDragStart = (event: DragStartEvent) => {
    const item =
      solicitacoes.find((s) => String(s.id) === String(event.active.id)) ??
      null;
    setActiveItem(item);
  };

  const sincronizarStatusAposErro = async (
    solicitacaoId: string | number,
    statusEsperado: string,
  ) => {
    const dadosAtualizados = await carregarSolicitacoes({
      mostrarLoading: false,
      mostrarErro: false,
    });

    const solicitacaoAtualizada = dadosAtualizados?.find(
      (s) => String(s.id) === String(solicitacaoId),
    );

    return solicitacaoAtualizada?.status === statusEsperado;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const colunaDestino = COLUMNS.find((col) => col.id === String(over.id));
    if (!colunaDestino) return;

    const novoStatus = colunaDestino.id;
    const solicitacao = solicitacoes.find(
      (s) => String(s.id) === String(active.id),
    );

    if (!solicitacao || solicitacao.status === novoStatus) return;

    const estaCancelando = novoStatus === "cancelado";
    const estaRecuperando =
      solicitacao.status === "cancelado" && novoStatus !== "cancelado";

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

    const statusAnterior = solicitacao.status;

    setSolicitacoes((prev) =>
      prev.map((s) =>
        String(s.id) === String(active.id) ? { ...s, status: novoStatus } : s,
      ),
    );

    const sucesso = await solicitacoesService.atualizarStatus(
      active.id,
      novoStatus,
    );

    if (!sucesso) {
      const statusFoiPersistido = await sincronizarStatusAposErro(
        active.id,
        novoStatus,
      );

      if (statusFoiPersistido) {
        toast.warning(
          "Status salvo, mas a API retornou erro após a atualização.",
        );
        return;
      }

      setSolicitacoes((prev) =>
        prev.map((s) =>
          String(s.id) === String(active.id)
            ? { ...s, status: statusAnterior }
            : s,
        ),
      );
      toast.error("Não foi possível atualizar o status da solicitação.");
      return;
    }

    toast.success("Status da solicitação atualizado.");
  };

  const confirmarCancelamento = async () => {
    if (!cancelando) return;

    const sucesso = await solicitacoesService.cancelar(cancelando.solicitacao.id);

    if (sucesso) {
      setSolicitacoes((prev) =>
        prev.map((s) =>
          String(s.id) === String(cancelando.solicitacao.id)
            ? { ...s, status: cancelando.novoStatus }
            : s,
        ),
      );
      toast.success("Solicitação cancelada.");
    } else {
      const statusFoiPersistido = await sincronizarStatusAposErro(
        cancelando.solicitacao.id,
        cancelando.novoStatus,
      );

      if (statusFoiPersistido) {
        toast.warning(
          "Solicitação cancelada, mas a API retornou erro após salvar.",
        );
      } else {
        toast.error("Não foi possível cancelar a solicitação.");
      }
    }

    setCancelando(null);
  };

  const confirmarRecuperacao = async () => {
    if (!recuperando) return;

    const sucesso =
      recuperando.novoStatus === "em_andamento"
        ? await solicitacoesService.reabrir(recuperando.solicitacao.id)
        : await solicitacoesService.atualizarStatus(
            recuperando.solicitacao.id,
            recuperando.novoStatus,
          );

    if (sucesso) {
      setSolicitacoes((prev) =>
        prev.map((s) =>
          String(s.id) === String(recuperando.solicitacao.id)
            ? { ...s, status: recuperando.novoStatus }
            : s,
        ),
      );
      toast.success("Solicitação recuperada.");
    } else {
      const statusFoiPersistido = await sincronizarStatusAposErro(
        recuperando.solicitacao.id,
        recuperando.novoStatus,
      );

      if (statusFoiPersistido) {
        toast.warning(
          "Solicitação recuperada, mas a API retornou erro após salvar.",
        );
      } else {
        toast.error("Não foi possível recuperar a solicitação.");
      }
    }

    setRecuperando(null);
  };

  const fecharModal = () => {
    setCancelando(null);
    setRecuperando(null);
  };

  const activeColumn = activeItem
    ? COLUMNS.find((column) => column.id === activeItem.status)
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
        solicitacoes.filter((s) =>
          [
            "em_andamento",
            "aguardando_pagamento",
            "aguardando_documento",
          ].includes(s.status),
        ).length,
      ),
      type: "progress",
    },
    {
      label: "Cancelados",
      value: String(
        solicitacoes.filter((s) => s.status === "cancelado").length,
      ),
      type: "canceled",
    },
    {
      label: "Concluídos",
      value: String(
        solicitacoes.filter((s) => s.status === "concluido").length,
      ),
      type: "finished",
    },
  ];

  const servicosDisponiveis = Array.from(
    new Set(solicitacoes.map((s) => s.servico)),
  );

  if (isLoading) {
    return (
      <div className="bg-[#f8fafc] space-y-6 font-sans flex items-center justify-center min-h-screen">
        <p className="text-slate-500">Carregando solicitações...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] space-y-6 font-sans">
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
        <p className="text-slate-500 text-sm">
          Visualize, organize e acompanhe todas as solicitações feitas pelos
          seus clientes.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="border-primary/10 h-35 flex-1 justify-between p-4"
          >
            <div className="flex justify-between h-17 flex-row-reverse xl:flex-row gap-3">
              <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
              {getStatIcon(stat.type)}
            </div>
            <p className="text-2xl md:text-3xl font-bold text-slate-800">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="w-full flex flex-col xl:flex-row gap-3 xl:gap-0 items-stretch xl:items-center border-2 border-secondary rounded-xl p-2 sm:p-1.5 bg-white">
        <div className="relative w-full xl:w-48 flex-shrink-0 group flex items-center">
          <DatePicker
            date={dateFiltro}
            setDate={setDateFiltro}
            placeholder="Data"
            className="w-full border-none shadow-none focus-visible:ring-0 bg-transparent text-muted-foreground"
          />
        </div>

        <div className="hidden xl:block w-px h-6 bg-border mx-2" />

        <Select value={servicoFilter} onValueChange={setServicoFilter}>
          <SelectTrigger className="w-full xl:w-48 border-none bg-transparent focus:ring-0 shadow-none text-muted-foreground">
            <SelectValue placeholder="Tipo de serviço" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            <SelectItem value="todos" className="cursor-pointer">
              Todos
            </SelectItem>
            {servicosDisponiveis.map((servico) => (
              <SelectItem
                key={servico}
                value={servico}
                className="cursor-pointer"
              >
                {servico}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="hidden xl:block w-px h-6 bg-border mx-2" />

        <div className="relative flex-1 group flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
          <Input
            placeholder="Pesquisar solicitação..."
            className="pl-9 border-none bg-transparent focus-visible:ring-0 h-10 w-full text-sm shadow-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Button
          variant="secondary"
          className="w-full xl:w-auto h-10 bg-zinc-200 text-zinc-700 hover:bg-zinc-300 rounded-lg cursor-pointer ml-0 xl:ml-2"
          onClick={() => {
            setSearch("");
            setServicoFilter("");
            setDateFiltro(undefined);
          }}
        >
          Limpar filtros
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x h-132">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              col={col}
              items={filteredSolicitacoes.filter((s) => s.status === col.id)}
              onCardClick={(id) => navigate(`/admin/solicitacoes/${id}/editar`)}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
          {activeItem && activeColumn && (
            <Card
              className={`border-l-5 ${activeColumn.borderColor} shadow-xl rotate-2 opacity-95`}
            >
              <CardContent className="p-3 space-y-1">
                <p className="font-bold text-slate-800 text-sm">
                  #{activeItem.id} {activeItem.cliente}
                </p>
                <p className="text-slate-500 text-xs">{activeItem.servico}</p>
                <p className="text-slate-400 text-[10px]">
                  {new Date(activeItem.data + "T00:00:00").toLocaleDateString(
                    "pt-BR",
                  )}
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
