import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays, Search } from "lucide-react";

interface BuscaBlogProps {
  onSearch?: (filtros: { status: string; categoria: string; de: string; ate: string; busca: string }) => void;
  onNovaPostagem?: () => void;
}

export default function BuscaCadastroBlog({ onSearch, onNovaPostagem }: BuscaBlogProps) {
  const [status, setStatus] = useState("Todos");
  const [categoria, setCategoria] = useState("Todas");
  const [dataDe, setDataDe] = useState("");
  const [dataAte, setDataAte] = useState("");
  const [termoBusca, setTermoBusca] = useState("");

  const handlePesquisa = (override?: Partial<{ status: string; categoria: string; de: string; ate: string; busca: string }>) => {
    if (onSearch) {
      onSearch({ status, categoria, de: dataDe, ate: dataAte, busca: termoBusca, ...override });
    }
  };

  const handleLimparFiltros = () => {
    setStatus("Todos");
    setCategoria("Todas");
    setDataDe("");
    setDataAte("");
    setTermoBusca("");
    if (onSearch) {
      onSearch({ status: "Todos", categoria: "Todas", de: "", ate: "", busca: "" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePesquisa();
    }
  };

  return (
    <div className="w-full flex flex-col">
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="font-bold text-secondary text-4xl mb-2">Blog</h1>
          <p className="text-muted-foreground text-sm">Visualize, crie, organize e acompanhe todas as postagens do seu blog.</p>
        </div>
        
        <Button 
          className="w-full md:w-auto rounded-lg h-10 text-sm cursor-pointer flex gap-2 items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] bg-primary text-white px-6" 
          type="button" 
          onClick={onNovaPostagem}
        > 
          <Plus className="h-4 w-4" />
          Nova postagem 
        </Button>
      </div>

      <div className="w-full flex flex-col lg:flex-row mt-8 gap-3 lg:gap-0 items-stretch border-2 border-secondary rounded-xl p-2 bg-white">
        
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            handlePesquisa({ status: e.target.value });
          }}
          className="h-10 w-full lg:w-40 px-3 text-sm text-muted-foreground bg-transparent border-none focus:outline-none cursor-pointer"
        >
          <option value="Todos">Status</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>

        <div className="hidden lg:block w-px h-6 bg-border self-center mx-2" />

        <select
          value={categoria}
          onChange={(e) => {
            setCategoria(e.target.value);
            handlePesquisa({ categoria: e.target.value });
          }}
          className="h-10 w-full lg:w-44 px-3 text-sm text-muted-foreground bg-transparent border-none focus:outline-none cursor-pointer"
        >
          <option value="Todas">Categorias</option>
          <option value="Notícias">Notícias</option>
          <option value="Dicas">Dicas</option>
          <option value="Atualizações">Atualizações</option>
        </select>

        <div className="hidden lg:block w-px h-6 bg-border self-center mx-2" />

        <div className="relative w-full lg:w-auto flex-shrink-0 group">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
          <Input 
            type="date" 
            className="pl-9 h-10 border-none bg-transparent focus-visible:ring-0 w-full lg:w-36 text-sm text-muted-foreground"
            value={dataDe}
            onChange={(e) => {
              setDataDe(e.target.value);
              handlePesquisa({ de: e.target.value });
            }}
          />
        </div>

        <div className="hidden lg:block w-px h-6 bg-border self-center mx-2" />

        <div className="relative w-full lg:w-auto flex-shrink-0 group">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
          <Input 
            type="date"
            className="pl-9 h-10 border-none bg-transparent focus-visible:ring-0 w-full lg:w-36 text-sm text-muted-foreground"
            value={dataAte}
            onChange={(e) => {
              setDataAte(e.target.value);
              handlePesquisa({ ate: e.target.value });
            }}
          />
        </div>

        <div className="hidden lg:block w-px h-6 bg-border self-center mx-2" />

        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
          <Input 
            type="search" 
            placeholder="Pesquisar blog..." 
            className="pl-9 border-none bg-transparent focus-visible:ring-0 h-10 w-full text-sm"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            onKeyDown={handleKeyDown} 
          />
        </div>

        <Button 
          variant="outline"
          className="w-full lg:w-auto rounded-lg h-10 text-sm cursor-pointer shrink-0 bg-gray-100 border-none hover:bg-gray-200 text-gray-700 ml-0 lg:ml-2 px-6" 
          type="button" 
          onClick={handleLimparFiltros}
        > 
          Limpar filtros
        </Button>

      </div>
    </div>
  );
}