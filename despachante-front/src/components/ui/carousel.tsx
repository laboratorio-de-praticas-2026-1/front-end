import { useState, useEffect, useRef } from "react";
import CarouselImage1 from "@/assets/carousel-1.jpg";
import CarouselImage2 from "@/assets/carousel-2.jpg";
import CarouselImage3 from "@/assets/carousel-3.jpg";


interface CarouselItem {
    id: number;
    title: string;
    imageUrl: string;
}

// Cria a interface que será usada no Props para que possa ser adicionado classes externas no componente
interface CarouselProps {
    className? : string
}

/*
Lista de serviços exibidos no carrossel.
Cada item contém:
- id: identificador único (sequencial)
- title: texto exibido no carrossel
- imageUrl: imagem usada no carrossel
*/
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
    Usamos o tipo de retorno nativo do setTimeout para garantir compatibilidade total.
    */
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /*
    Efeito responsável pelo auto-play de 10 segundos.
    Sempre que o activeIndex muda, o timer anterior é descartado e um novo começa,
    garantindo que o próximo slide só venha após 10 segundos de inatividade real.
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

    /*
    IntersectionObserver é usado apenas no MOBILE. O objetivo dele é detectar qual card está mais visível quando o usuário arrasta o carrossel.
    Quando um card entra 70% na tela, ele se torna o ativo e assim alterna o título exibido abaixo do carrossel e o dot ativo.
    */
    useEffect(() => {
        const isMobile = window.innerWidth < 640;
        if (!isMobile) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {

                    // Se o card estiver suficientemente visível
                    if (entry.isIntersecting) {

                        // Pegamos o índice salvo no atributo data-index
                        const index = Number(entry.target.getAttribute("data-index"));

                        // Atualizamos o card ativo
                        setActiveIndex(index);
                    }
                });
            },
            {
                root: scrollRef.current, // container onde ocorre o scroll
                threshold: 0.7 // porcentagem de visibilidade necessária - 70%
            }
        );

        // Seleciona todos os cards do carrossel
        const cards = scrollRef.current?.querySelectorAll(".carousel-card");

        // Observa cada card
        cards?.forEach((card) => observer.observe(card));

        // Limpa o observer ao desmontar o componente
        return () => observer.disconnect();

    }, [scrollRef.current]);


    // Função executada quando um card ou dot é clicado. Ela atualiza o estado do card ativo e move o scroll para posicionar o card corretamente

    const handleCardClick = (index: number) => {

        // Atualiza o card ativo
        setActiveIndex(index);

        // Busca o card correspondente
        const card = scrollRef.current?.querySelectorAll(".carousel-card")[index];

        if (card) {
            card.scrollIntoView({
                behavior: "smooth",
                block: "nearest",// mantém alinhamento vertical
                inline: window.innerWidth < 640 ? "center" : "start"
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