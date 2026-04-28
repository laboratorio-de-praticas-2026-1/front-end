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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  dashboardService,
  type DashboardGeralResponse,
} from "@/services/dashboardService";
import {
  CalendarDays,
  CheckCircle,
  CircleDollarSign,
  File,
  FolderOpen,
  TrendingUp,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

interface MetricCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  iconBg: string;
}

function MetricCard({ icon, value, label, iconBg }: MetricCardProps) {
  return (
    <Card className="border-[#D2D5DB] shadow-none min-w-50">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className="flex items-center justify-center w-14 h-14 rounded-full shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-muted-foreground leading-tight">
            {value}
          </span>
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GeralDashboard() {
  const [g, setG] = useState<DashboardGeralResponse>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    dashboardService
      .getGeral()
      .then((data) => {
        console.log("Dados do dashboard geral:", data);
        setG(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados do dashboard geral:", error);
        setErrorMessage(
          "Erro ao carregar dados do dashboard geral. Por favor, tente novamente mais tarde.",
        );
      });
  }, []);

  const debitosEmAberto = g?.debitosEmAberto?.listaDetalhada.map(
    (c) => ({
      cliente: c.nomeCliente ? c.nomeCliente : "Cliente Desconhecido",
      tipo: c.nomeServico ? c.nomeServico : "Débito",
      valor: `R$ ${c.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    }),
  ) || [];

  return (
    <>
      <span className="text-2xl font-bold text-secondary mb-6 block">
        Geral
      </span>

      <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-4">
        <MetricCard
          iconBg="#F5A623"
          icon={<FolderOpen className="w-6 h-6 text-white" />}
          value={g?.solicitacoesEmAberto ?? 0}
          label="Solicitações em aberto"
        />
        <MetricCard
          iconBg="#27AE60"
          icon={<CheckCircle className="w-6 h-6 text-white" />}
          value={g?.solicitacoesConcluidas ?? 0}
          label="Solicitações concluídas"
        />
        <MetricCard
          iconBg="#E74C3C"
          icon={<File className="w-6 h-6 text-white" />}
          value={g?.documentosPendentesValidacao ?? 0}
          label="Documentos Pendentes"
        />
        <MetricCard
          iconBg="#2980B9"
          icon={<User className="w-6 h-6 text-white" />}
          value={g?.clientesNovosMesAtual ?? 0}
          label="Clientes Novos"
        />
        <MetricCard
          iconBg="#1B2A4A"
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          value={`${g?.taxaCancelamentoPct ?? 0}%`}
          label="Taxa de cancelamento"
        />
        <MetricCard
          iconBg="#3AADE4"
          icon={<CircleDollarSign className="w-6 h-6 text-white" />}
          value={`R$ ${g?.debitosEmAberto?.valorTotal ? g.debitosEmAberto.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "0.00"}`}
          label="Débitos em Aberto"
        />
        <MetricCard
          iconBg="#9E9E9E"
          icon={<CalendarDays className="w-6 h-6 text-white" />}
          value={`${g?.parcelasVencidasNaoPagas.valorTotal ? `${g.parcelasVencidasNaoPagas.valorTotal}` : "0"}`}
          label="Parcelas Vencidas"
        />
      </div>

      <h3 className="text-lg font-bold text-secondary mb-4">
        Débitos em aberto
      </h3>
      <Card className="border-[#D2D5DB] shadow-none overflow-auto">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary">
              <TableRow>
                <TableHead className="text-white font-semibold px-6 py-4">
                  Cliente
                </TableHead>
                <TableHead className="text-white font-semibold px-6 py-4">
                  Tipo
                </TableHead>
                <TableHead className="text-white font-semibold px-6 py-4">
                  Valor
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {debitosEmAberto.length > 0 ? (
                debitosEmAberto.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="px-6 py-4 text-muted-foreground">
                      {row.cliente}
                    </TableCell>
                    <TableCell className="px-6 py-4">{row.tipo}</TableCell>
                    <TableCell className="px-6 py-4">{row.valor}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Nenhum débito em aberto
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
    </>
  );
}
