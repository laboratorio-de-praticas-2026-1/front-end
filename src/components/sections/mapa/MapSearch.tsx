import { Search, ChevronDown, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const FILTROS = ["Clínicas", "Vistoria", "Detran"];

interface MapSearchProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function MapSearch({ activeFilter, onFilterChange }: MapSearchProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-lg flex bg-white rounded-xl shadow-sm border border-gray-100 h-12 relative mb-8">
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 px-4 border-r border-gray-100 text-gray-600 text-sm hover:bg-gray-50 transition-colors h-full rounded-l-xl"
        >
          {activeFilter || "Filtro"}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute top-[calc(100%+4px)] left-0 bg-white border border-gray-100 rounded-xl shadow-md z-50 min-w-[130px] overflow-hidden">
            {FILTROS.map((filtro) => (
              <button
                key={filtro}
                onClick={() => {
                  onFilterChange(filtro);
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  activeFilter === filtro
                    ? "bg-[#E2E8F0] font-semibold text-gray-800"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {filtro}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 flex items-center px-3 bg-white overflow-hidden">
        {activeFilter && (
          <div className="flex items-center gap-2 bg-[#E2E8F0] px-3 py-1 rounded-full shrink-0">
            <span className="text-xs font-medium text-gray-700">{activeFilter}</span>
            <X
              className="w-3 h-3 text-gray-500 cursor-pointer hover:text-gray-800"
              onClick={() => onFilterChange("")}
            />
          </div>
        )}
        <input
          type="text"
          placeholder="Pesquisar..."
          className="flex-1 min-w-0 outline-none px-3 text-sm text-gray-700 placeholder:text-gray-400"
        />
      </div>

      <button className="bg-secondary w-14 flex items-center justify-center hover:bg-[#001d36] transition-colors shrink-0 rounded-r-xl">
        <Search className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}