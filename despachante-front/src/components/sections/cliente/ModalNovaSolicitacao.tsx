import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModalNovaSolicitacaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuarioId: number;
  onSucesso?: () => void;
}

export function ModalNovaSolicitacao({
  open,
  onOpenChange,
  usuarioId,
}: ModalNovaSolicitacaoProps) {
  const observacoes = [
    "A branch atual do back ainda nao expoe GET /servicos para alimentar o select de servicos.",
    `Tambem nao existe GET /usuario/${usuarioId}/veiculos para listar os veiculos do cliente.`,
    "O POST /solicitacoes cria a solicitacao, mas nao devolve o id necessario para encadear o upload de arquivos no fluxo do modal.",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Nova solicitacao
          </DialogTitle>
          <p className="text-sm text-gray-600">
            O front foi ajustado para a branch atual da API e, nesta versao, a
            criacao pelo portal do cliente segue bloqueada por dependencias do
            back-end.
          </p>
        </DialogHeader>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">Bloqueios identificados nesta branch</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            {observacoes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="text-sm text-gray-600">
          Assim que esses endpoints estiverem disponiveis, o modal pode voltar a
          usar selects dinamicos e envio de arquivos sem recorrer a mocks.
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-[#3979A5] text-white hover:bg-[#2e5f83]"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
