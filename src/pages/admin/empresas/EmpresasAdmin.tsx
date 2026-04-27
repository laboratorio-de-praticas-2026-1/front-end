import { useState } from "react";
import { Plus, Search, ChevronRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { EmpresaTable } from "@/components/tables/EmpresaTable";
import type { EmpresaFilters } from "@/types/empresa.types"; 
import { MOCK_EMPRESAS } from "@/mocks/empresas.mock";

export const EmpresasAdmin = () => {
  const [filters, setFilters] = useState<EmpresaFilters>({
    tipo: "",
    estado: "",
    cidade: "",
    search: "",
    page: 1,
  });

  const handleFilterChange = (key: keyof EmpresaFilters, value: string) => {
    setFilters((prev) => ({ 
      ...prev, 
      [key]: value === "all" ? "" : value, 
      page: 1 
    }));
  };

  const handleClearFilters = () => {
    setFilters({ tipo: "", estado: "", cidade: "", search: "", page: 1 });
  };

  const filteredData = MOCK_EMPRESAS.filter((emp) => {
    const matchesSearch = emp.nomeFantasia.toLowerCase().includes(filters.search?.toLowerCase() || "");
    const matchesTipo = filters.tipo ? emp.tipo === filters.tipo : true;
    const matchesCidade = filters.cidade ? emp.cidade === filters.cidade : true;
    const matchesEstado = filters.estado ? emp.estado === filters.estado : true;
    return matchesSearch && matchesTipo && matchesCidade && matchesEstado;
  });

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#001f3f]">Empresas</h1>
          <p className="text-muted-foreground text-sm">
            Visualize, crie, organize e gerencie todas as empresas que aparecerão no mapa.
          </p>
        </div>
        <Button className="bg-[#1e90ff] hover:bg-blue-600 gap-2">
          <Plus size={20} /> Nova empresa
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center bg-white p-4 border rounded-xl mb-6 shadow-sm relative z-50">
        <div className="w-[150px]">
          <Select value={filters.tipo || "all"} onValueChange={(v) => handleFilterChange("tipo", v)}>
            <SelectTrigger className="bg-white"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent className="z-[100] bg-white">
              <SelectItem value="all">Tipo</SelectItem> 
              <SelectItem value="Detran">Detran</SelectItem>
              <SelectItem value="Clínica">Clínica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-[150px]">
          <Select value={filters.estado || "all"} onValueChange={(v) => handleFilterChange("estado", v)}>
            <SelectTrigger className="bg-white"><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent className="z-[100] bg-white">
              <SelectItem value="all">Estado</SelectItem>
              <SelectItem value="SP">São Paulo</SelectItem>
              <SelectItem value="RJ">Rio de Janeiro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-[180px]">
          <Select value={filters.cidade || "all"} onValueChange={(v) => handleFilterChange("cidade", v)}>
            <SelectTrigger className="bg-white"><SelectValue placeholder="Cidade" /></SelectTrigger>
            <SelectContent className="z-[100] bg-white">
              <SelectItem value="all">Cidade</SelectItem>
              <SelectItem value="Registro">Registro</SelectItem>
              <SelectItem value="Pariquera-Açu">Pariquera-Açu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar empresa..."
            className="pl-10 bg-white"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <button 
          onClick={handleClearFilters} 
          className="px-4 py-2 bg-[#e9ecef] hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-medium transition-colors"
        >
          Limpar filtros
        </button>
      </div>

      <div className="relative z-10">
        <EmpresaTable 
          data={filteredData} 
          onEdit={(id) => console.log("Editar:", id)} 
          onDelete={(id) => console.log("Excluir:", id)} 
        />
      </div>

      <div className="mt-8 grid grid-cols-3 items-center">
        {/* Coluna Esquerda Vazia para garantir centralização do meio */}
        <div></div>

        <div className="flex items-center justify-center gap-2">
          <button className="flex items-center gap-1 px-3 py-2 text-gray-400 cursor-not-allowed text-sm" disabled>
            Previous
          </button>
          
          {/* Página Ativa */}
          <button className="w-10 h-10 flex items-center justify-center border rounded-xl border-gray-200 text-[#103454] font-bold shadow-sm bg-white">
            1
          </button>
          
          <button className="w-10 h-10 flex items-center justify-center text-[#103454] hover:bg-gray-50 rounded-lg transition-colors font-medium">
            2
          </button>
          
          <button className="w-10 h-10 flex items-center justify-center text-[#103454] hover:bg-gray-50 rounded-lg transition-colors font-medium">
            3
          </button>

          <span className="px-2 text-[#103454] font-medium">...</span>
          
          <button className="flex items-center gap-1 px-3 py-2 text-[#103454] font-bold hover:underline transition-all text-sm">
            Next <ChevronRight size={18} />
          </button>
        </div>

        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {filteredData.length} resultados encontrados
          </p>
        </div>
      </div>
    </div>
  );
};