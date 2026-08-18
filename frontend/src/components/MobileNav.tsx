import React, { useState, useEffect } from 'react';
import { Home, Info, LayoutGrid, CalendarRange } from 'lucide-react';
import '../styles/MobileNav.css';

export default function MobileNav() {
  const [activeItem, setActiveItem] = useState<string>('inicio');

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
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (targetId: string) => {
    setActiveItem(targetId);
    if (targetId !== 'inicio') {
      const section = document.getElementById(targetId);
      if (section) {
        // Offset for the bottom nav
        const y = section.getBoundingClientRect().top + window.scrollY - 20;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="mobile-nav-container">
      <div 
        className={`mobile-nav-item ${activeItem === 'inicio' ? 'active' : ''}`} 
        onClick={() => handleClick('inicio')}
      >
        <Home size={22} className="nav-icon" />
        Início
      </div>
      <div 
        className={`mobile-nav-item ${activeItem === 'sobre' ? 'active' : ''}`} 
        onClick={() => handleClick('sobre')}
      >
        <Info size={22} className="nav-icon" />
        Sobre
      </div>
      <div 
        className={`mobile-nav-item ${activeItem === 'salas' ? 'active' : ''}`} 
        onClick={() => handleClick('salas')}
      >
        <LayoutGrid size={22} className="nav-icon" />
        Salas
      </div>
      <div 
        className={`mobile-nav-item ${activeItem === 'agendar' ? 'active' : ''}`} 
        onClick={() => handleClick('agendar')}
      >
        <CalendarRange size={22} className="nav-icon" />
        Agendar
      </div>
    </div>
  );
}
