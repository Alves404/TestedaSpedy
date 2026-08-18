import { useEffect, useRef } from 'react';
import '../styles/HeroPortal.css';

/**
 * HeroPortal: Efeito de "caixa que expande" ao rolar.
 * 
 * Estratégia: Em vez de usar position:sticky dentro de clip-path
 * (o que quebra position:fixed filhos), usamos um wrapper que aplica
 * clip-path no próprio elemento, enquanto os filhos usam position:absolute
 * normalmente. O scroll é monitorado via window scroll diretamente.
 */
export default function HeroPortal({ children }: { children: React.ReactNode }) {
  const portalRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const portal = portalRef.current;
    if (!portal) return;

    // Lógica de suavização
    let target = 0;
    let current = 0;
    let running = false;

    // Reduzido para 0.8 para a expansão ser mais rápida e as seções subirem mais cedo
    const SCROLL_DISTANCE = window.innerHeight * 0.8;

    const applyClip = (p: number) => {
      // Interpolação smoothstep para curva natural
      const t = p < 0 ? 0 : p > 1 ? 1 : p;
      const e = t * t * (3 - 2 * t);

      // Inset: de bordas grandes (caixa pequena) até 0% (tela cheia)
      const startInsetX = 15; // % horizontal
      const startInsetY = 10; // % vertical
      const startRadius = 32; // px

      const insetX = startInsetX * (1 - e);
      const insetY = startInsetY * (1 - e);
      const radius = startRadius * (1 - e);

      portal.style.clipPath = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;
    };

    const tick = () => {
      const k = 1 - Math.exp(-1 / (60 * 0.12)); // smoothing
      current += (target - current) * k;

      if (Math.abs(target - current) < 0.001) {
        current = target;
        running = false;
      }

      applyClip(current);
      if (running) rafRef.current = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = Math.min(1, window.scrollY / SCROLL_DISTANCE);
      progressRef.current = target;

      // Quando expandiu por completo, ocultar o CONTEÚDO (texto/botoes) para não bloquear as sections
      if (portal) {
        const content = portal.querySelector('.hero-content') as HTMLElement;
        if (content) {
          // Fade out content based on scroll progress (fades out completely when half-way expanded)
          const opacity = Math.max(0, 1 - target * 2);
          content.style.opacity = opacity.toString();
          content.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
        }
        if (window.scrollY >= SCROLL_DISTANCE) {
          portal.style.pointerEvents = 'none';
        } else {
          portal.style.pointerEvents = 'auto';
        }
      }

      if (!running) {
        running = true;
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    // Inicializa com progresso 0
    applyClip(0);

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={portalRef} className="hero-portal">
      {children}
    </div>
  );
}
