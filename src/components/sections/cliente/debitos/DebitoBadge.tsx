import { cn } from "@/lib/utils";

interface DebitoBadgeProps {
  label: string;
}

const BADGE_STYLES: Record<string, string> = {
  Atrasado: "bg-red-100 text-red-700 border-red-200",
  IPVA: "bg-blue-100 text-blue-700 border-blue-200",
  Licenciamento: "bg-teal-100 text-teal-700 border-teal-200",
  Multa: "bg-orange-100 text-orange-700 border-orange-200",
  ServicoAdicional: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

export function DebitoBadge({ label }: DebitoBadgeProps) {
  const style = BADGE_STYLES[label] ?? "bg-zinc-100 text-zinc-600 border-zinc-200";
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border", style)}>
      {label}
    </span>
  );
}
