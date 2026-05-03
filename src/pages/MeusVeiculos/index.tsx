import { useState, useEffect } from 'react';
import { EmptyVehicles } from './components/EmptyVehicles';
import { VehicleCard } from './components/VehicleCard';
import { AddVehicleModal } from './components/AddVehicleModal';
import { veiculoService } from '@/services/veiculoService';
import type { VeiculoApi } from '@/services/veiculoService';
import { toast } from 'sonner';

export default function MeusVeiculos() {
  const [veiculos, setVeiculos] = useState<VeiculoApi[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVeiculos = async () => {
    setIsLoading(true);
    try {
      const data = await veiculoService.listarTodos();
      setVeiculos(data);
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      toast.error('Erro ao carregar seus veículos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVeiculos();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await veiculoService.deletar(id);
      toast.success('Veículo removido com sucesso!');
      fetchVeiculos();
    } catch (error) {
      toast.error('Erro ao remover veículo.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 w-full max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3979A5]"></div>
      </div>
    );
  }

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
              <VehicleCard 
                key={veiculo.id} 
                veiculo={veiculo} 
                onDelete={() => handleDelete(veiculo.id)}
              />
            ))}
          </div>
        )}
      </main>

      <AddVehicleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchVeiculos}
      />
    </div>
  );
}