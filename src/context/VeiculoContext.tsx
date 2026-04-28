import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getVeiculos } from "@/services/debitosService";

interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  ano: number;
}

interface VeiculoContextType {
  veiculos: Veiculo[];
  veiculoAtivo: Veiculo | null;
  setVeiculoAtivo: (veiculo: Veiculo) => void;
  isLoading: boolean;
}

const VeiculoContext = createContext<VeiculoContextType | null>(null);

export function VeiculoProvider({ children }: { children: ReactNode }) {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [veiculoAtivo, setVeiculoAtivo] = useState<Veiculo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getVeiculos().then((data) => {
      setVeiculos(data);
      setVeiculoAtivo(data[0] ?? null);
    }).finally(() => setIsLoading(false));
  }, []);

  return (
    <VeiculoContext.Provider value={{ veiculos, veiculoAtivo, setVeiculoAtivo, isLoading }}>
      {children}
    </VeiculoContext.Provider>
  );
}

export function useVeiculo() {
  const ctx = useContext(VeiculoContext);
  if (!ctx) throw new Error("useVeiculo must be used within VeiculoProvider");
  return ctx;
}
