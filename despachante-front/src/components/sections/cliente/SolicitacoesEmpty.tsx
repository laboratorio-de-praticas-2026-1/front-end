// src/components/sections/cliente/SolicitacoesEmpty.tsx
import { Button } from "@/components/ui/button";
import emptyStateImage from "@/assets/vector-empty-state.png";

interface SolicitacoesEmptyProps {
  onNovaSolicitacao?: () => void;
}

export function SolicitacoesEmpty({ onNovaSolicitacao }: SolicitacoesEmptyProps) {
  const handleClick = () => {
    if (onNovaSolicitacao) {
      onNovaSolicitacao();
    } else {
      console.log("Abrir modal");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <img
        src={emptyStateImage}
        alt="Nenhum processo encontrado"
        className="w-48 h-48 md:w-64 md:h-64 object-contain mb-6"
      />
      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        Ops, parece que você não realizou
      </h2>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        nenhum processo
      </h2>
      <Button
        onClick={handleClick}
        className="bg-[#3979A5] hover:bg-[#2e5f83] text-white"
      >
        Nova solicitação
      </Button>
    </div>
  );
}