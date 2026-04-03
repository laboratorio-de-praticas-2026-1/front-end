type ServiceCardProps = {
    titulo: String,
    descricao: String,
    valor: Number,
    prazo: Number
}

export default function CardServicos({
    titulo,
    descricao,
    valor,
    prazo
}: ServiceCardProps) {
    return(
        <div className="bg-white gap-6 w-full rounded-3xl p-9 shadow-xl h-full flex flex-col align-center justify-between">

            <div>
                <h3 className="font-bold color-foreground text-2xl mb-2">
                    {titulo}
                </h3>

                <p className="">
                    {descricao}
                </p>
            </div>

            <div className="color-foreground font-medium mt-10 text-[18px]">
                <p>
                    Valor:{" "}
                    <span className="font-medium">
                        {valor.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </span>
                </p>

                <p>
                    Prazo Estimado:{" "}
                    <span className="font-medium">
                        {prazo === 1 ? "dia" : "dias"}
                     </span>
                </p>
            </div>

        </div>
    )
}