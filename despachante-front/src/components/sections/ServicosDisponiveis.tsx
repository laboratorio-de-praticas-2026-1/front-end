import CardServicos from "../ui/CardServicos";
import { FaWhatsapp } from "react-icons/fa";

export default function ServicosSection() {
    const servicos = [
        {
            id: 1,
            titulo: "Transferência de Veículo",
            descricao: "Realizamos todo o processo de transferência de propriedade de forma rápida e segura, garantindo que seu veículo seja registrado corretamente no nome do novo proprietário.",
            valor: 0.0,
            prazo: 0

        },

        {
            id: 2,
            titulo: "Licenciamento Anual",
            descricao: "Regularize o licenciamento do seu veículo sem burocracia. Cuidamos de toda a documentação para que você circule com tranquilidade..",
            valor: 0.0,
            prazo: 0

        },

        {
            id: 3,
            titulo: "Primeiro Emplacamento",
            descricao: "Adquiriu um veículo novo? Nós cuidamos do primeiro emplacamento e de toda a documentação necessária para colocar seu carro na rua.",
            valor: 0.0,
            prazo: 0

        },

        {
            id: 4,
            titulo: "2ª Via de Documentos",
            descricao: "Perdeu ou teve documentos roubados? Emitimos a segunda via do CRLV e outros documentos essenciais com agilidade.",
            valor: 0.0,
            prazo: 0

        },

        {
            id: 5,
            titulo: "5. Regularização de Débitos",
            descricao: "Consultamos e auxiliamos na regularização de multas, IPVA e outros débitos vinculados ao seu veículo.",
            valor: 0.0,
            prazo: 0

        },

        {
            id: 6,
            titulo: "6. Comunicação de Venda",
            descricao: "Evite problemas futuros. Realizamos a comunicação de venda do veículo junto aos órgãos responsáveis.",
            valor: 0.0,
            prazo: 0

        },

        {
            id: 7,
            titulo: "7. Alteração de Dados do Veículo",
            descricao: "Mudanças como cor, características ou outras alterações precisam ser registradas. Fazemos todo o processo para você.",
            valor: 0.0,
            prazo: 0

        },

        {
            id: 8,
            titulo: "8. Consultas Veiculares",
            descricao: "Oferecemos consultas completas sobre situação do veículo, débitos, restrições e histórico.",
            valor: 0.0,
            prazo: 0

        },

        {
            id: 9,
            titulo: "Parcelamento de Débitos Veiculares",
            descricao: "Facilitamos o pagamento de débitos do seu veículo, como multas, IPVA e licenciamento, oferecendo opções de parcelamento. Assim, você regulariza sua situação de forma prática e sem comprometer seu orçamento.",
            valor: 0.0,
            prazo: 0

        },

        {
            id: 10,
            titulo:"Emissão de CRLV ",
            descricao: "Auxiliamos na emissão do CRLV digital, garantindo que você tenha acesso ao documento atualizado do seu veículo diretamente no celular ou em versão impressa, conforme sua necessidade.",
            valor: 0.0,
            prazo: 0

        },

        {
            id: 11,
            titulo: "11. Baixa de Veículo",
            descricao: "Se o veículo foi vendido para desmanche, sofreu perda total ou não será mais utilizado, realizamos todo o processo de baixa junto aos órgãos responsáveis, garantindo a regularização da situação",
            valor: 0,
            prazo: 0

        },

        {
            id: 12,
            titulo: "12. Assesoria Completa em documentaçãao veicular",
            descricao: "Oferecemos suporte completo para resolver a qualquer questão relacionada à documentação do seu veículo. Nossa equipe acompanha cada etapa do processo para garantir agilidade, segurança e menos burocracia para você",
            valor: 0,
            prazo: 0
        },

    ]

    return(
        <section className="w-full px-6 py-16 bg-[#F0F8FF] flex flex-col">

            <div className="mx-auto max-w-[1400px]">
                <h3 className="font-semibold text-center text-foreground mt-6 mb-12  md:text-2xl lg:mb-40 lg:text-4xl ">
                    Conheça todos os serviços disponíveis
                </h3>
            

                <div className="mt-12 w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {servicos.map((servico) => (
                        <CardServicos 
                        
                            key={servico.id}
                            titulo={servico.titulo}
                            descricao={servico.descricao}
                            valor={servico.valor}
                            prazo={servico.prazo}
                        />
                    ))}
                </div>

                <div className="bg-primary mx-auto mt-20 flex w-full max-w-[1000px] min-h-[180px] flex-col md:flex-row items-start justify-between gap-6 rounded-3xl px-6 py-8 text-white md:px-16 py-8  md:items-center">

                    <div>
                        <h3 className="text-2xl font-semibold">
                            Você precisa de algum serviço específico?
                        </h3>

                        <p className="mt-2 text-[18px]">
                            Nossa equipe está pronta para analisar seu caso agora!
                        </p>

                    </div>

                    <button className=" flex items-center rounded-3xl bg-white font-bold text-secondary text-[18px] gap-2 px-6 py-3 h-16">
                        <FaWhatsapp className="text-secondary w-5 h-5" />
                        WhatsApp Online
                    </button>

                </div>

            </div>
        </section>
    )

}