import React, { useState, useEffect, useRef } from "react";
import CarouselImage1 from "@/assets/carousel-1.jpg";
import CarouselImage2 from "@/assets/carousel-2.jpg";
import CarouselImage3 from "@/assets/carousel-3.jpg";

interface CarouselItem {
    id: number;
    title: string;
    imageUrl: string;
}

const items: CarouselItem[] = [
    { id: 1, title: "Licenciamento do veículo", imageUrl: CarouselImage1 },
    { id: 2, title: "Renovação de CNH", imageUrl: CarouselImage2 },
    { id: 3, title: "Transferência de veículo", imageUrl: CarouselImage3 },
];

const Carousel: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Intersection Observer para mobile (arrasto)
    useEffect(() => {
        const isMobile = window.innerWidth < 640;
        if (!isMobile) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute("data-index"));
                        setActiveIndex(index);
                    }
                });
            },
            { root: scrollRef.current, threshold: 0.7 }
        );

        const cards = scrollRef.current?.querySelectorAll(".carousel-card");
        cards?.forEach((card) => observer.observe(card));
        return () => observer.disconnect();
    }, []);

    // Função de clique unificada
    const handleCardClick = (index: number) => {
        setActiveIndex(index); // Atualiza o estado (essencial para o efeito de expansão no Web)

        // Move o scroll físico (essencial para o Mobile e alinhamento no Web)
        const card = scrollRef.current?.querySelectorAll(".carousel-card")[index];
        if (card) {
            card.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: window.innerWidth < 640 ? "center" : "start"
            });
        }
    };

    return (
        <div className="w-full md:w-1/2 ml-auto p-4 flex flex-col items-start font-sans overflow-x-hidden">

            {/* Container dos Cards */}
            <div
                ref={scrollRef}
                className="relative w-full flex justify-start gap-4 sm:gap-6 pt-7 pb-5 overflow-x-auto snap-x snap-mandatory sm:snap-none scroll-smooth scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {items.map((item, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <div
                            key={item.id}
                            data-index={index}
                            onClick={() => handleCardClick(index)}
                            className={`carousel-card relative transition-all duration-500 ease-in-out cursor-pointer overflow-hidden rounded-[32px] flex-shrink-0 snap-center
              /* Mobile: Tamanho fixo | Desktop: Expansão */
              w-[85vw] sm:w-[150px] ${isActive ? "sm:w-[320px] opacity-100" : "sm:opacity-70"} 
              h-[450px] sm:h-[500px]
              `}
                        >
                            <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />

                            {/* Degradê 89% - Apenas Web */}
                            <div
                                className="absolute inset-0 hidden sm:block"
                                style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.89) 100%)" }}
                            />

                            {/* Legenda Interna - Web (Margem 30px) */}
                            <div className={`absolute bottom-[30px] left-[30px] text-white font-medium transition-opacity duration-300 hidden sm:block ${isActive ? "opacity-100" : "opacity-0"} pr-4`}>
                                <p className="text-xl leading-tight">{item.title}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legenda Externa - Mobile (Margem 20px) */}
            <div className="block sm:hidden mb-6 ml-[20px]">
                <p className="text-[#1A2338] font-bold text-lg leading-tight">
                    {items[activeIndex].title}
                </p>
            </div>

            {/* Dots Estilizados */}
            <div className="ml-2">
                <div className="inline-flex items-center gap-3 px-4 py-4 bg-[#CACACA]/20 rounded-full backdrop-blur-sm">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleCardClick(index)}
                            className={`transition-all duration-300 rounded-full
              ${index === activeIndex
                                    ? "w-8 h-[6px] bg-[#333333]"
                                    : "w-[6px] h-[6px] bg-[#6C6C6C]/50"}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Carousel;