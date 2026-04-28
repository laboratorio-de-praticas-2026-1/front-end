import { SlidersHorizontal } from "lucide-react";
import LocationCard from "./LocationCard";
import type { Local } from "@/pages/Mapa";

interface MapSidebarProps {
  locais: Local[];
  activeLocation: Local;
  onLocationSelect: (local: Local) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function MapSidebar({ locais, activeLocation, onLocationSelect, activeFilter, onFilterChange }: MapSidebarProps) {
  const filtros = ["Clínicas", "Vistoria", "Detran"];

  return (
    <div className="w-full lg:w-[450px] flex flex-col h-full shrink-0 min-h-0">
      <h1 className="text-3xl text-gray-600 font-light mb-6 shrink-0">
        Encontre em <span className="font-bold text-[#1E293B]">Registro-SP</span>
      </h1>

      <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 shrink-0 custom-scrollbar ">
        {filtros.map((filtro) => (
          <button 
            key={filtro}
            onClick={() => onFilterChange(filtro)}
            className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === filtro 
                ? "bg-[#82B1E1] text-white" 
                : "border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {filtro}
          </button>
        ))}
        <button className="text-gray-500 hover:text-gray-800 ml-auto shrink-0">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="pl-1 pt-1 flex-1 overflow-y-auto pr-4 pb-4 space-y-4 custom-scrollbar min-h-0">
        {locais.length > 0 ? (
          locais.map((local) => (
            <LocationCard 
              key={local.id} 
              {...local} 
              isActive={activeLocation?.id === local.id}
              onClick={() => onLocationSelect(local)}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center mt-10">Nenhum local encontrado para este filtro.</p>
        )}
      </div>
    </div>
  );
}