import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      pergunta: "Quais serviços um despachante oferece?",
      resposta: "Um despachante atua como intermediário entre cidadãos/empresas e órgãos públicos, agilizando processos burocráticos. Oferecemos serviços como transferência de veículo, licenciamento anual, segunda via de documentos (CRLV, CRV), baixa de multas, vistoria veicular e muito mais."
    },
    {
      pergunta: "Preciso ir ao Detran para resolver a documentação do meu veículo?",
      resposta: "Não! Nós cuidamos de toda a documentação para você, sem precisar enfrentar filas ou se preocupar com burocracia. Você só precisa nos fornecer os documentos necessários."
    },
    {
      pergunta: "Quanto tempo demora para concluir um serviço?",
      resposta: "Os prazos variam: transferência (3 a 7 dias), licenciamento (1 a 3 dias), segunda via (2 a 5 dias). Sempre trabalhamos para agilizar ao máximo cada processo."
    },
    {
      pergunta: "Quanto custa o serviço de despachante?",
      resposta: "Os valores variam conforme o serviço. Entre em contato conosco para um orçamento personalizado e sem compromisso."
    }
  ];

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
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl bg-white overflow-hidden">
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
            ))}

            {/* Botão Veja mais dúvidas - CENTRALIZADO */}
            <div className="mt-8 flex justify-center">
              <a 
                href="#" 
                className="inline-flex items-center gap-2 text-white font-medium px-8 py-4 rounded-full transition-colors hover:opacity-90"
                style={{ backgroundColor: '#EB951C' }}
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