import * as Accordion from "@radix-ui/react-accordion";
import type { FAQPublico } from "@/types/faqPublico.types";

interface Props {
  faq: FAQPublico;
}

export default function FaqAccordion({ faq }: Props) {
  return (
    <Accordion.Root type="single" collapsible className="w-full">
      <Accordion.Item
        value={faq.id}
        className="bg-white rounded-2xl shadow-sm px-5 py-1"
      >
        <Accordion.Header>
          <Accordion.Trigger
            className="w-full flex justify-between items-center py-4 text-left
                       text-[15px] font-medium text-gray-800
                       group cursor-pointer select-none"
          >
            {faq.pergunta}

            <span
              className="ml-4 flex-shrink-0 text-4xl font-light text-gray-800
                         transition-transform duration-300
                         group-data-[state=open]:rotate-45"
            >
              +
            </span>
          </Accordion.Trigger>
        </Accordion.Header>

        <Accordion.Content
          className="overflow-hidden text-gray-800 text-[14px] leading-relaxed font-regular
                     data-[state=open]:animate-slideDown
                     data-[state=closed]:animate-slideUp"
        >
          <div className="pb-4 border-t border-gray-300 pt-3">
            {faq.resposta}
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}