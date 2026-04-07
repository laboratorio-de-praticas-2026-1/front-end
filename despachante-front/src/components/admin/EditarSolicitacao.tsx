import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Info, CalendarCheck, ClipboardList, Paperclip, Car, User, Download, Pencil, Printer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DatePicker } from '../ui/DatePicker';
import { solicitacoesService, type Documento, type DocumentoStatus, type Solicitacao } from '@/services/solicitacoesService';
import ModalAlterarStatusDocumento from './solicitacoes/ModalAlterarStatusDocumento'

const status_labels: Record<string, string> = {
  recebido: 'Recebido',
  em_andamento: 'Em andamento',
  aguardando_pagamento: 'Aguardando pagamento',
  aguardando_documento: 'Aguardando documento',
  cancelado: 'Cancelado',
  concluido: 'Concluído',
};

// cores da badge de status da solicitação
const status_badge_variant: Record<string, string> = {
  recebido: 'bg-slate-200 text-slate-700',
  em_andamento: 'bg-[#8ACEFF] text-[#003f6b]',
  aguardando_pagamento: 'bg-[#FFC654] text-[#6b4200]',
  aguardando_documento: 'bg-[#B57900] text-white',
  cancelado: 'bg-[#F7A9A7] text-[#7a1a1a]',
  concluido: 'bg-[#A9DEB4] text-[#1a5c29]',
};

// cores das badges de status dos documentos
const doc_status_config: Record<DocumentoStatus, { label: string; className: string }> = {
  validado: { label: 'Validado', className: 'bg-green-100 text-green-700' },
  aguardando_revisao: { label: 'Aguardando revisão', className: 'bg-orange-100 text-orange-700' },
  negado: { label: 'Negado', className: 'bg-red-100 text-red-700' },
};

const servicos = [
  'Transferência',
  'Licenciamento',
  'Renovação',
];

