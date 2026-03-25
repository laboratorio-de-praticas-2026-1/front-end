import Carousel from '@/components/ui/carousel'

const ServiceCarousel = () => {
    return (
        <div id="ServiceCarousel" className="w-full flex flex-col items-center sm:flex-row">
            <div className="w-full h-auto sm:w-1/2 flex flex-col gap-2 items-center font-sans">
                <div className="flex flex-col items-start gap-5 w-9/10 sm:w-120">
                    <div className="text-3xl sm:text-5xl font-medium color-foreground">O que você precisa resolver hoje?</div>
                    <div className="color-foreground sm:text-2xl text-1xl">
                        Aqui você resolve tudo o que precisa para o seu veículo com praticidade e segurança.
                    </div>
                    <div className="color-foreground sm:text-2xl text-1xl">
                        Nosso despachante reúne os principais serviços para facilitar sua vida e eliminar a burocracia do dia a dia.
                    </div>
                </div>
            </div>
            <Carousel className="ml-auto" />
        </div>
    )
}

export default ServiceCarousel