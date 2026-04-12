import carImage from "@/assets/car-image.jpg";

const AboutSection = () => {
  return (
    <section className="py-16 px-4 md:py-24 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Coluna da imagem - AGORA PRIMEIRO (ESQUERDA) */}
          <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
            <img 
              src={carImage}
              alt="Carro" 
              className="w-full h-full object-cover"
            />
            {/* Fallback se não tiver a imagem */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white">
            </div>
          </div>

          {/* Coluna do texto - AGORA SEGUNDO (DIREITA) */}
          <div className="text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 max-w-xl">
              A solidez do Grupo Bortone a favor do seu veículo.
            </h2>
            
            <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-6">
              Como parte do Grupo Bortone, trazemos nossa tradição e credibilidade para o mercado de despachantes.
            </p>
            
            <p className="text-white/90 text-lg md:text-xl leading-relaxed">
              Nosso compromisso é cuidar de toda a burocracia do seu veículo com a máxima segurança, 
              transparência e eficiência. Você ganha tempo, e nós garantimos a sua paz de espírito.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;