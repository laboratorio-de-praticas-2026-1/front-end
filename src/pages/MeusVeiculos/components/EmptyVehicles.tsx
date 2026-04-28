import emptyStateImg from '@/assets/vector-empty-state.png';

interface EmptyVehiclesProps {
  onOpenModal: () => void;
}

export function EmptyVehicles({ onOpenModal }: EmptyVehiclesProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <img 
        src={emptyStateImg} 
        alt="Nenhum veículo encontrado" 
        className="w-full max-w-sm mb-6"
      />
      
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Ops, parece que você não possui <br />
        nenhum veículo registrado ainda.
      </h2>
      
      <button 
        type="button"
        className="mt-4 bg-[#3979A5] hover:bg-[#2d5f82] text-white font-medium py-2 px-8 rounded-lg transition-colors"
        onClick={onOpenModal}
      >
        Registrar veículo
      </button>
    </div>
  );
}