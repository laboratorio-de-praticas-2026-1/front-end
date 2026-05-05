import { Card, CardContent } from "@/components/ui/card";
import { recomendacaoService } from "@/services/recomendacaoService";
import { useEffect, useState } from "react";
import { FaCar } from "react-icons/fa";
import { FiBell, FiFileText } from "react-icons/fi";
import { MdOutlineQrCode } from "react-icons/md";
import { Link } from "react-router-dom";

interface ActionCardItem {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

export function ActionCards() {
  const [cards, setCard] = useState<ActionCardItem[]>([]);
  useEffect(() => {
    recomendacaoService.obterRecomendacoes().then((data) => {
      const cardsData: ActionCardItem[] = data.map((item: any) => {
        let icon;
        switch (item.categoriaBlog) {
          case "Documentacao":
            icon = <FiFileText className="w-6 h-6 text-secondary" />;
            break;
          case "Debitos":
            icon = <FaCar className="w-6 h-6 text-secondary" />;
            break;
          case "Multas":
            icon = <FiBell className="w-6 h-6 text-secondary" />;
            break;
          case "Legislacao":
            icon = <MdOutlineQrCode className="w-6 h-6 text-secondary" />;
            break;
          case "Condutor":
            icon = <FiFileText className="w-6 h-6 text-secondary" />;
            break;
          default:
            icon = <FiFileText className="w-6 h-6 text-secondary" />;
        }
        return {
          id: item.id,
          icon,
          title: item.nome,
          description: item.descricao,
          href: `/servicos`,
        };
      });
      setCard(cardsData);      
    });
  }, []);

  return (
    <div className="w-full flex flex-col">
      <h2 className="text-xl md:text-2xl font-bold text-secondary mb-5 mt-5">
        Serviços recomendados para você:
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card
            key={card.id}
            className="border border-zinc-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="p-5 flex flex-col gap-3">
              {/* Icon circle */}
              <div className="w-11 h-11 bg-[linear-gradient(315deg,_#1E84CF_0%,_#BCE1F9_100%)] rounded-lg flex items-center justify-center">
                {card.icon}
              </div>

              <div className="space-y-1 flex-1 mt-2">
                <h3 className="text-sm font-bold text-secondary">
                  {card.title}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <Link
                to={card.href}
                className="text-xs text-[#1E84CF] hover:underline font-bold mt-1"
              >
                Veja mais
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
