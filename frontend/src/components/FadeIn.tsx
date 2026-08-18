import React, { useRef, useEffect, useState } from 'react';

export default function FadeIn({ 
  children, 
  delay = 0, 
  className = '' 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (ref.current) observer.unobserve(ref.current);
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={className} 
      style={{ 
        opacity: isVisible ? 1 : 0, 
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)', 
        transition: `opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms, transform 0.8s cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
}
