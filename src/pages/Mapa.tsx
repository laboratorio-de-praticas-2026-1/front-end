import { useState, useEffect } from "react";
import {Navbar} from "@/components/layout/Navbar";
import MapSearch from "@/components/sections/mapa/MapSearch";
import MapSidebar from "@/components/sections/mapa/MapSidebar";
import MapView from "@/components/sections/mapa/MapView";

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

const LOCAIS_MOCK: Local[] = [
  // --- CLÍNICAS ---
  {
    id: 1,
    nome: "Hospital Regional Sirio Libanes",
    tipo: "Hospital Regional",
    nota: 4.8,
    endereco: "Rod. Régis Bittencourt, KM 449, Registro - SP, 11900-000",
    imagem: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=400&auto=format&fit=crop",
    lat: -24.4925,
    lng: -47.8441,
    categoria: "Clínicas"
  },
  {
    id: 2,
    nome: "Cliniprev Consultórios",
    tipo: "Consultórios Médicos",
    nota: 4.0,
    endereco: "Av. Castelo Branco, 426 - Centro, Registro - SP, 11900-000",
    imagem: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400&auto=format&fit=crop",
    lat: -24.4883,
    lng: -47.8402,
    categoria: "Clínicas"
  },
  {
    id: 3,
    nome: "CEDIMAR",
    tipo: "Laboratório médico",
    nota: 4.0,
    endereco: "Av. Clara Gianotti de Souza, 430 - (13) 3821-3795",
    horario: "Fechado · Abre sex. às 08:00",
    imagem: "https://images.unsplash.com/photo-1538108149393-cebb47ac196e?q=80&w=400&auto=format&fit=crop",
    lat: -24.4851,
    lng: -47.8354,
    categoria: "Clínicas"
  },
  {
    id: 4,
    nome: "Clínica Saúde & Vida",
    tipo: "Clínica Geral",
    nota: 4.7,
    endereco: "Rua José Antônio de Campos, 250 - Centro, Registro - SP",
    imagem: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=400&auto=format&fit=crop",
    lat: -24.4910,
    lng: -47.8430,
    categoria: "Clínicas"
  },
  {
    id: 5,
    nome: "Odonto Prime",
    tipo: "Clínica Odontológica",
    nota: 4.9,
    endereco: "Rua Shitiro Maeji, 330 - Centro, Registro - SP",
    imagem: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=400&auto=format&fit=crop",
    lat: -24.4905,
    lng: -47.8415,
    categoria: "Clínicas"
  },
  {
    id: 6,
    nome: "Laboratório São João",
    tipo: "Laboratório de Análises",
    nota: 4.4,
    endereco: "Av. Wild José de Souza, 200 - Registro - SP",
    horario: "Aberto agora",
    imagem: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=400&auto=format&fit=crop",
    lat: -24.4940,
    lng: -47.8420,
    categoria: "Clínicas"
  },

  // --- VISTORIA ---
  {
    id: 7,
    nome: "Vistoria Fácil Registro",
    tipo: "Empresa de Vistoria",
    nota: 4.5,
    endereco: "Rua Exemplo, 123 - Centro, Registro - SP",
    imagem: "https://images.unsplash.com/photo-1632823471565-3cefc4ee52b1?q=80&w=400&auto=format&fit=crop",
    lat: -24.4900,
    lng: -47.8420,
    categoria: "Vistoria"
  },
  {
    id: 8,
    nome: "Super Visão Vistorias",
    tipo: "Vistoria Veicular",
    nota: 4.8,
    endereco: "Av. Pref. Jonas Banks Leite, 810 - Centro, Registro - SP",
    imagem: "https://images.unsplash.com/photo-1486495146683-774b706c9bc3?q=80&w=400&auto=format&fit=crop",
    lat: -24.4870,
    lng: -47.8460,
    categoria: "Vistoria"
  },
  {
    id: 9,
    nome: "Dekra Vistorias",
    tipo: "Vistoria Veicular",
    nota: 4.6,
    endereco: "Rod. Régis Bittencourt, KM 448 - Registro - SP",
    horario: "Abre seg. às 08:30",
    imagem: "https://images.unsplash.com/photo-1613214149922-f1809c99b414?q=80&w=400&auto=format&fit=crop",
    lat: -24.4800,
    lng: -47.8300,
    categoria: "Vistoria"
  },
  {
    id: 10,
    nome: "Vistoria 100% Certa",
    tipo: "Empresa de Vistoria",
    nota: 4.1,
    endereco: "Rua Meraldo Previde, 500 - Registro - SP",
    imagem: "https://images.unsplash.com/photo-1503328427499-d92d1fa3ca6c?q=80&w=400&auto=format&fit=crop",
    lat: -24.4865,
    lng: -47.8385,
    categoria: "Vistoria"
  },

  // --- DETRAN ---
  {
    id: 11,
    nome: "Poupatempo Registro",
    tipo: "Serviços Públicos",
    nota: 4.3,
    endereco: "Rua Antônio Policarpo de Souza, 400 - Registro - SP",
    horario: "Aberto até as 17:00",
    imagem: "https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=400&auto=format&fit=crop",
    lat: -24.4855,
    lng: -47.8322,
    categoria: "Detran"
  },
  {
    id: 12,
    nome: "Ciretran Registro",
    tipo: "Órgão de Trânsito",
    nota: 3.8,
    endereco: "Rua Tamekishi Takano, 150 - Centro, Registro - SP",
    imagem: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400&auto=format&fit=crop",
    lat: -24.4930,
    lng: -47.8480,
    categoria: "Detran"
  },
  {
    id: 13,
    nome: "Despachante Vale do Ribeira",
    tipo: "Serviços Documentais",
    nota: 4.9,
    endereco: "Rua Nakatsubo, 55 - Centro, Registro - SP",
    imagem: "https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=400&auto=format&fit=crop",
    lat: -24.4888,
    lng: -47.8455,
    categoria: "Detran"
  },
  {
    id: 14,
    nome: "Despachante Expresso",
    tipo: "Serviços Documentais",
    nota: 4.6,
    endereco: "Av. Pref. Jonas Banks Leite, 220 - Registro - SP",
    horario: "Aberto até as 18:00",
    imagem: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=400&auto=format&fit=crop",
    lat: -24.4902,
    lng: -47.8475,
    categoria: "Detran"
  }
];

