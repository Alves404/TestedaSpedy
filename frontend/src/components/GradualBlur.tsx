import React from 'react';
import '../styles/GradualBlur.css';

export interface GradualBlurProps {
  direction?: 'top' | 'bottom' | 'left' | 'right';
  intensity?: number;
  className?: string;
  fixed?: boolean;
}

export default function GradualBlur({
  direction = 'bottom',
  intensity = 5, // max blur in px
  className = '',
  fixed = false
}: GradualBlurProps) {
  // Cria 5 camadas de desfoque para um gradiente suave
  const layers = 5;
  const divs = [];

  for (let i = 0; i < layers; i++) {
    const fraction = (i + 1) / layers;
    const blurAmount = intensity * fraction;
    
    // Máscara gradiente para a camada atual
    let maskGradient = '';
    if (direction === 'bottom') {
      maskGradient = `linear-gradient(to bottom, transparent ${i * 20}%, black ${(i + 1) * 20}%)`;
    } else if (direction === 'top') {
      maskGradient = `linear-gradient(to top, transparent ${i * 20}%, black ${(i + 1) * 20}%)`;
    } else if (direction === 'right') {
      maskGradient = `linear-gradient(to right, transparent ${i * 20}%, black ${(i + 1) * 20}%)`;
    } else if (direction === 'left') {
      maskGradient = `linear-gradient(to left, transparent ${i * 20}%, black ${(i + 1) * 20}%)`;
    }

    divs.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: `blur(${blurAmount}px)`,
          WebkitBackdropFilter: `blur(${blurAmount}px)`,
          maskImage: maskGradient,
          WebkitMaskImage: maskGradient,
          pointerEvents: 'none'
        }}
      />
    );
  }

  return (
    <div 
      className={`gradual-blur ${fixed ? 'gradual-blur-fixed' : ''} ${className}`}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    >
      <div className="gradual-blur-inner">
        {divs}
      </div>
    </div>
  );
}
