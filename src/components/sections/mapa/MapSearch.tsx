import { useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";

interface MapSearchProps {
  tipo: string;
  cidade: string;
  onTipoChange: (tipo: string) => void;
  onCidadeChange: (cidade: string) => void;
  onSearch: () => void;
}

export default function MapSearch({
  tipo,
  cidade,
  onTipoChange,
  onCidadeChange,
  onSearch,
}: MapSearchProps) {
  const [open, setOpen] = useState(false);

  const tipos = ["Clínicas", "Vistoria", "Detran"];

  return (
    <div className="w-full max-w-lg flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8 h-12">
      
      {/* Dropdown tipo */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-4 border-r border-gray-100 text-gray-600 text-sm hover:bg-gray-50 transition-colors h-full"
        >
          {tipo}
          <ChevronDown className="w-4 h-4" />
        </button>

        {open && (
          <div className="absolute top-full left-0 bg-white border shadow-md rounded-md mt-1 z-10">
            {tipos.map((t) => (
              <div
                key={t}
                onClick={() => {
                  onTipoChange(t);
                  setOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {t}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input cidade */}
      <div className="flex-1 flex items-center px-3 bg-white">
        {cidade && (
          <div className="flex items-center gap-2 bg-[#E2E8F0] px-3 py-1 rounded-full">
            <span className="text-xs font-medium text-gray-700">
              {cidade}
            </span>
            <X
              className="w-3 h-3 text-gray-500 cursor-pointer hover:text-gray-800"
              onClick={() => onCidadeChange("")}
            />
          </div>
        )}

        <input
          type="text"
          value={cidade}
          onChange={(e) => onCidadeChange(e.target.value)}
          placeholder="Buscar cidade..."
          className="flex-1 outline-none px-3 text-sm text-gray-700 placeholder:text-gray-400"
        />
      </div>

      {/* Botão buscar */}
      <button
        onClick={onSearch}
        className="bg-[#002749] w-14 flex items-center justify-center hover:bg-[#001d36] transition-colors shrink-0"
      >
        <Search className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}