import HeroSection from '../components/HeroSection';
import MarqueeSection from '../components/MarqueeSection';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import ProjectsSection from '../components/ProjectsSection';

const Portfolio = () => {
  return (
    <div className="bg-[#0C0C0C]" style={{ overflowX: 'clip' }}>
      <HeroSection />
      {/* <MarqueeSection /> */}
      <AboutSection />
      <ProjectsSection />
      <ServicesSection />
      
    </div>
  );
};

export default Portfolio;
