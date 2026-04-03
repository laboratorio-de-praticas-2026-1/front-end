import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModalNovaSolicitacao } from "@/components/sections/cliente/ModalNovaSolicitacao";

export default function Solicitacoes() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Solicitações</h1>
        <Button onClick={() => setModalOpen(true)}>
          Nova solicitação
        </Button>
      </div>

      <div className="text-muted-foreground">
        Em breve: dashboard de solicitações e estatísticas.
      </div>

      <ModalNovaSolicitacao open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}