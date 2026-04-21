import mockDashboard from "@/mocks/mockDashboard.json";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FolderOpen,
  CheckCircle,
  File,
  User,
  TrendingUp,
  CalendarDays,
  CircleDollarSign,
} from "lucide-react";

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
          <span className="text-2xl font-bold text-muted-foreground leading-tight">{value}</span>
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GeralDashboard() {
  const g = mockDashboard.geral;

  const debitosEmAberto = mockDashboard.clientes.comParcelasEmAtraso.map((c) => ({
    cliente: c.nome,
    tipo: "Parcelas em atraso",
    valor: `R$ ${c.valorTotalAtrasado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
  }));

  return (
    <>
      <span className="text-2xl font-bold text-secondary mb-6 block">Geral</span>

      <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-4">
        <MetricCard
          iconBg="#F5A623"
          icon={<FolderOpen className="w-6 h-6 text-white" />}
          value={g.solicitacoesEmAberto}
          label="Solicitações em aberto"
        />
        <MetricCard
          iconBg="#27AE60"
          icon={<CheckCircle className="w-6 h-6 text-white" />}
          value={g.solicitacoesConcluidas}
          label="Solicitações concluídas"
        />
        <MetricCard
          iconBg="#E74C3C"
          icon={<File className="w-6 h-6 text-white" />}
          value={g.documentosPendentesValidacao}
          label="Documentos Pendentes"
        />
        <MetricCard
          iconBg="#2980B9"
          icon={<User className="w-6 h-6 text-white" />}
          value={g.clientesNovosMesAtual}
          label="Clientes Novos"
        />
        <MetricCard
          iconBg="#1B2A4A"
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          value={`${g.taxaCancelamentoPct}%`}
          label="Taxa de cancelamento"
        />
        <MetricCard
          iconBg="#3AADE4"
          icon={<CircleDollarSign className="w-6 h-6 text-white" />}
          value={`${g.debitosEmAberto.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          label="Débitos em Aberto"
        />
        <MetricCard
          iconBg="#9E9E9E"
          icon={<CalendarDays className="w-6 h-6 text-white" />}
          value={`${g.parcelasVencidasNaoPagas.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          label="Parcelas Vencidas"
        />
      </div>

      <h3 className="text-lg font-bold text-secondary mb-4">Débitos em aberto</h3>
      <Card className="border-[#D2D5DB] shadow-none overflow-auto">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary">
              <TableRow>
                <TableHead className="text-white font-semibold px-6 py-4">Cliente</TableHead>
                <TableHead className="text-white font-semibold px-6 py-4">Tipo</TableHead>
                <TableHead className="text-white font-semibold px-6 py-4">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {debitosEmAberto.length > 0 ? (
                debitosEmAberto.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="px-6 py-4 text-muted-foreground">{row.cliente}</TableCell>
                    <TableCell className="px-6 py-4">{row.tipo}</TableCell>
                    <TableCell className="px-6 py-4">{row.valor}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhum débito em aberto
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
