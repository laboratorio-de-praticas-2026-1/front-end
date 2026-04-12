import vectorBlueCar from "@/assets/vector-blue-car.svg";
import vectorBlueCard from "@/assets/vector-blue-card.svg";
import vectorBlueTrust from "@/assets/vector-blue-trust.svg";

export function PorQueEscolher() {
  const beneficios = [
    {
      titulo: "Atendimento Rápido",
      descricao: "Agilidade para resolver a documentação do seu veículo.",
      icone: (
        <img 
          src={vectorBlueCar} 
          alt="Ícone de carro" 
          className="w-8 h-8"
        />
      )
    },
    {
      titulo: "Parcelamento facilitado",
      descricao: "IPVA, licenciamento e multas em até 12x no cartão.",
      icone: (
        <img 
          src={vectorBlueCard} 
          alt="Ícone de cartão" 
          className="w-8 h-8"
        />
      )
    },
    {
      titulo: "Confiança",
      descricao: "Segurança e transparência em cada serviço.",
      icone: (
        <img 
          src={vectorBlueTrust} 
          alt="Ícone de confiança" 
          className="w-8 h-8"
        />
      )
    }
  ]

  return (
    <section className="py-12 bg-gray-50"> {/* DIMINUÍDO */}
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Por que escolher nossos serviços?
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
          Mais praticidade, rapidez e segurança para resolver tudo do seu veículo.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {beneficios.map((beneficio, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl px-4 py-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#E5E7EA" }}
              >
                {beneficio.icone}
              </div>
              <h3 className="text-xl font-semibold mb-2">{beneficio.titulo}</h3>
              <p className="text-gray-600">{beneficio.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}