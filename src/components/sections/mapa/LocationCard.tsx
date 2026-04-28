import { Star } from "lucide-react";

interface LocationCardProps {
  nome: string;
  tipo: string;
  nota: number;
  endereco: string;
  horario?: string;
  imagem: string;
  isActive: boolean;
  onClick: () => void;
}

export default function LocationCard({ nome, tipo, nota, endereco, horario, imagem, isActive, onClick }: LocationCardProps) {
  return (
    <div 
      onClick={onClick}
      className={` rounded-3xl p-3 flex gap-4 cursor-pointer transition-all duration-200 border-2 ${
        isActive 
          ? "bg-[#F8FAFC] border-[#3498DB] shadow-md scale-[1.02]" 
          : "bg-white border-transparent shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-lg hover:border-gray-200"
      }`}
    >
      <img
        src={imagem}
        alt={nome}
        className="w-[140px] h-[110px] object-cover rounded-2xl shrink-0"
      />
      <div className="flex flex-col justify-center">
        <h3 className="font-bold text-[#1E293B] text-lg leading-tight mb-1">{nome}</h3>
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 fill-[#FACC15] text-[#FACC15]" />
          <span className="text-sm font-semibold text-gray-700">{nota}</span>
          <span className="text-sm text-gray-500">{tipo}</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
          {endereco}
          {horario && <><br />{horario}</>}
        </p>
      </div>
    </div>
  );
}