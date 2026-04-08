import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

interface BuscaPublicidadeProps {
  onSearch?: (filtros: { busca: string }) => void;
  onNovaPublicidade?: () => void;
}

export default function BuscaCadastroPublicidade({ onSearch, onNovaPublicidade }: BuscaPublicidadeProps) {
  const [termoBusca, setTermoBusca] = useState("");

  const handlePesquisa = () => {
    if (onSearch) {
      onSearch({ busca: termoBusca });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePesquisa();
    }
  };

  return (
    <div className="w-full flex flex-col">
      <h1 className="font-bold text-secondary text-4xl mb-2">Publicidade</h1>
      <p className="text-muted-foreground text-sm">Visualize, crie, organize e acompanhe todas as publicidades do sistema.</p>

      <div className="w-full flex flex-col lg:flex-row mt-10 md:mt-12 gap-5 items-stretch lg:items-center">
        
        {/* Container da borda azul com w-full para se igualar à tabela */}
        <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:gap-2 border-2 border-secondary rounded-xl p-2 sm:p-1.5 bg-white w-full">
          
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
            <Input 
              type="search" 
              placeholder="Pesquisar publicidade..." 
              className="pl-9 border-none bg-transparent focus-visible:ring-0 h-10 w-full text-sm"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              onKeyDown={handleKeyDown} 
            />
          </div>

          <Button 
            className="w-full sm:w-auto rounded-lg h-10 text-sm cursor-pointer flex gap-2 items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] bg-primary text-white" 
            type="button" 
            onClick={onNovaPublicidade}
          > 
            <Plus className="h-4 w-4" />
            Nova publicidade 
          </Button>

        </div>
      </div>
    </div>
  );
}
