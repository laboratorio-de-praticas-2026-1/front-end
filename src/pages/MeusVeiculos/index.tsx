import { useState } from 'react';
import { EmptyVehicles } from './components/EmptyVehicles';
import { VehicleCard } from './components/VehicleCard';
import { AddVehicleModal } from './components/AddVehicleModal';
import type { Veiculo } from '@/types/veiculo';

const VEICULOS_MOCK: Veiculo[] = [
  { 
    id: '1', 
    placa: 'ABC-1D23', 
    renavam: '00123456789',
    marca: 'Toyota', 
    modelo: 'Corolla', 
    anoFabricacao: 2023, 
    anoModelo: 2024 
  },
  { 
    id: '2', 
    placa: 'XYZ-5E67', 
    renavam: '98765432100',
    marca: 'Honda', 
    modelo: 'Civic', 
    anoFabricacao: 2022, 
    anoModelo: 2023 
  },
  { 
    id: '3', 
    placa: 'DEF-8G90', 
    renavam: '55566677788',
    marca: 'Volkswagen', 
    modelo: 'Golf', 
    anoFabricacao: 2021, 
    anoModelo: 2022 
  },
];

export default function MeusVeiculos() {

  const [veiculos] = useState<Veiculo[]>(VEICULOS_MOCK);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#032a4e]">Meus veículos</h1>
          <p className="text-gray-500 text-sm">
            {veiculos.length > 0 
              ? `${veiculos.length} ${veiculos.length === 1 ? 'veículo registrado' : 'veículos registrados'}` 
              : "Registre seus veículos e acompanhe tudo sobre eles."}
          </p>
        </div>
        
        {veiculos.length > 0 && (
          <button 
            type="button"
            className="bg-[#3979A5] hover:bg-[#2d5f82] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-xl leading-none">+</span> Adicionar Veículo
          </button>
        )}
      </header>

      <main>
        {veiculos.length === 0 ? (
          <EmptyVehicles onOpenModal={() => setIsModalOpen(true)} />
        ) : (
          <div className="flex flex-col gap-4">
            {veiculos.map((veiculo) => (
              <VehicleCard key={veiculo.id} veiculo={veiculo} />
            ))}
          </div>
        )}
      </main>

      <AddVehicleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}