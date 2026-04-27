import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customMarkerIcon = L.divIcon({
  html: `
    <div style="
      background-color: #2196F3; 
      width: 20px; 
      height: 20px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 0 5px rgba(0,0,0,0.4);
      position: relative;
    ">
      <div style="
        width: 6px; 
        height: 6px; 
        background-color: white; 
        border-radius: 50%; 
        position: absolute; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%);
      "></div>
    </div>
  `,
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15);
    }
  }, [lat, lng, map]);
  return null;
};

interface MapViewerProps {
  lat: number;
  lng: number;
}

export const MapViewer = ({ lat, lng }: MapViewerProps) => {
  const position: [number, number] = [lat || -24.4950, lng || -47.8450];

  return (
    <Card className="shadow-sm border-gray-200 overflow-hidden">
      {/* Header mantido exatamente como você mandou */}
      <CardHeader className="h-[72px] flex flex-row items-center px-6 pb-[20px] border-b border-gray-100 bg-[#F9FAFB]">
        <CardTitle className="text-lg font-bold text-[#001f3f]">
          Visualização
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Ajustado para h-[270px] para esticar o mapa um pouco mais para baixo 
            e compensar o deslocamento visual do header */}
        <div className="h-[270px] w-full bg-slate-100 relative z-0">
          <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom={false}
            zoomControl={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; Google'
              url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            />
            <Marker position={position} icon={customMarkerIcon} />
            <RecenterMap lat={position[0]} lng={position[1]} />
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};