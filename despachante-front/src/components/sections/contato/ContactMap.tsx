import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FaWhatsapp } from "react-icons/fa";
// 1. IMPORTANTE: Importar o CSS do Leaflet aqui!
import "leaflet/dist/leaflet.css"; 
import L from "leaflet";

// 2. CORREÇÃO DOS ÍCONES (Opcional se o marcador sumir)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

export default function ContactMap() {
  return (
    <section className="relative bg-[#eef3f7] pb-16 md:pb-24 z-0">
      <div className="relative">
        {/* AUMENTADO A ALTURA: Mudei de 100px para 450px */}
        <MapContainer 
          center={[-24.4979, -47.8449]} 
          zoom={15} 
          scrollWheelZoom={false} 
          style={{ height: "550px", width: "100%", zIndex: 0, border: "none" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[-24.4979, -47.8449]}>
                <Popup>
                   Estamos aqui! <br /> Venha nos visitar.
                </Popup>
             </Marker>
        </MapContainer>

        {/* Banner CTA - Ajustado o posicionamento para não sobrepor errado */}
        <div className="relative z-10 bg-gradient-to-r from-[#1E84CF] to-[#002749] mx-auto -mt-16 flex w-[90%] max-w-[1000px] flex-col md:flex-row items-center md:items-start lg:items-center justify-between gap-8 rounded-[2rem] px-10 py-12 text-white text-center md:text-left shadow-2xl transition-transform hover:scale-[1.01]">
            <div className="flex-1">
                <h3 className="text-2xl md:text-2xl font-semibold mb-3">
                    Você precisa de algum serviço específico?
                </h3>
                <p className="text-lg md:text-xl text-white/90">
                    Nossa equipe está pronta para analisar seu caso agora!
                </p>
            </div>

            <button className="flex items-center justify-center shrink-0 rounded-full bg-white font-bold text-secondary text-lg gap-3 px-8 py-4 h-14 md:h-16 shadow-md hover:bg-zinc-100 hover:scale-105 transition-all w-full md:w-auto">
                <FaWhatsapp className="w-6 h-6" />
                WhatsApp Online
            </button>
        </div>
      </div>
    </section>
  );
}