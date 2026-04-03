import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, CircleSlash } from 'lucide-react';

type DocumentoStatus = 'validado' | 'aguardando_revisao' | 'negado';

type StatusOption = {
  value: DocumentoStatus;
  label: string;
  icon: React.ReactNode;
  activeClassName: string;
  inactiveClassName: string;
};

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: 'validado',
    label: 'Validado',
    icon: <CheckCircle2 className="size-4" />,
    activeClassName: 'bg-green-500 text-white border-green-500 shadow-sm shadow-green-200',
    inactiveClassName:
      'bg-white text-green-700 border-green-300 hover:bg-green-50 hover:border-green-400',
  },
  {
    value: 'aguardando_revisao',
    label: 'Aguardando revisão',
    icon: <Clock className="size-4" />,
    activeClassName: 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-200',
    inactiveClassName:
      'bg-white text-amber-700 border-amber-300 hover:bg-amber-50 hover:border-amber-400',
  },
  {
    value: 'negado',
    label: 'Negado',
    icon: <CircleSlash className="size-4" />,
    activeClassName: 'bg-red-700 text-white border-red-700 shadow-sm shadow-red-200',
    inactiveClassName:
      'bg-white text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400',
  },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nomeArquivo: string;
  statusAtual: DocumentoStatus;
  // onSalvar será chamado com o novo status; integração com API fica por conta do componente pai
  onSalvar: (novoStatus: DocumentoStatus) => void;
};

const ModalAlterarStatusDocumento = ({
  open,
  onOpenChange,
  nomeArquivo,
  statusAtual,
  onSalvar,
}: Props) => {
  const [statusSelecionado, setStatusSelecionado] = useState<DocumentoStatus>(statusAtual);

  const handleSalvar = () => {
    onSalvar(statusSelecionado);
    onOpenChange(false);
  };

  const handleVoltar = () => {
    setStatusSelecionado(statusAtual); // reset ao fechar sem salvar
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-0 overflow-hidden">

        <div className="px-6 pt-5 pb-6 space-y-5">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base font-semibold text-slate-800">
              Editar status
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 font-normal">
              Documento:{' '}
              <span className="font-medium text-slate-500">{nomeArquivo}</span>
            </DialogDescription>
          </DialogHeader>

          {/* botões de status */}
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map(option => {
              const isActive = statusSelecionado === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatusSelecionado(option.value)}
                  className={`
                    flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold
                    border transition-all duration-150 cursor-pointer select-none
                    ${isActive ? option.activeClassName : option.inactiveClassName}
                  `}
                >
                  {option.icon}
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* rodapé */}
          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="ghost"
              onClick={handleVoltar}
              className="text-slate-600 hover:text-slate-800 text-sm"
            >
              Voltar
            </Button>
            <Button
              onClick={handleSalvar}
              className="bg-primary text-white text-sm px-5 hover:bg-primary/90"
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAlterarStatusDocumento;