import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // <-- O MAPA NÃO APARECE SEM ISSO
import L from "leaflet";
import type { Local } from "@/pages/Mapa";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Correção do ícone sumindo no react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15, { duration: 1.5 });
  }, [center, map]);
  return null;
}

interface MapViewProps {
  activeLocation: Local;
}

export default function MapView({ activeLocation }: MapViewProps) {
  const position: [number, number] = [activeLocation.lat, activeLocation.lng];

  return (
    // A relative e a div interna absolute garantem que o mapa ocupe 100% da altura do flex-1
    <div className="flex-1 w-full rounded-3xl overflow-hidden shadow-sm relative z-0 border border-gray-200 min-h-[400px] lg:min-h-0">
      <div className="absolute inset-0">
        <MapContainer 
          center={position} 
          zoom={15} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={position} />
          <Marker position={position}>
            <Popup>
              <span className="font-bold">{activeLocation.nome}</span>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}