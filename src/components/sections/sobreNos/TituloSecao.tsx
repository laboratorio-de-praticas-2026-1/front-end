import imgSobre from "../../../assets/img-header.jpg"; 

export default function TituloSecao() {
  return (
    <section className="w-full px-6 bg-[#Ffffff]"> 
      <div className="max-w-7xl mx-auto">
        
        {/* Título Centralizado */}
        <div className="w-fit flex flex-col items-center mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl text-[#004A8B] mb-2">
            <span className="font-normal">Sobre</span> <span className="font-bold">Nós</span>
          </h2>
          <div className="w-full h-1.5 bg-[#A4BCCF] rounded-full"></div>
        </div>

        {/* Grade de Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Coluna Esquerda: Texto com Borda */}
          <div className="border-l-[6px] border-[#A4BCCF] pl-6 md:pl-10 flex flex-col gap-10">
            
            {/* Introdução */}
            <div>
              <h3 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-[#1E3A8A] leading-tight mb-4">
                Excelência em Serviços de Despachante com Agilidade, Transparência e Confiança
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                Somos uma empresa de despachante focada em simplificar processos com agilidade, segurança e transparência. Trabalhamos para oferecer soluções práticas, economizando seu tempo e garantindo tranquilidade em cada etapa, sempre com um atendimento próximo e de confiança.
              </p>
            </div>

            {/* Tópicos */}
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="text-xl md:text-2xl font-bold text-[#1E3A8A] mb-2">
                  Agilidade
                </h4>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  Realizamos cada processo de forma rápida e eficiente, reduzindo burocracias e garantindo mais praticidade no seu dia a dia.
                </p>
              </div>

              <div>
                <h4 className="text-xl md:text-2xl font-bold text-[#1E3A8A] mb-2">
                  Confiança
                </h4>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  Atuamos com transparência e responsabilidade, construindo relações sólidas e seguras com nossos clientes.
                </p>
              </div>

              <div>
                <h4 className="text-xl md:text-2xl font-bold text-[#1E3A8A] mb-2">
                  Compromisso
                </h4>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  Estamos dedicados a oferecer o melhor atendimento, buscando sempre soluções eficazes e a satisfação em cada serviço prestados aos clientes.
                </p>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Imagem */}
          <div className="w-full flex justify-center lg:justify-end">
            <img
              src={imgSobre}
              alt="Cliente sorrindo no carro"
              className="w-full max-w-lg lg:max-w-none object-cover rounded-[2rem]"
            />
          </div>

        </div>
      </div>
    </section>
  );
}