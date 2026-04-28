import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Hash, 
  Car, 
  Calendar, 
  FileText, 
  Bell, 
  Pencil, 
  Trash2,
  Check
} from "lucide-react";

export function DetalhesVeiculo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [alertasAtivos, setAlertasAtivos] = useState(false);
  const [veiculo, setVeiculo] = useState<any>(null);

  useEffect(() => {
    async function loadVeiculo() {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setVeiculo({
        id,
        marca: "Toyota",
        modelo: "Corolla",
        placa: "ABC-1D23",
        renavam: "00123456789",
        anoFabricacao: "2023",
        anoModelo: "2024",
        alertas: true
      });
      setAlertasAtivos(true);
      setIsLoading(false);
    }
    loadVeiculo();
  }, [id]);

  const handleToggleAlertas = async () => {
    const novoEstado = !alertasAtivos;
    setAlertasAtivos(novoEstado);
    
    try {
      console.log(`PATCH: Atualizando alertas do veículo ${id} para ${novoEstado}`);
    } catch (error) {
      setAlertasAtivos(!novoEstado);
    }
  };

  if (isLoading) return <DetalhesSkeleton />;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-all"
        >
          <ArrowLeft size={24} className="text-[#333333]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#333333] flex items-center gap-3">
            {veiculo.marca} {veiculo.modelo}
          </h1>
          <p className="text-[#6C6C6C] text-sm">Veja tudo sobre seu veículo</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="bg-[#002749] p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-[#AFDAF6] to-[#2689D1] text-[#023047]">
            <Car size={38} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{veiculo.marca}</h3>
            <p className="text-white">{veiculo.modelo}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-[#5D96C0] text-white text-xs font-bold rounded uppercase border border-[#5D96C0]">
              {veiculo.placa}
            </span>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-8">
          <InfoItem icon={<Hash size={24} />} label="Placa do veículo" value={veiculo.placa} />
          <InfoItem icon={<Car size={24} />} label="Marca" value={veiculo.marca} />
          <InfoItem icon={<Car size={24} />} label="Modelo" value={veiculo.modelo} />
          <InfoItem icon={<FileText size={24} />} label="RENAVAM" value={veiculo.renavam} />
          <InfoItem icon={<Calendar size={24} />} label="Ano de fabricação" value={veiculo.anoFabricacao} />
          <InfoItem icon={<Calendar size={24} />} label="Ano do modelo" value={veiculo.anoModelo} />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-[#333333] mb-4">Alertas</h3>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-[#002749] bg-gradient-to-br from-[#B3DCF7] to-[#2689D1] shadow-sm">
              <Bell size={28} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[#333333] text-lg">Alertas de multas de trânsito</p>
              <p className="text-sm text-[#6C6C6C]">Receba notificações sobre novas multas e penalidades.</p>
            </div>
          </div>
          
          <button 
            onClick={handleToggleAlertas}
            className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${alertasAtivos ? 'bg-[#5D96C0]' : 'bg-gray-300'}`}
          >
            <div className={`w-6 h-6 rounded-full shadow-md transform transition-all flex items-center justify-center ${alertasAtivos ? 'translate-x-6 bg-[#002749]' : 'translate-x-0 bg-white'}`}>
              {alertasAtivos && <Check size={14} className="text-white" />}
            </div>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#5D96C0] hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-sm">
          <Pencil size={18} />
          Editar dados do veículo
        </button>
        
        <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#D93E39] hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-sm">
          <Trash2 size={18} />
          Excluir
        </button>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-[#BCE1F9] rounded-xl flex items-center justify-center text-[#002749] shrink-0">
        {icon}
      </div>
      <div className="flex flex-col">
        <p className="text-[15px] text-[#333333] font-bold leading-tight mb-1">
          {label}
        </p>
        <p className="text-[14px] text-[#6C6C6C] font-medium leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

function DetalhesSkeleton() {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-pulse">
      <div className="h-10 w-48 bg-gray-200 rounded mb-8" />
      <div className="h-48 w-full bg-gray-200 rounded-2xl mb-8" />
      <div className="h-24 w-full bg-gray-200 rounded-2xl mb-8" />
      <div className="flex gap-4">
        <div className="h-12 flex-1 bg-gray-200 rounded-xl" />
        <div className="h-12 flex-1 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}