export default function Mapa() {
  const [activeFilter, setActiveFilter] = useState("Clínicas");
  
  // Filtra a lista com base no botão clicado
  const locaisFiltrados = LOCAIS_MOCK.filter(local => local.categoria === activeFilter);
  
  // Garante que haja um local ativo mesmo se mudar de filtro
  const [activeLocation, setActiveLocation] = useState<Local>(locaisFiltrados[0] || LOCAIS_MOCK[0]);

  // Se trocar o filtro, joga o mapa pro primeiro item da nova lista
  useEffect(() => {
    if (locaisFiltrados.length > 0) {
      setActiveLocation(locaisFiltrados[0]);
    }
  }, [activeFilter]);

  return (
    // h-screen impede que a página inteira role, permitindo que apenas a sidebar faça o scroll interno
    <div className="flex flex-col h-screen bg-[#F3F4F6] font-sans">
      <Navbar />
      
      <main className="flex-1 flex flex-col w-full max-w-[1600px] mx-auto px-6 py-6 overflow-hidden">
        <MapSearch />
        
        <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden min-h-0">
          <MapSidebar 
            locais={locaisFiltrados} 
            activeLocation={activeLocation} 
            onLocationSelect={setActiveLocation}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          
          {/* Se não houver locais, não quebra o mapa */}
          {activeLocation && <MapView activeLocation={activeLocation} />}
        </div>
      </main>
    </div>
  );
}