import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import MapSearch from "@/components/sections/mapa/MapSearch";
import MapSidebar from "@/components/sections/mapa/MapSidebar";
import MapView from "@/components/sections/mapa/MapView";
import { empresaService } from "@/services/empresaService";

export interface Local {
  id: number;
  nome: string;
  tipo: string;
  nota: number;
  endereco: string;
  horario?: string;
  imagem: string;
  lat: number;
  lng: number;
  categoria: string;
}

export default function Mapa() {
  const [activeFilter, setActiveFilter] = useState("Clínicas");
  const [cidade, setCidade] = useState("");
  const [locais, setLocais] = useState<Local[]>([]);
  const [activeLocation, setActiveLocation] = useState<Local | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEmpresas = async (filtro?: string, cidadeBusca?: string) => {
    try {
      setLoading(true);

      const tipoMap: Record<string, string> = {
        Clínicas: "clinica",
        Vistoria: "vistoria",
        Detran: "detran",
      };

      const tipo = filtro ? tipoMap[filtro] : undefined;

      const data = await empresaService.getEmpresas({
        tipo,
        cidade: cidadeBusca || undefined,
      });

      setLocais(data);

      if (data.length > 0) {
        setActiveLocation(data[0]);
      } else {
        setActiveLocation(null);
      }
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
      setLocais([]);
      setActiveLocation(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresas(activeFilter, cidade);
  }, []);

  useEffect(() => {
    fetchEmpresas(activeFilter, cidade);
  }, [activeFilter]);

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6] font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col w-full max-w-[1600px] mx-auto px-6 py-6 overflow-hidden">
        <MapSearch
          tipo={activeFilter}
          cidade={cidade}
          onTipoChange={setActiveFilter}
          onCidadeChange={setCidade}
          onSearch={() => fetchEmpresas(activeFilter, cidade)}
        />

        <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden min-h-0">
          <MapSidebar
            locais={locais}
            activeLocation={activeLocation as Local}
            onLocationSelect={(local) => setActiveLocation(local)}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {activeLocation && (
            <MapView
              locais={locais}
              activeLocation={activeLocation}
              onSelectLocation={setActiveLocation}
            />
          )}
        </div>

        {loading && (
          <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow">
            Carregando...
          </div>
        )}
      </main>
    </div>
  );
}