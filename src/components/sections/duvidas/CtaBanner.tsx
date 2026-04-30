import bannerImg from "../../../assets/banner.png"
import { useNavigate } from "react-router-dom";

export default function CtaBanner() {
      const navigate = useNavigate()
  return (
    <div className="relative z-10 bg-gradient-to-r from-[#1E84CF] to-secondary mx-auto -mt-16 min-h-[160px] md:min-h-[270px] flex w-[90%] max-w-[1150px] flex-col md:flex-row items-center md:items-start lg:items-center justify-between gap-8 px-10 py-12 text-white text-center md:text-left shadow-2xl mt-20 mb-12 transition-transform hover:scale-[1.01] rounded-2xl">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6 md:px-16">
          <p className="text-white font-light md:font-semibold text-base md:text-2xl max-w-4xl leading-snug">
            A solidez do nosso serviço garante segurança para você e seu veículo!
          </p>

          <button 
            className="bg-primary hover:bg-secondary transition-colors duration-200 md:mt-4 text-white font-bold text-sm md:text-base px-10 md:px-22 py-2.5 md:py-3 rounded-full"
            onClick={() => navigate("/contato")}
          >
                Falar com especialista
          </button>
        </div>
    </div>
  );
}

