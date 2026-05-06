import { useState, useEffect } from 'react';
import { faqPublicoService } from '@/services/faqPublicoService';
import type { FAQPublico } from '@/types/faqPublico.types';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQPublico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const data = await faqPublicoService.listarTodos();
        setFaqs(data);
      } catch (error) {
        console.error('Erro ao carregar FAQs:', error);
      } finally {
        setLoading(false);
      }
    }
    loadFaqs();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-16 px-4 md:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Layout de 2 colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Coluna da esquerda - Título e subtítulo */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Ficou com<br />alguma dúvida?
            </h2>
            <p className="text-gray-600 text-lg max-w-md">
              Encontre respostas para suas principais dúvidas sobre os serviços e atendimentos da Bortone.
            </p>
          </div>

          {/* Coluna da direita - Lista de perguntas */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-24 text-gray-500">
                Carregando...
              </div>
            ) : faqs.length === 0 ? (
              <div className="flex items-center justify-center h-24 text-gray-500">
                Nenhuma dúvida disponível no momento.
              </div>
            ) : (
              faqs.map((faq, index) => (
                <div key={faq.id} className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-800 font-medium pr-8">
                      {index + 1}. {faq.pergunta}
                    </span>
                    <span className="text-2xl text-gray-500 flex-shrink-0">
                      {openIndex === index ? '−' : '+'}
                    </span>
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-6 pb-6 text-gray-600 border-t border-gray-100 pt-4">
                      {faq.resposta}
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Botão Veja mais dúvidas - CENTRALIZADO */}
            <div className="mt-8 flex justify-center">
              <a 
                href="/duvidas" 
                className="bg-primary inline-flex items-center gap-2 text-white font-medium px-8 py-4 rounded-full transition-colors hover:opacity-90"
              >
                <span>Veja mais dúvidas</span>
                <span className="text-xl">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;