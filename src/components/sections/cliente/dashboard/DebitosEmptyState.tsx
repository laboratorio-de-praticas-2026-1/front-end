import { FiCheckCircle } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { FiDollarSign } from "react-icons/fi";

export function DebitosEmptyState() {
  return (
    <Card className="border border-zinc-200 shadow-sm">
      <CardContent className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
          <div className="w-8 h-8 rounded-full border-2 border-zinc-700 flex items-center justify-center shrink-0">
            <FiDollarSign className="w-4 h-4 text-zinc-700" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-800">Débitos de veículo</h2>
            <p className="text-xs text-zinc-500">Débitos já disponíveis para pagamento:</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <FiCheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-zinc-800">Oba! Seu veículo não possui débitos pendentes.</p>
            <p className="text-sm text-zinc-500">Continue assim! Seus documentos estão em dia.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
