import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ProjectsSection from '../components/ProjectsSection';
import ServicesSection from '../components/ServicesSection';
import ContactSection from '../components/Contact';

const Portfolio = () => {
  return (
    <div className="bg-[#0C0C0C]" style={{ overflowX: 'clip' }}>
      <div id="home"><HeroSection /></div>
      <div id="about"><AboutSection /></div>
      <div id="projects"><ProjectsSection /></div>
      <div id="skills"><ServicesSection /></div>
      
      <div id="contact"><ContactSection /></div>
    </div>
  );
};

export default Portfolio;