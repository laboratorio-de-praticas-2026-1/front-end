import { Quote } from "lucide-react";

export default function DepoimentosSection() {
  const depoimentos = [
    {
      texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      autor: "João da Silva",
    },
    {
      texto: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      autor: "Maria Oliveira",
    },
    {
      texto: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      autor: "Carlos Pereira",
    },
  ];

  return (
    <section className="w-full py-30 px-6 bg-[#ffffff]">
      <div className="max-w-7xl mx-auto">
        
        {/* Título Centralizado (Reutilizando o padrão visual) */}
        <div className="w-fit flex flex-col items-center text-center mx-auto mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-[#1E3A8A] mb-4 leading-tight">
            O que nossos <br className="hidden md:block" />
            clientes dizem
          </h2>
          <div className="w-full h-1.5 bg-[#A4BCCF] rounded-full"></div>
        </div>

        {/* Grid de Depoimentos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {depoimentos.map((depoimento, index) => (
            <div key={index} className="flex flex-col items-start text-left">
              <Quote className="w-12 h-12 text-gray-300 mb-6 rotate-180" fill="currentColor" />
              <p className="text-gray-600 leading-relaxed mb-6 italic">
                "{depoimento.texto}"
              </p>
              <p className="text-sm font-bold text-gray-800">
                – {depoimento.autor}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}