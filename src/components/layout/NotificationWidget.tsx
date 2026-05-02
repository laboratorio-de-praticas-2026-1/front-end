import { useState, useEffect } from "react";
import { Bell, X, AlertCircle, Car } from "lucide-react";
import { notificationsService } from "@/services/notificationsService";

export interface NotificacaoDebito {
  descricao: string;
  valor: number;
  placa: string;
  created_at: string;
}

// // MOCK DE DADOS: Mantido como fallback visual até a API ser ligada
// const mockNotificacoes: NotificacaoDebito[] = [
//   {
//     descricao: "Multa por excesso de velocidade",
//     valor: 150.00,
//     placa: "ABC1D23",
//     created_at: "2026-04-28T14:30:00"
//   },
//   {
//     descricao: "Taxa de licenciamento",
//     valor: 98.50,
//     placa: "XYZ9K87",
//     created_at: "2026-04-25T09:15:00"
//   },
//   {
//     descricao: "Multa por estacionamento irregular",
//     valor: 195.20,
//     placa: "QWE4R56",
//     created_at: "2026-04-20T18:45:00"
//   },
//   {
//     descricao: "IPVA atrasado",
//     valor: 850.00,
//     placa: "JKL7M89",
//     created_at: "2026-04-18T11:00:00"
//   },
//   {
//     descricao: "Multa por avanço de sinal vermelho",
//     valor: 293.47,
//     placa: "HGF2T34",
//     created_at: "2026-04-15T07:20:00"
//   }
// ];

export function NotificationWidget() {

  const [notificacoes, setNotificacoes] = useState<NotificacaoDebito[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isWidgetVisible, setIsWidgetVisible] = useState(true);

useEffect(() => {
  const buscarNotificacoes = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?.id;

      if (!userId) return;

      const data = await notificationsService.listarPorUsuario(userId);

      const adaptado = data.map((item: any) => {
        const texto = item?.mensagem ?? "";

        const placaMatch = texto.match(/[A-Z]{3}\d[A-Z]\d{2}/);
        const placa = placaMatch?.[0] ?? "N/A";

        return {
          descricao: texto,
          placa,
          valor: Number(item?.valor) || 0,
          created_at: item?.data ?? "",
        };
      });

      setNotificacoes(adaptado);

    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
      setNotificacoes([]);
    }
  };

  buscarNotificacoes();
}, []);

 if (!isWidgetVisible) {
  return null;
}

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };
  
  const handleFecharTudo = () => {
    setIsPopupOpen(false);
    setIsWidgetVisible(false);
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end">
      
      {/* BOTÃO FLUTUANTE */}
      <button
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        className="relative w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-secondary transition-all hover:scale-105 active:scale-95"
      >
        <Bell className="w-6 h-6 text-white" />
        
        {/* Badge vermelha com o contador */}
        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 border-white text-[12px] font-bold text-white shadow-sm">
          {notificacoes.length > 9 ? "9+" : notificacoes.length}
        </span>
      </button>

      {/* POP-UP DE NOTIFICAÇÕES */}
      {isPopupOpen && (
        <div className="mt-4 w-[90vw] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
          
          {/* Cabeçalho do Pop-up */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-white" />
              <h3 className="font-bold text-sm text-white">Débitos Pendentes</h3>
            </div>
            <button 
              onClick={handleFecharTudo}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              title="Ignorar alertas"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Lista de Notificações com Scroll */}
          <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-2">
            {notificacoes.map((notificacao, index) => (
              <div 
                key={index} 
                className="p-3 mb-2 last:mb-0 hover:bg-zinc-50 rounded-xl transition-colors border border-transparent hover:border-zinc-100 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-zinc-800 leading-snug flex-1">
                    {notificacao.descricao}
                  </span>
                  <span className="text-sm font-bold text-red-600 whitespace-nowrap">
                    {formatarMoeda(notificacao.valor)}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium bg-zinc-100 w-fit px-2 py-1 rounded-md">
                  <Car className="w-3.5 h-3.5" />
                  Placa: {notificacao.placa}
                </div>
              </div>
            ))}
          </div>
          
          {/* Rodapé do Pop-up */}
          <div className="p-3 border-t border-zinc-100 bg-zinc-50 text-center">
            <span className="text-xs text-zinc-500">
              Verifique a aba de Débitos para mais detalhes.
            </span>
          </div>
        </div>
      )}

    </div>
  );
}