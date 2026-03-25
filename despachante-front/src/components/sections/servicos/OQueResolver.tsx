import { FaCar } from "react-icons/fa";
import { Link } from "react-router-dom";

export function OQueResolver() {
  const servicos = [
    { 
      titulo: "Transferência\nde Veículo", 
      isGradient: true 
    },
    { 
      titulo: "Licenciamento\nanual", 
      isGradient: false 
    },
    { 
      titulo: "Primeiro\nemplacamento", 
      isGradient: false 
    },
    { 
      titulo: "Transferência\nde Veículo", 
      isGradient: true 
    }
  ];

  return (
    <section className="py-24 bg-[#EAECEE] overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 items-center">
          
          {/* LADO ESQUERDO - Textos */}
          <div className="flex flex-col justify-center max-w-md mx-auto md:mx-0">
            <div className="w-32 h-1.5 bg-primary mb-8 rounded-full"></div>
            
            <h2 className="text-4xl md:text-[2.75rem] leading-tight font-bold text-zinc-800 mb-6 tracking-tight">
              O que você<br />precisa resolver<br />hoje?
            </h2>
            
            <p className="text-zinc-600 text-lg leading-relaxed">
              Nosso despachante reúne os principais serviços para facilitar sua vida e eliminar a burocracia do dia a dia.
            </p>
          </div>

          {/* LADO DIREITO - Cards em Grid */}
          <div className="relative">
            {/* Ajustado o gap para mobile (gap-3) para ganhar mais espaço interno nos cards */}
            <div className="grid grid-cols-2 gap-3 md:gap-6">
              {servicos.map((servico, index) => {
                const isRightColumn = index === 1 || index === 3;
                const offsetClass = isRightColumn ? "translate-y-0 md:translate-y-12" : "";
                
                return (
                  <div 
                    key={index}
                    className={`flex flex-col items-center justify-center p-4 md:p-8 rounded-[1.5rem] shadow-lg transition-transform hover:-translate-y-1 cursor-pointer min-h-[150px] md:min-h-[220px] ${offsetClass} ${
                      servico.isGradient 
                        ? "bg-gradient-to-b from-[#1E84CF] to-[#135A91] text-white border border-white/10" 
                        : "bg-white text-primary"
                    }`}
                  >
                    {/* Ícone menor no mobile (size 32) e maior no desktop (size 44) */}
                    <FaCar 
                      className={`mb-3 md:mb-4 text-3xl md:text-5xl ${servico.isGradient ? "text-white" : "text-primary"}`} 
                    />
                    
                    {/* Fonte ajustada: text-sm no mobile, text-xl no desktop */}
                    <h3 className="text-center font-bold text-sm md:text-xl leading-tight whitespace-pre-line break-words">
                      {servico.titulo}
                    </h3>
                  </div>
                );
              })}
            </div>
            
            {/* Botão Ver Todos */}
            <div className="flex justify-center md:justify-end mt-12 md:mt-20 md:pr-12">
              <Link 
                to="/servicos"
                className="bg-primary text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-secondary/90 transition-colors shadow-md"
              >
                Ver Todos
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}