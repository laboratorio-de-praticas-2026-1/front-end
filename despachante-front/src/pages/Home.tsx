import HeaderSection from '../components/sections/HeaderSection';  // ✅ CORRETO!
import ServiceCarousel from '../components/sections/ServiceCarousel';
import SobreGrupo from '../components/sections/AboutSection';
import FAQ from '../components/sections/FAQ';

const Home = () => {
  return (
    <main>
      {/* Seções existentes */}
      <HeaderSection />
      <ServiceCarousel />
      
      {/* NOVAS SEÇÕES */}
      <SobreGrupo />
      <FAQ />
    </main>
  );
};

export default Home;