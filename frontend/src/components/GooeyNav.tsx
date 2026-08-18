import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import '../styles/Navbar.css';

// Criação do componente GooeyNav pedido pelo usuário
export default function GooeyNav() {
  const [activeItem, setActiveItem] = useState<string>('inicio');
  const effectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = 'inicio';
      sections.forEach((section) => {
        const htmlSection = section as HTMLElement;
        const sectionTop = htmlSection.offsetTop;
        if (window.scrollY >= sectionTop - window.innerHeight / 3) {
          current = section.getAttribute('id') || 'inicio';
        }
      });
      setActiveItem(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger immediately to set correct initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: MouseEvent<HTMLLIElement>, targetId: string) => {
    setActiveItem(targetId);

    // Animação de Scroll
    if (targetId !== 'inicio') {
      const section = document.getElementById(targetId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Criar as partículas da animação CSS do usuário na posição do clique
    if (effectRef.current && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const parentRect = effectRef.current.parentElement!.getBoundingClientRect();
      
      effectRef.current.style.left = `${rect.left - parentRect.left}px`;
      effectRef.current.style.top = `${rect.top - parentRect.top}px`;
      effectRef.current.style.width = `${rect.width}px`;
      effectRef.current.style.height = `${rect.height}px`;

      effectRef.current.classList.add('active');
      const particleCount = 6;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        particle.style.setProperty('--start-x', '0px');
        particle.style.setProperty('--start-y', '0px');
        particle.style.setProperty('--end-x', `${(Math.random() - 0.5) * 60}px`);
        particle.style.setProperty('--end-y', `${(Math.random() - 0.5) * 60}px`);
        particle.style.setProperty('--rotate', `${Math.random() * 360}deg`);
        particle.style.setProperty('--time', `${0.5 + Math.random() * 0.5}s`);

        const point = document.createElement('span');
        point.className = 'point';
        point.style.setProperty('--scale', `${0.5 + Math.random() * 0.5}`);

        particle.appendChild(point);
        effectRef.current.appendChild(particle);

        // Remove the particle after animation
        setTimeout(() => {
          if (effectRef.current && effectRef.current.contains(particle)) {
            effectRef.current.removeChild(particle);
          }
        }, 1000);
      }

      // Remove the active class from effect after pill animation
      setTimeout(() => {
        if (effectRef.current) effectRef.current.classList.remove('active');
      }, 300);
    }
  };

  return (
    <div className="gooey-nav-container">
      <div className="nav-logo">
       <p>Coworking</p>
      </div>
      <nav>
        <ul>
          <li className={activeItem === 'inicio' ? 'active' : ''} onClick={(e) => handleClick(e, 'inicio')}>
            <a>Início</a>
          </li>
          <li className={activeItem === 'sobre' ? 'active' : ''} onClick={(e) => handleClick(e, 'sobre')}>
            <a>Sobre</a>
          </li>
          <li className={activeItem === 'salas' ? 'active' : ''} onClick={(e) => handleClick(e, 'salas')}>
            <a>Salas</a>
          </li>
          <li className={activeItem === 'agendar' ? 'active' : ''} onClick={(e) => handleClick(e, 'agendar')}>
            <a>Agendar uma Sala</a>
          </li>
        </ul>
        <div ref={effectRef} className="effect filter"></div>
      </nav>
    </div>
  );
}
