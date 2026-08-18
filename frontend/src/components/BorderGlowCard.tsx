import React, { useRef, useEffect } from 'react';
import '../styles/BorderGlowCard.css';

interface BorderGlowCardProps {
  children: React.ReactNode;
  className?: string;
  theme?: 'colorful' | 'white';
  onClick?: () => void;
}

export default function BorderGlowCard({ children, className = '', theme = 'colorful', onClick }: BorderGlowCardProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const div = divRef.current;
      if (!div) return;

      const rect = div.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      
      // Ângulo em graus (offset de 90 deg para o topo ser 0)
      let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      if (angle < 0) angle += 360;

      // Cálculo de proximidade da borda
      const isInsideX = e.clientX >= rect.left && e.clientX <= rect.right;
      const isInsideY = e.clientY >= rect.top && e.clientY <= rect.bottom;
      
      let dist = 0;
      if (isInsideX && isInsideY) {
        dist = 0;
      } else if (isInsideX) {
        dist = Math.min(Math.abs(e.clientY - rect.top), Math.abs(e.clientY - rect.bottom));
      } else if (isInsideY) {
        dist = Math.min(Math.abs(e.clientX - rect.left), Math.abs(e.clientX - rect.right));
      } else {
        const dxCorner = e.clientX < rect.left ? rect.left - e.clientX : e.clientX - rect.right;
        const dyCorner = e.clientY < rect.top ? rect.top - e.clientY : e.clientY - rect.bottom;
        dist = Math.sqrt(dxCorner * dxCorner + dyCorner * dyCorner);
      }

      // Converte distância para proximidade (100 = dentro, 0 = longe)
      const maxDist = 300;
      let proximity = 100 - (dist / maxDist) * 100;
      if (proximity < 0) proximity = 0;

      div.style.setProperty('--cursor-angle', `${angle}deg`);
      div.style.setProperty('--edge-proximity', proximity.toString());
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const themeClass = theme === 'white' ? 'theme-white' : '';

  return (
    <div ref={divRef} className={`border-glow-card ${themeClass} ${className}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="edge-light"></div>
      <div className="border-glow-inner">
        {children}
      </div>
    </div>
  );
}
