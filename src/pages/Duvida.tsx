import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState, useEffect, useMemo } from "react";
import DuvidaHeader from "@/components/sections/duvidas/DuvidaHeader";
import type { FAQPublico } from "@/types/faqPublico.types";
import { faqPublicoService } from "@/services/faqPublicoService";
import CategoryTabs from "@/components/sections/duvidas/CategoryTabs";
import PerguntasGerais from "@/components/sections/duvidas/PerguntasGerais";
import CtaBanner from "@/components/sections/duvidas/CtaBanner";
import PerguntasFrequentes from "@/components/sections/duvidas/PerguntasFrequentes";


export function Duvida() {
    const [faqs, setFaqs] = useState<FAQPublico[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("Todas");

useEffect(() => {
  async function load() {
    const data = await faqPublicoService.listarTodos();
    setFaqs(data);
  }
  load();
}, []);

const filteredFaqs = useMemo(() => {
  return faqs.filter((faq) => {
    const matchSearch =
      faq.pergunta.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.resposta.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory =
      activeCategory === "Todas" ||
      faq.categoria === activeCategory;

    return matchSearch && matchCategory;
  });
}, [faqs, searchQuery, activeCategory]);

const categories = useMemo(() => {
    const unique = new Set(faqs.map((f) => f.categoria));
    return ["Todas", ...Array.from(unique)];
  }, [faqs]);

  return (
    <main className="min-h-screen bg-zinc-50 font-sans">
      <Navbar/>
      <DuvidaHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <CategoryTabs
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />

      <PerguntasGerais
        faqs={filteredFaqs}
      />

      <CtaBanner />

      <PerguntasFrequentes
        faqs={filteredFaqs}
      />
        
      <Footer/>

    </main>
  );
}