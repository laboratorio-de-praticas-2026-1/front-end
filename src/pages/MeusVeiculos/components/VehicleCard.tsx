import { useNavigate } from 'react-router-dom';
import { ChevronRight, Car } from 'lucide-react';
import type { Veiculo } from '@/types/veiculo';

interface VehicleCardProps {
  veiculo: Veiculo;
}

export function VehicleCard({ veiculo }: VehicleCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/cliente/meus-veiculos/${veiculo.id}`)}
      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
          <Car size={24} />
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="bg-[#0F172A] text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded w-fit">
            {veiculo.placa}
          </span>
          <h3 className="font-semibold text-gray-800 leading-none">
            {veiculo.marca} {veiculo.modelo}
          </h3>
          <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
            <span role="img" aria-label="calendário">📅</span> {veiculo.anoFabricacao}/{veiculo.anoModelo}
          </p>
        </div>
      </div>

      <ChevronRight className="text-gray-400 group-hover:text-blue-600 transition-colors" size={24} />
    </div>
  );
}