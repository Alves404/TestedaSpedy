import React, { useEffect } from 'react';
import Topography from '../components/Topography';
import GooeyNav from '../components/GooeyNav';
import MobileNav from '../components/MobileNav';
import { useResolucaoTela } from '../hooks/useResolucaoTela';
import DesktopApp from '../components/desktop/DesktopApp';
import MobileApp from '../components/mobile/MobileApp';
import SplitText from '../components/SplitText';
import '../styles/Home.css'; // O antigo css da Home foi para cá

/**
 * LandingPage Central do CoWorking Enterprise.
 * Esta página possui o fundo em WebGL e agrupa as seções:
 * - Hero (Início)
 * - Sobre
 * - Salas
 * - Agendar (Carrega os componentes React do sistema)
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
      {/* --- Fundo Animado Otimizado via WebGL (ogl) --- */}
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
        grain={true}
        grainIntensity={0.05}
        opacity={1}
        mouseInteraction={true}
        mouseRadius={0.3}
        mouseStrength={0.4}
      />

      <GooeyNav />

      {/* Seção Início (Hero) */}
      <section id="inicio" className="section-container hero-section">
        <h1 className="hero-title">
          O Futuro do seu<br />Escritório.
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
      </section>

      {/* Seção Sobre */}
      <section id="sobre" className="section-container info-section">
        <h2>Sobre Nós</h2>
        <p>
          O CoWorking Enterprise é um espaço desenhado para focar 100% no desempenho da sua equipe.
          Criamos um ecossistema livre de distrações, com café ilimitado, salas acusticamente isoladas
          e internet em fibra ótica simétrica. Tudo o que você precisa para transformar ideias em realidade.
        </p>
      </section>

      {/* Seção Salas */}
      <section id="salas" className="section-container info-section">
        <SplitText text="Nossas Salas" tag="h2" />
        <div className="salas-grid">
          <div className="sala-card">
            <div className="sala-image-container">
              <img src="/images/salas/sala1.jpg" alt="Sala Steve Jobs" />
            </div>
            <h3>Sala Steve Jobs</h3>
            <p>Perfeita para pitchs de vendas e reuniões impactantes .</p>
          </div>
          <div className="sala-card">
            <div className="sala-image-container">
              <img src="/images/salas/sala2.jpg" alt="Sala Bill Gates" />
            </div>
            <h3>Sala Bill Gates</h3>
            <p>Ideal para alinhamentos estratégicos com diretores .</p>
          </div>
          <div className="sala-card">
            <div className="sala-image-container">
              <img src="/images/salas/sala3.jpg" alt="Sala Ada Lovelace" />
            </div>
            <h3>Sala do Mark Zuckerberg</h3>
            <p>Feita para sessões técnicas e pareamento de desenvolvedores.</p>
          </div>
        </div>
      </section>

      {/* Seção de Agendamento (Carrega o sistema) */}
      <section id="agendar" className="section-container app-section">
        <div className="app-wrapper">
          {isMobile ? <MobileApp /> : <DesktopApp />}
        </div>
      </section>

      <MobileNav />
    </div>
  );
}
