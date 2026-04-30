import HeaderForm from "@/components/ui/HeaderForm"
import imgHeader from "@/assets/img-header.jpg"

export function HeaderSection() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center  rounded-b-3xl overflow-hidden mb-2 pt-28">

      <div className="absolute inset-0 z-0">
        <img
          src={imgHeader}
          alt="Pessoa sorrindo no carro"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20 md:to-transparent"></div>
      </div>


      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 py-16 ">
        

        <div className="flex flex-col justify-center items-start space-y-6 text-white">
          <h1 className="text-4xl md:text-5xl lg:text8xlleading-tight">
            <span className="font-extrabold">Regularize</span> seu veículo <span className="font-extrabold">sem complicação</span> 
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-200 max-w-lg">
            Parcele IPVA, Licenciamento e Multas em até 12x no cartão
          </p>
          
          <a 
            href="/login" 
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90 mt-4"
          >
            Consulte agora
          </a>
        </div>


        <div className="flex items-center justify-center lg:justify-end w-full">

          <HeaderForm />
          
        </div>
        
      </div>
    </section>
  );
}