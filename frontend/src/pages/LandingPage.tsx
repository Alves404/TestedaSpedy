import Topography from '../components/Topography';
import GooeyNav from '../components/GooeyNav';
import MobileNav from '../components/MobileNav';
import HeroPortal from '../components/HeroPortal';
import { useResolucaoTela } from '../hooks/useResolucaoTela';
import DesktopApp from '../components/desktop/DesktopApp';
import MobileApp from '../components/mobile/MobileApp';
import SplitText from '../components/SplitText';
import SpotlightCard from '../components/SpotlightCard';
import BorderGlowCard from '../components/BorderGlowCard';
import FadeIn from '../components/FadeIn';
import '../styles/Home.css';

/**
 * LandingPage Central do CoWorking Enterprise.
 *
 * Arquitetura de fundo:
 * - Topography: position:fixed, z-index:-1, cobre a tela INTEIRA em todas as sections
 * - GooeyNav: position:fixed, z-index:100, sempre visível no topo
 * - HeroPortal: position:fixed, clip-path animado. Contém só o texto/botões do hero.
 *   Quando totalmente expandido → opacity:0, liberando as sections abaixo.
 * - hero-portal-spacer: empurra as sections para baixo do espaço de scroll do portal.
 */
export default function LandingPage() {
  const isMobile = useResolucaoTela();

  const handleScrollToAgendar = () => {
    const agendarSection = document.getElementById('agendar');
    if (agendarSection) {
      agendarSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-layout dark-theme">

      {/* NavBar SEMPRE visível no topo da página (z-index 100), fora do portal para não ser engolida pelas sections */}
      <GooeyNav />

      {/* ============================================================
          CAMADA 1: HeroPortal — caixa que expande ao rolar e revela o site.
          Contém fundo WebGL, texto e botões do Hero.
          O fundo 3D (Topography) continua visível atrás de tudo após a expansão.
          ============================================================ */}
      <HeroPortal>
        {/* Fundo 3D dentro do portal para ser revelado pela caixa */}
        <Topography
          lowColor="#06b6d4"
          midColor="#7c3aed"
          highColor="#ffffff"
          speed={0.35}
          morphAmount={3}
          morphSpeed={0.05}
          bands={2}
          thickness={0.01}
          scale={2}
          pixelSize={1}
          glow={0.5}
          colorMode="elevation"
          contrast={3}
          brightness={1}
          fillBands={false}
          grain={false}
          grainIntensity={0.05}
          opacity={1}
          mouseInteraction={false}
          mouseRadius={0.3}
          mouseStrength={0.4}
        />

        <div className="hero-content" id="inicio">
          <h1 className="hero-title">
            O Futuro do seu<br />Escritório
          </h1>
          <div className="hero-buttons">
            <button className="btn-primary-glow" onClick={handleScrollToAgendar}>
              Agendar uma Sala
            </button>
            <button className="btn-secondary-dark" onClick={() => {
              document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Saber mais
            </button>
          </div>
          <div className="hero-scroll-hint">
            <div className="scroll-mouse">
              <div className="scroll-wheel"></div>
            </div>
            <span>Role para descobrir</span>
          </div>
        </div>
      </HeroPortal>

      {/* Espaçador: cria o espaço de scroll para a animação do portal */}
      <div className="hero-portal-spacer" aria-hidden="true" />

      {/* ============================================================
          CAMADA 4: Sections — aparecem conforme o portal some
          O Topography fixo fica visível atrás de todas elas.
          ============================================================ */}

      {/* Seção Sobre */}
      <section id="sobre" className="section-container info-section">
        <SpotlightCard className="sobre-card-wrapper">
          <div className="sobre-content">
            <SplitText text="Sobre Nós" tag="h2" />
            <FadeIn delay={300}>
              <p>
                O CoWorking Enterprise é um espaço desenhado para focar 100% no desempenho da sua equipe.
                Criamos um ecossistema livre de distrações, com café ilimitado, salas acusticamente isoladas
                e internet em fibra ótica simétrica. Tudo o que você precisa para transformar ideias em realidade.
              </p>
            </FadeIn>
          </div>
        </SpotlightCard>
      </section>

      {/* Seção Salas */}
      <section id="salas" className="section-container info-section">
        <SplitText text="Nossas Salas" tag="h2" />
        <div className="salas-grid">
          <BorderGlowCard className="sala-card-wrapper" onClick={handleScrollToAgendar}>
            <div className="sala-image-container">
              <img src="/images/salas/sala1.jpg" alt="Sala Steve Jobs" />
            </div>
            <h3>Sala Steve Jobs</h3>
            <p>Perfeita para pitchs de vendas e reuniões impactantes.</p>
          </BorderGlowCard>

          <BorderGlowCard className="sala-card-wrapper" onClick={handleScrollToAgendar}>
            <div className="sala-image-container">
              <img src="/images/salas/sala2.jpg" alt="Sala Bill Gates" />
            </div>
            <h3>Sala Bill Gates</h3>
            <p>Ideal para alinhamentos estratégicos com diretores.</p>
          </BorderGlowCard>

          <BorderGlowCard className="sala-card-wrapper" onClick={handleScrollToAgendar}>
            <div className="sala-image-container">
              <img src="/images/salas/sala3.jpg" alt="Sala Mark Zuckerberg" />
            </div>
            <h3>Sala Mark Zuckerberg</h3>
            <p>Foco total para desenvolvimento e workshops intensivos.</p>
          </BorderGlowCard>
        </div>
      </section>

      {/* Seção de Agendamento */}
      <section id="agendar" className="section-container app-section">
        <div className="app-wrapper">
          {isMobile ? <MobileApp /> : <DesktopApp />}
        </div>
      </section>

      <MobileNav />
    </div>
  );
}
