import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import imgHeader from "@/assets/img-header.jpg";

// Mock com os textos que vão mudar no carrossel
const slidesText = [
  {
    id: 1,
    title: "Nossos Serviços",
    description: "Realizamos todo o trabalho necessário à documentação de veículos, com competência e credibilidade."
  },
  {
    id: 2,
    title: "Transferência Segura",
    description: "Cuidamos de todo o processo burocrático de transferência de propriedade para você não perder tempo."
  },
  {
    id: 3,
    title: "Licenciamento Anual",
    description: "Regularize o licenciamento do seu veículo de forma rápida, 100% digital e sem dores de cabeça."
  },
  {
    id: 4,
    title: "Renovação de CNH",
    description: "Auxiliamos em todas as etapas para a renovação da sua carteira de habilitação com agilidade."
  }
];

export function HeaderServicos() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slidesText.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slidesText.length - 1 : prev - 1));
  };

  return (
    // 'group' permite que elementos internos reajam ao hover do container principal
    <section className="relative w-full h-[80vh] min-h-[500px] flex items-center group overflow-hidden rounded-b-[2.5rem]">
      
      {/* 1. BACKGROUND ESTÁTICO */}
      {/* Substitua '/img-header.jpg' pelo caminho real da sua foto de motorista */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imgHeader})` }}
      />
      
      {/* Overlay escuro sutil APENAS para dar leitura ao texto branco (sem blur) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* 2. CONTEÚDO DO CARROSSEL (TEXTOS) */}
      {/* pt-20 garante que o texto não fique escondido atrás da Navbar fixa */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-20">
        <div className="max-w-xl relative h-[200px]">
          {slidesText.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-in-out ${
                  isActive 
                    ? "opacity-100 translate-y-0 pointer-events-auto" 
                    : "opacity-0 translate-y-8 pointer-events-none"
                }`}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                  {slide.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. CONTROLES DO CARROSSEL (SETAS) */}
      <div className="absolute inset-0 z-20 flex items-center justify-between px-4 md:px-8 pointer-events-none">
        
        {/* Seta Esquerda */}
        <button 
          onClick={prevSlide}
          className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-white/20 hover:scale-110 -translate-x-4 group-hover:translate-x-0"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        {/* Seta Direita */}
        <button 
          onClick={nextSlide}
          className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-white/20 hover:scale-110 translate-x-4 group-hover:translate-x-0"
          aria-label="Próximo slide"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>

      {/* 4. INDICADORES INFERIORES (PONTINHOS) */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10 transition-transform duration-300 group-hover:-translate-y-1">
          {slidesText.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide 
                  ? "w-6 h-1.5 bg-white" // Tracejado longo (ativo)
                  : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80" // Bolinha (inativo)
              }`}
              aria-label={`Ir para o slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

    </section>
  );
}