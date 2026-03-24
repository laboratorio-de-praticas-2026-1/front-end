import vectorWhiteCar from "@/assets/vector-white-car.svg";
import vectorOrangeCar from "@/assets/vector-orange-car.svg";
import vectorLine from "@/assets/vector-line.svg";

export function OQueResolver() {
  const servicos = [
    { titulo: "Transferência de Veículo", offset: false, corEspecial: false, icone: "white", temGradiente: true },
    { titulo: "Licenciamento anual", offset: true, corEspecial: true, icone: "orange", temGradiente: false },
    { titulo: "Primeiro emplacamento", offset: false, corEspecial: true, icone: "orange", temGradiente: false },
    { titulo: "Consulta de Multas", offset: true, corEspecial: false, icone: "white", temGradiente: true }
  ]

  return (
    <section className="py-24 bg-[#F4F4F4]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Lado Esquerdo - Texto */}
          <div className="flex flex-col justify-center h-full">
            <img 
              src={vectorLine} 
              alt="Linha decorativa" 
              className="mb-4 w-3/5 max-w-md -ml-14"
            />
            <h2 className="text-3xl md:text-4xl font-bold mb-2 max-w-sm">
              O que você precisa resolver hoje?
            </h2>
            <p className="text-gray-600 text-lg max-w-sm">
              Nosso despachante reúne os principais serviços para facilitar sua vida e eliminar a burocracia do dia a dia.
            </p>
          </div>

          {/* Lado Direito - Cards e Botão */}
          <div>
            <div className="grid grid-cols-2 gap-6">
              {servicos.map((servico, index) => {
                const isLaranja = index === 0 || index === 3
                const offsetClass = servico.offset ? "transform -translate-y-8" : ""
                
                const iconeSrc = servico.icone === "white" ? vectorWhiteCar : vectorOrangeCar
                
                return (
                  <div 
                    key={index}
                    className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer ${offsetClass} ${
                      isLaranja 
                        ? "bg-gradient-to-br from-[#E99E2E] to-[#f5b85e]" 
                        : servico.temGradiente
                          ? "bg-gradient-to-br from-[#F39200] to-[#FFB347]"
                          : "bg-white"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3">
                        <img 
                          src={iconeSrc} 
                          alt="Ícone de carro" 
                          className="w-10 h-10"
                        />
                      </div>
                      <h3 
                        className={`text-lg font-semibold ${
                          isLaranja 
                            ? "text-white" 
                            : servico.corEspecial 
                              ? "text-[#F49C17]" 
                              : "text-gray-900"
                        }`}
                      >
                        {servico.titulo}
                      </h3>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="flex justify-end mr-12 -mt-2">
              <button 
                className="px-8 py-3 rounded-2xl transition-colors font-medium text-white"
                style={{ backgroundColor: "#324587" }}
              >
                Ver Todos
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}