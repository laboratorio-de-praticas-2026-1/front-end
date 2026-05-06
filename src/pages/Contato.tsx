import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import ContactForm from "@/components/sections/contato/ContactForm";
import ContactHeader from "@/components/sections/contato/ContactHeader";
import { Footer } from "@/components/layout/Footer";
import ContactMap from "@/components/sections/contato/ContactMap";
import { contatoService, type ContatoEmpresa } from "@/services/contatoService";


export function Contato() {
  const [empresa, setEmpresa] = useState<ContatoEmpresa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const dados = await contatoService.buscarDadosEmpresa();
        setEmpresa(dados);
      } catch (error) {
        console.error("Erro ao buscar dados da empresa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 font-sans">
      <Navbar/>
      <ContactHeader/>
      <ContactForm empresa={empresa} loading={loading} />
      <ContactMap
        latitude={empresa?.latitude ? parseFloat(empresa.latitude) : -24.4979}
        longitude={empresa?.longitude ? parseFloat(empresa.longitude) : -47.8449}
      />
      <Footer/>
    </main>
  );
}