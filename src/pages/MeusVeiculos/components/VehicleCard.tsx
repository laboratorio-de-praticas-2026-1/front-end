import { useNavigate } from 'react-router-dom';
import { ChevronRight, Car, Calendar, Trash2 } from 'lucide-react';
import type { VeiculoApi } from '@/services/veiculoService';

interface VehicleCardProps {
  veiculo: VeiculoApi;
  onDelete: () => void;
}

export function VehicleCard({ veiculo, onDelete }: VehicleCardProps) {
  const navigate = useNavigate();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita navegar para os detalhes ao clicar em excluir
    if (confirm('Tem certeza que deseja remover este veículo?')) {
      onDelete();
    }
  };

  return (
    <div 
      onClick={() => navigate(`/cliente/meus-veiculos/${veiculo.id}`)}
      className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm bg-gradient-to-br from-[#AFDAF6] to-[#2689D1] text-[#023047] transition-transform group-hover:scale-105">
          <Car size={38} strokeWidth={2.5} />
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="bg-[#023047] text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded w-fit">
            {veiculo.placa}
          </span>
          
          <h3 className="font-bold text-[#023047] text-base leading-tight">
            {veiculo.marca} {veiculo.modelo}
          </h3>
          
          <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5">
            <Calendar size={14} className="text-gray-400" />
            {veiculo.anoFabricacao}/{veiculo.anoModelo}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleDeleteClick}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="Excluir veículo"
        >
          <Trash2 size={20} />
        </button>
        <ChevronRight className="text-[#6C6C6C] transition-colors" size={24} />
      </div>
    </div>
  );
}