import { Link } from "react-router-dom";
import imgDesktop from "../../../assets/header-sobrenos.png";
import img1 from "../../../assets/1-header-sobrenos.png";
import img2 from "../../../assets/3-header-sobrenos.png";
import img3 from "../../../assets/2-header-sobrenos.png";

export default function SobreNosHeader() {
  return (
      <header className="relative w-full flex items-center pt-32 pb-68 md:pt-40 md:pb-84 lg:pt-48 lg:pb-92 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={imgDesktop}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-30 w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="flex-1 flex flex-col items-start text-left w-full">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Agilidade,<br />
              confiança e<br />
              compromisso
            </h1>
            <p className="text-base md:text-lg text-white/90 mb-10 max-w-md w-full leading-relaxed">
              Somos especialistas em soluções de despachante, facilitando sua vida com eficiência e transparência.
            </p>
            <Link
              to="/servicos"
              className="bg-white text-[#004A8B] font-semibold text-center w-full max-w-md py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              Ir para Serviços
            </Link>
          </div>

          <div className="flex-1 w-full max-w-md lg:max-w-none mx-auto grid grid-cols-2 gap-4 md:gap-6">
            <div className="flex flex-col gap-4 md:gap-6">
              <img
                src={img1}
                alt="Agilidade"
                className="w-full h-40 md:h-48 lg:h-56 object-cover rounded-2xl lg:rounded-3xl shadow-xl"
              />
              <img
                src={img2}
                alt="Confiança"
                className="w-full h-40 md:h-48 lg:h-56 object-cover rounded-2xl lg:rounded-3xl shadow-xl"
              />
            </div>
            <div className="flex h-full">
              <img
                src={img3}
                alt="Compromisso"
                className="w-full h-full object-cover rounded-2xl lg:rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full leading-none z-20">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto block"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C480,100 960,120 1440,120 V120 H0 V0 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </header>



  );
}