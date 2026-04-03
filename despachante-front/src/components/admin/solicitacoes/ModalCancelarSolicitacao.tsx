import { Button } from "@/components/ui/button";

type Solicitacao = {
  id: number;
  cliente: string;
  servico: string;
  data: string;
  status: string;
};

type ModalCancelarSolicitacaoProps = {
  solicitacao: Solicitacao;
  onConfirm: () => void;
  onCancel: () => void;
};

const ModalCancelarSolicitacao = ({
  solicitacao,
  onConfirm,
  onCancel,
}: ModalCancelarSolicitacaoProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8">
        
        {/* Título */}
        <h2 className="text-xl font-bold text-slate-800 mb-3">
          Cancelar solicitação?
        </h2>

        {/* Descrição */}
        <p className="text-slate-600 text-sm leading-relaxed mb-8">
          Tem certeza que deseja cancelar a solicitação{" "}
          <strong className="text-slate-800">
            #{solicitacao.id}
          </strong>
          ? O usuário{" "}
          <strong className="text-slate-800">
            {solicitacao.cliente}
          </strong>{" "}
          receberá uma notificação sobre o cancelamento.
        </p>

        {/* Botões */}
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>
            Voltar
          </Button>

          <Button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalCancelarSolicitacao;