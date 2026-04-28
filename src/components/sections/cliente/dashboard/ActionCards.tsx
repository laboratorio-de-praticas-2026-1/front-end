import { Link } from "react-router-dom";
import { FaCar } from "react-icons/fa";
import { FiFileText, FiBell } from "react-icons/fi";
import { MdOutlineQrCode } from "react-icons/md";
import { Card, CardContent } from "@/components/ui/card";

interface ActionCardItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const cards: ActionCardItem[] = [
  {
    icon: <FaCar className="w-6 h-6 text-secondary" />,
    title: "Monitore seu veículo",
    description: "Monitore em tempo real tudo sobre seu veículo.",
    href: "/cliente/veiculos",
  },
  {
    icon: <FiFileText className="w-6 h-6 text-secondary" />,
    title: "Monitore sua CNH",
    description: "Monitore em tempo real tudo sobre sua CNH.",
    href: "/cliente/cnh",
  },
  {
    icon: <MdOutlineQrCode className="w-6 h-6 text-secondary" />,
    title: "CRLV Digital",
    description: "Retire seu CRLV Digital e acompanhe tudo sobre.",
    href: "/cliente/crlv",
  },
  {
    icon: <FiBell className="w-6 h-6 text-secondary" />,
    title: "Alerta de multas",
    description: "Saiba quando seu veículo receber uma multa.",
    href: "/cliente/notificacoes",
  },
];

export function ActionCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="border border-zinc-200 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <CardContent className="p-5 flex flex-col gap-3">
            {/* Icon circle */}
            <div className="w-11 h-11 bg-[linear-gradient(315deg,_#1E84CF_0%,_#BCE1F9_100%)] rounded-lg flex items-center justify-center">
              {card.icon}
            </div>

            <div className="space-y-1 flex-1">
              <h3 className="text-sm font-bold text-secondary">{card.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{card.description}</p>
            </div>

            <Link
              to={card.href}
              className="text-xs text-secondary hover:underline font-semibold mt-1"
            >
              Veja mais
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
