import React, { useRef, useEffect, useState } from 'react';
import '../styles/SplitText.css';

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number; // Delay em milissegundos entre cada letra
  animationDuration?: number; // Duração da animação em milissegundos
  tag?: React.ElementType;
}

export default function SplitText({
  text,
  className = '',
  delay = 50,
  animationDuration = 1000,
  tag = 'h2',
}: SplitTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Substitui o ScrollTrigger do GSAP usando a API nativa do navegador
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconecta após animar uma vez (once: true)
          if (containerRef.current) observer.unobserve(containerRef.current);
        }
      },
      { threshold: 0.1 } // Equivalente a top 90%
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const characters = text.split('');
  const Tag = tag;

  return (
    <Tag ref={containerRef} className={`split-text-container ${className}`}>
      {characters.map((char, index) => (
        <span
          key={index}
          className={`split-char ${isVisible ? 'visible' : ''}`}
          style={{
            animationDelay: `${index * delay}ms`,
            animationDuration: `${animationDuration}ms`,
            whiteSpace: char === ' ' ? 'pre' : 'normal'
          }}
        >
          {char}
        </span>
      ))}
    </Tag>
  );
}
