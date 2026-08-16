import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * Composant conteneur pour animer l'apparition d'éléments au scroll.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.animation='slide-up'] - 'slide-up' | 'fade-in' | 'zoom-in' | 'slide-left' | 'slide-right'
 * @param {number} [props.delay=0] - Délai d'animation en millisecondes
 * @param {number} [props.duration=600] - Durée de l'animation en millisecondes
 * @param {string} [props.className='']
 * @param {Object} [props.style={}]
 */
export default function ScrollReveal({
  children,
  animation = 'slide-up',
  delay = 0,
  duration = 600,
  className = '',
  style = {},
  ...rest
}) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1, once: true });

  const combinedStyle = {
    ...style,
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <div
      ref={ref}
      className={`reveal reveal-${animation} ${isVisible ? 'reveal-visible' : ''} ${className}`.trim()}
      style={combinedStyle}
      {...rest}
    >
      {children}
    </div>
  );
}
