import { useState, useEffect, useRef } from "react";
import CarouselImage1 from "@/assets/carousel-1.jpg";
import CarouselImage2 from "@/assets/carousel-2.jpg";
import CarouselImage3 from "@/assets/carousel-3.jpg";


interface CarouselItem {
    id: number;
    title: string;
    imageUrl: string;
}

interface CarouselProps {
    className? : string
}


const items: CarouselItem[] = [
    { id: 1, title: "Licenciamento do veículo", imageUrl: CarouselImage1 },
    { id: 2, title: "Renovação de CNH", imageUrl: CarouselImage2 },
    { id: 3, title: "Transferência de veículo", imageUrl: CarouselImage3 },
];

const Carousel = ({className}: CarouselProps) => { //

    /*
    activeIndex guarda qual card está ativo/selecionado.
    Isso controla:
    - qual card fica expandido no desktop
    - qual título aparece no mobile
    - qual dot está ativo
    */
    const [activeIndex, setActiveIndex] = useState(0);

    /*
    scrollRef referencia o container que possui scroll horizontal.
    Ele é usado para:
    - detectar qual card está visível (IntersectionObserver)
    - mover o scroll quando um card é clicado
    */
    const scrollRef = useRef<HTMLDivElement>(null);

    /* timeoutRef armazena a referência do timer para que possamos limpá-lo.
    */
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /*
    Efeito responsável pelo auto-play de 10 segundos.
    */
    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            const nextIndex = (activeIndex + 1) % items.length;
            handleCardClick(nextIndex);
        }, 10000);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [activeIndex]);

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
            {
                root: scrollRef.current,
                threshold: 0.7 
            }
        );

        const cards = scrollRef.current?.querySelectorAll(".carousel-card");

        cards?.forEach((card) => observer.observe(card));

        return () => observer.disconnect();

    }, [scrollRef.current]);



    



    const handleCardClick = (index: number) => {
        setActiveIndex(index);

        const container = scrollRef.current;
        const card = container?.querySelectorAll(".carousel-card")[index] as HTMLElement;

        if (container && card) {
            const cardLeft = card.offsetLeft;
            const cardWidth = card.offsetWidth;
            const containerWidth = container.offsetWidth;

            const scrollPosition = window.innerWidth < 640 
                ? cardLeft - (containerWidth / 2) + (cardWidth / 2) 
                : cardLeft;

            container.scrollTo({
                left: scrollPosition,
                behavior: "smooth"
            });
        }
    };







    return (
        <div className={`w-full md:w-1/2 p-4 flex flex-col items-start font-sans overflow-x-hidden ${className}`}>

            {/* Container que segura os cards */}
            <div
                ref={scrollRef}
                className="
                relative w-full flex justify-start gap-4 sm:gap-6
                pt-7 pb-5
                overflow-x-auto
                snap-x snap-mandatory
                sm:snap-none
                scroll-smooth
                scrollbar-hide
                [-ms-overflow-style:none]
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
                "
            >

                {items.map((item, index) => {

                    // verifica se este card é o ativo
                    const isActive = index === activeIndex;

                    return (
                        <div
                            key={item.id}
                            data-index={index}
                            onClick={() => handleCardClick(index)}
                            className={`carousel-card relative transition-all duration-500 ease-in-out cursor-pointer overflow-hidden rounded-[32px] flex-shrink-0 snap-center w-[85vw] sm:w-[150px] ${isActive ? "sm:w-[320px] opacity-100" : "sm:opacity-70"} h-[450px] sm:h-[500px]`}
                        >

                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />


                            <div
                                className="absolute inset-0 hidden sm:block"
                                style={{
                                    background:
                                        "linear-gradient(to bottom, transparent 0%, bg-foreground/89 100%)"
                                }}
                            />

                            {/* Texto do card (apenas desktop) */}
                            <div
                                className={`absolute bottom-[30px] left-[30px] text-white font-medium transition-opacity duration-300 hidden sm:block ${isActive ? "opacity-100" : "opacity-0"} pr-4`}
                            >
                                <p className="text-xl leading-tight">
                                    {item.title}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Título exibido no mobile abaixo do carrossel */}
            <div className="block sm:hidden mb-6 ml-[20px]">
                <p className="text-foreground font-bold text-lg leading-tight">
                    {items[activeIndex].title}
                </p>
            </div>

            <div className="ml-2">
                <div className="inline-flex items-center gap-3 px-4 py-4 bg-muted-foreground/20 rounded-full backdrop-blur-sm">

                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleCardClick(index)}

                            /*
                            Dot ativo fica maior e mais escuro.
                            */
                            className={`transition-all duration-300 rounded-full
              ${index === activeIndex
                                    ? "w-8 h-[6px] bg-foreground"
                                    : "w-[6px] h-[6px] bg-foreground/50"}`}
                        />
                    ))}

                </div>
            </div>
        </div>
    );
};

export default Carousel;