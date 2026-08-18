import React, { useState } from 'react';
import '../styles/MobileNav.css';

export default function MobileNav() {
  const [activeItem, setActiveItem] = useState<string>('inicio');

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
        <span>🏠</span>
        Início
      </div>
      <div 
        className={`mobile-nav-item ${activeItem === 'sobre' ? 'active' : ''}`} 
        onClick={() => handleClick('sobre')}
      >
        <span>🏢</span>
        Sobre
      </div>
      <div 
        className={`mobile-nav-item ${activeItem === 'salas' ? 'active' : ''}`} 
        onClick={() => handleClick('salas')}
      >
        <span>🚪</span>
        Salas
      </div>
      <div 
        className={`mobile-nav-item ${activeItem === 'agendar' ? 'active' : ''}`} 
        onClick={() => handleClick('agendar')}
      >
        <span>📅</span>
        Agendar
      </div>
    </div>
  );
}
