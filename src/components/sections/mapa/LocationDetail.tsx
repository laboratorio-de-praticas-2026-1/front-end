import { useState } from "react";
import { ArrowLeft, MapPin, Globe, Phone, Mail, Star, ChevronLeft, ChevronRight, Accessibility } from "lucide-react";
import type { Local } from "@/pages/Mapa";

interface LocationDetailProps {
  local: Local;
  onBack: () => void;
}

function StarRating({ nota }: { nota: number }) {
  return (
    <div className="flex items-center gap-1">
      {[0].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= Math.round(nota)
              ? "fill-[#FACC15] text-[#FACC15]"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function LocationDetail({ local, onBack }: LocationDetailProps) {
  const imagens = local.imagens && local.imagens.length > 0
    ? local.imagens
    : [local.imagem];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => setCurrentIndex((i) => (i === 0 ? imagens.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === imagens.length - 1 ? 0 : i + 1));

  return (
    <div className="w-full lg:w-[450px] flex flex-col h-full shrink-0 min-h-0 overflow-y-auto pr-2 custom-scrollbar animate-fade-in-slide">
      
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-sm font-medium text-white rounded-full hover:bg-secondary shadow-sm transition-all mb-6 shrink-0 self-start group"
      >
        <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform" />
        Voltar à lista
      </button>

      <h2 className="text-2xl font-bold text-[#1E293B] mb-4 shrink-0">{local.nome}</h2>

      <div className="relative rounded-2xl overflow-hidden mb-3 shrink-0 group/gallery">
        <img
          src={imagens[currentIndex]}
          alt={local.nome}
          className="w-full h-[240px] object-cover transition-opacity duration-300"
        />
        {imagens.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover/gallery:opacity-100"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover/gallery:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {imagens.length > 1 && (
        <div className="flex gap-2 mb-6 shrink-0 overflow-x-auto pb-2 custom-scrollbar">
          {imagens.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`shrink-0 rounded-xl overflow-hidden border-[3px] transition-all duration-200 ${
                i === currentIndex ? "border-[#3498DB] opacity-100 shadow-sm" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Foto ${i + 1}`}
                className="w-[80px] h-[60px] object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mb-2 shrink-0">
        <span className="text-base font-bold text-gray-800">{local.nota}</span>
        <StarRating nota={local.nota} />
      </div>

      <div className="flex items-center gap-2 mb-6 shrink-0">
        <span className="text-sm font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{local.tipo}</span>
        {local.acessivel && (
          <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
            <Accessibility className="w-3.5 h-3.5" />
            Acessível
          </span>
        )}
      </div>

      <div className="border-b border-gray-200 mb-6 shrink-0 flex">
        <button className="text-sm font-bold text-[#004A8B] border-b-[3px] border-[#004A8B] pb-2 px-1">
          Visão Geral
        </button>
      </div>

      <div className="flex flex-col gap-5 shrink-0 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-4">
        {local.endereco && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-[#3498DB]" />
            </div>
            <span className="text-sm text-gray-600 leading-relaxed mt-1">{local.endereco}</span>
          </div>
        )}

        {local.website && (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-[#3498DB]" />
            </div>
            <a
              href={`https://${local.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#3498DB] hover:text-[#004A8B] transition-colors hover:underline"
            >
              {local.website}
            </a>
          </div>
        )}

        {local.telefone && (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-[#3498DB]" />
            </div>
            <span className="text-sm text-gray-600 font-medium">{local.telefone}</span>
          </div>
        )}

        {local.email && (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-[#3498DB]" />
            </div>
            <span className="text-sm text-gray-600 font-medium">{local.email}</span>
          </div>
        )}
      </div>
    </div>
  );
}