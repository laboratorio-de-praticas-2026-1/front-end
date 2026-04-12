import CardServicos from "../../ui/CardServicos";
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
            descricao: "Regularize o licenciamento do seu veículo sem burocracia. Cuidamos de toda a documentação para que você circule com tranquilidade.",
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
            titulo: "Regularização de Débitos", // Removi o "5." para manter o padrão visual dos títulos
            descricao: "Consultamos e auxiliamos na regularização de multas, IPVA e outros débitos vinculados ao seu veículo.",
            valor: 0.0,
            prazo: 0
        },
        {
            id: 6,
            titulo: "Comunicação de Venda", // Removi o "6."
            descricao: "Evite problemas futuros. Realizamos a comunicação de venda do veículo junto aos órgãos responsáveis.",
            valor: 0.0,
            prazo: 0
        },
        {
            id: 7,
            titulo: "Alteração de Dados do Veículo", // Removi o "7."
            descricao: "Mudanças como cor, características ou outras alterações precisam ser registradas. Fazemos todo o processo para você.",
            valor: 0.0,
            prazo: 0
        },
        {
            id: 8,
            titulo: "Consultas Veiculares", // Removi o "8."
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
            titulo: "Emissão de CRLV",
            descricao: "Auxiliamos na emissão do CRLV digital, garantindo que você tenha acesso ao documento atualizado do seu veículo diretamente no celular ou em versão impressa, conforme sua necessidade.",
            valor: 0.0,
            prazo: 0
        },
        {
            id: 11,
            titulo: "Baixa de Veículo", // Removi o "11."
            descricao: "Se o veículo foi vendido para desmanche, sofreu perda total ou não será mais utilizado, realizamos todo o processo de baixa junto aos órgãos responsáveis, garantindo a regularização da situação.",
            valor: 0,
            prazo: 0
        },
        {
            id: 12,
            titulo: "Assessoria Completa em documentação veicular", // Removi o "12." e corrigi "documentaçãao"
            descricao: "Oferecemos suporte completo para resolver qualquer questão relacionada à documentação do seu veículo. Nossa equipe acompanha cada etapa do processo para garantir agilidade, segurança e menos burocracia para você.",
            valor: 0,
            prazo: 0
        },
    ];

    return (
        <section className="w-full px-6 py-16 md:py-24 bg-[#F0F8FF] flex flex-col">
            <div className="mx-auto w-full max-w-7xl">
                
                {/* Título da Seção */}
                <h3 className="font-semibold text-center text-foreground text-2xl md:text-3xl lg:text-4xl mb-12 lg:mb-16">
                    Conheça todos os serviços disponíveis
                </h3>
            
                {/* Grid de Cards */}
                {/* lg:grid-cols-4 no notebook largo, md:grid-cols-3 no tablet, sm:grid-cols-2 no celular deitado, 1 coluna no mobile */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

                {/* Banner Inferior (Call to Action) */}
                <div className="bg-primary mx-auto mt-20 flex w-full max-w-[1000px] flex-col md:flex-row items-center md:items-start lg:items-center justify-between gap-8 rounded-[2rem] px-8 py-10 text-white text-center md:text-left shadow-lg transition-transform hover:scale-[1.01]">
                    
                    <div className="flex-1">
                        <h3 className="text-2xl md:text-3xl font-semibold mb-3">
                            Você precisa de algum serviço específico?
                        </h3>
                        <p className="text-lg md:text-xl text-white/90">
                            Nossa equipe está pronta para analisar seu caso agora!
                        </p>
                    </div>

                    <button className="flex items-center justify-center shrink-0 rounded-full bg-white font-bold text-secondary text-lg gap-3 px-8 py-4 h-14 md:h-16 shadow-md hover:bg-zinc-100 hover:scale-105 transition-all w-full md:w-auto">
                        <FaWhatsapp className="text-secondary w-6 h-6" />
                        WhatsApp Online
                    </button>

                </div>

            </div>
        </section>
    );
}