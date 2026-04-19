import CardServicos from "../../ui/CardServicos";
import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { servicosService } from "../../../services/servicoService";
import { useLocation } from "react-router-dom";

export default function ServicosSection() {
    const [servicos, setServicos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const sectionRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const data = await servicosService.listarTodos();
                setServicos(data);
            } catch {
                setError("Erro ao carregar serviços");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    // scroll botao todos
    useEffect(() => {
        if (location.hash === "#lista-servicos") {
            sectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [location]);

    if (loading) return <p className="text-center py-10">Carregando serviços...</p>;
    if (error) return <p className="text-center py-10">{error}</p>;

    return (
        <section ref={sectionRef} id="lista-servicos" className="w-full px-6 py-16 md:py-24 bg-[#F0F8FF] flex flex-col">
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
                            titulo={servico.nome}
                            descricao={servico.descricao ?? ""}
                            valor={Number(servico.valorBase) ?? 0}
                            prazo={servico.prazoEstimadoDias ?? 0}
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