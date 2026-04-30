import FaqAccordion from "./FaqAccordion";
import EmptyState from "./EmptyState";
import type { FAQPublico } from "@/types/faqPublico.types";

interface Props {
  faqs: FAQPublico[];
}

export default function PerguntasGerais({ faqs }: Props) {
  return ( 
    <section className="w-full mb-8 bg-transparent px-4 md:px-20 lg:px-60 py-10">

      {/* Título */}
      <div className="mb-20 flex flex-col items-center md:items-start">
        <h2 className="text-4xl text-secondary flex items-center gap-2">
          Perguntas <span className="font-semibold">Gerais</span>
        </h2>
        <div className="mt-2 h-2 w-78 rounded-full bg-[#BCD2E6]" />
      </div>

      {faqs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl">
          {faqs.map((faq) => (
            <FaqAccordion key={faq.id} faq={faq} />
          ))}
        </div>
      )}

    </section>
  );
}