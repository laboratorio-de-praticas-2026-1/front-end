import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  loading?: boolean;
}

export function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  userName,
  loading = false,
}: ConfirmDeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Excluir usuário?
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600">
          Tem certeza que deseja excluir o usuário{" "}
          <span className="font-semibold">{userName}</span>? O usuário será removido do site imediatamente e perderá acesso aos dados anteriormente cadastrados.
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Voltar
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600"
          >
            {loading ? "Excluindo..." : "Excluir"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}