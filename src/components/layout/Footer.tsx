
import logoFullBranca from "@/assets/logo-full-branca.png";

const solutionLinks = [
  { name: "Para quem dirige", href: "#" },
  { name: "Para empresas", href: "#" },
  { name: "Para cidades", href: "#" },
  { name: "Marcas parceiras", href: "#" },
];

const contactInfo = [
  { label: "Endereço:", text: "Rua Lorem Ipsum, 123 – Centro", isInfo: true },
  { label: "Telefone:", text: "(00) 0000-0000 | WhatsApp: (00) 00000-0000", isInfo: true }, 
  { label: "E-mail:", text: "contato@loremipsum.com.br", href: "mailto:contato@loremipsum.com.br", isEmailLink: true },
];

export function Footer() {
  return (
    <footer className="w-full bg-secondary text-white py-16 px-6 md:px-12 font-sans mt-auto">
      <div className="mx-auto max-w-7xl flex flex-col">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-16">
          {/* Soluções Section */}
          <div className="flex flex-col gap-6">
            <h4 className="font-bold text-lg">Soluções</h4>
            <ul className="flex flex-col gap-3">
              {solutionLinks.map((link, index) => (
                <li key={index} className="text-sm font-light hover:opacity-80 leading-relaxed cursor-pointer transition-opacity">
                  {link.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Contato Section */}
          <div className="flex flex-col gap-6">
            <h4 className="font-bold text-lg">Contato</h4>
            <ul className="flex flex-col gap-3">
              {contactInfo.map((info, index) => (
                <li key={index} className="text-sm font-light leading-relaxed">
                  {info.isEmailLink ? (
                    <>
                      {info.label}{" "}
                      <a href={info.href} className="underline hover:opacity-80 transition-opacity">
                        {info.text}
                      </a>
                    </>
                  ) : (
                    <>
                      {info.label} {info.text}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
          {/* Logo na esquerda*/}
          <div className="flex items-center gap-3">
            <img src={logoFullBranca} alt="Bortone Group Logo" className="h-14 w-auto object-contain" />
          </div>

          <div className="text-xs font-light text-zinc-300 text-center md:text-right leading-relaxed max-w-3xl flex flex-col gap-1 md:gap-0">
            <p>
              © 2026 Lorem Ipsum Dolor LTDA. CNPJ: 00.000.000/0000-00. Rua Lorem Ipsum, 000 – Bairro Dolor, Cidade Ipsum – ST, 00000-000.
            </p>
            <p>
              Telefone: (00) 0000-0000 | E-mail:{" "}
              <a href="mailto:contato@loremipsum.com.br" className="underline hover:opacity-80 transition-opacity">
                contato@loremipsum.com.br
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}