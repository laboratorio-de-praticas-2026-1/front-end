import { Navbar } from "@/components/layout/Navbar";
import ContactForm from "@/components/sections/contato/ContactForm";
import ContactHeader from "@/components/sections/contato/ContactHeader";
import { Footer } from "@/components/layout/Footer";
import ContactMap from "@/components/sections/contato/ContactMap";


export function Contato() {
  return (
    <main className="min-h-screen bg-zinc-50 font-sans">
      <Navbar/>
      <ContactHeader/>
      <ContactForm/>
      <ContactMap/>
      <Footer/>

    </main>
  );
}