const EditarSolicitacao = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);
  const [servico, setServico] = useState('');
  const [cliente, setCliente] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [observacao, setObservacao] = useState('');
  const [documentosState, setDocumentosState] = useState<Documento[]>([]);
  const [modalDocumento, setModalDocumento] = useState<{
    aberto: boolean;
    index: number | null;
  }>({ aberto: false, index: null });

  useEffect(() => {
    const carregar = async () => {
      if (!id) return;
      setIsLoading(true);
      const dados = await solicitacoesService.buscarPorId(id);
      if (dados) {
        setSolicitacao(dados);
        setServico(dados.servico);
        setCliente(dados.cliente);
        setVeiculo(dados.veiculo ?? '');
        setStatus(dados.status);
        setDate(dados.data ? new Date(dados.data) : undefined);
        setObservacao(dados.observacao ?? '');
        setDocumentosState(dados.documentos ?? []);
      }
      setIsLoading(false);
    };
    carregar();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Carregando solicitação...
      </div>
    );
  }

  if (!solicitacao) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Solicitação não encontrada.
      </div>
    );
  }

  const handleSalvar = async () => {
    if (!id) return;
    const sucesso = await solicitacoesService.atualizarStatus(id, status);
    if (sucesso) {
      navigate('/admin/solicitacoes');
    } else {
      alert('Erro ao salvar solicitação');
    }
  };

  const handleCancelar = () => navigate('/admin/solicitacoes');

  const handleSalvarStatusDocumento = async (novoStatus: DocumentoStatus) => {
    if (modalDocumento.index === null || !id) return;
    const doc = documentosState[modalDocumento.index];
    const sucesso = await solicitacoesService.alterarStatusDocumento(
      id,
      doc.arquivo,
      novoStatus
    );
    if (sucesso) {
      setDocumentosState(prev =>
        prev.map((d, i) =>
          i === modalDocumento.index ? { ...d, status: novoStatus } : d
        )
      );
    }
  };

  const handleDownload = async (arquivo: string) => {
    if (!id) return;
    const url = await solicitacoesService.downloadDocumento(id, arquivo);
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('Erro ao baixar documento');
    }
  };

  const documentos: Documento[] = documentosState;

  return (
    <div className="bg-[#f8fafc] min-h-screen space-y-6 font-sans pb-10">

      {/* cabeçalho */}
      <header>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-secondary">
            Detalhes da solicitação #{id}
          </h1>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status_badge_variant[status]}`}>
            {status_labels[status]}
          </span>
        </div>
        <p className="text-slate-500 text-sm mt-1">
          Gerencie e atualize as informações desta solicitação de serviço.
        </p>
      </header>

      {/* informações gerais */}
      <Card className="border-slate-100">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-base">
            <Info className="size-6 text-slate-500" />
            Informações Gerais
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-slate-500 text-xs">ID da solicitação</Label>
              <Input value={`#${id}`} readOnly className="bg-slate-100 text-slate-400 cursor-not-allowed" />
            </div>

            {/* tipo de serviço */}
            <div className="space-y-1.5">
              <Label className="text-slate-500 text-xs">Tipo de serviço</Label>
              <Select value={servico} onValueChange={setServico}>
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent className="bg-white border-0">
                  {servicos.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* cliente */}
            <div className="space-y-1.5">
              <Label className="text-slate-500 text-xs">Cliente / Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  value={cliente}
                  onChange={e => setCliente(e.target.value)}
                  className="pl-9 border-slate-200"
                />
              </div>
            </div>

            {/* veículo */}
            <div className="space-y-1.5">
              <Label className="text-slate-500 text-xs">Veículo</Label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  value={veiculo}
                  onChange={e => setVeiculo(e.target.value)}
                  className="pl-9 border-slate-200"
                  placeholder="Modelo - Placa"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* status e prazos */}
      <Card className="border-slate-100">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-base">
            <CalendarCheck className="size-6 text-slate-500" />
            Status e Prazos
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* status atual */}
            <div className="space-y-1.5">
              <Label className="text-slate-500 text-xs">Status atual</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-0">
                  {Object.entries(status_labels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* data */}
            <div className="space-y-1.5">
              <Label className="text-slate-500 text-xs">Data de solicitação</Label>
              <DatePicker date={date} setDate={setDate} placeholder="Data" className="w-full xl:w-auto min-w-35" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* observação do administrador */}
      <Card className="border-slate-100">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold text-base">
            <ClipboardList className="size-6" />
            Observação do administrador
          </div>
          <Textarea
            placeholder="Notas internas da administração..."
            value={observacao}
            onChange={e => setObservacao(e.target.value)}
            className="border-slate-200 min-h-24 resize-none"
          />
        </CardContent>
      </Card>

      {/* documentos */}
      <Card className="border-slate-100">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-base">
            <Paperclip className="size-6 text-slate-500" />
            Documentos da solicitação
          </div>

          {documentos.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">Nenhum documento anexado.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100">
                    <TableHead className="text-slate-500 text-xs">Arquivo</TableHead>
                    <TableHead className="text-slate-500 text-xs">Tipo</TableHead>
                    <TableHead className="text-slate-500 text-xs">Status</TableHead>
                    <TableHead className="text-slate-500 text-xs text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentos.map((doc, i) => {
                    const cfg = doc_status_config[doc.status];
                    return (
                      <TableRow key={i} className="border-slate-50">
                        <TableCell className="text-sm text-slate-700 font-medium">{doc.arquivo}</TableCell>
                        <TableCell className="text-sm text-slate-500">{doc.tipo}</TableCell>
                        <TableCell>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.className}`}>
                            {cfg.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <button className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" onClick={() => handleDownload(doc.arquivo)}>
                              <Download className="size-4" />
                            </button>
                            <button className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" onClick={() => setModalDocumento({ aberto: true, index: i })}>
                              <Pencil className="size-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* rodapé */}
      <div className="flex justify-end gap-3 flex-wrap">
        <Button variant="ghost" onClick={handleCancelar} className="text-slate-600">
          Cancelar alterações
        </Button>
        <Button onClick={handleSalvar} className="bg-primary text-white gap-2">
          <Printer className="size-4" />
          Salvar solicitação
        </Button>
      </div>

      {modalDocumento.aberto && modalDocumento.index !== null && (
        <ModalAlterarStatusDocumento
          open={modalDocumento.aberto}
          onOpenChange={aberto => setModalDocumento(prev => ({ ...prev, aberto }))}
          nomeArquivo={documentosState[modalDocumento.index].arquivo}
          statusAtual={documentosState[modalDocumento.index].status}
          onSalvar={handleSalvarStatusDocumento}
        />
      )}
      
    </div>
  );
};

export default EditarSolicitacao;
