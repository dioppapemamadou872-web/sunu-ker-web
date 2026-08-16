import { useEffect, useRef, useState } from 'react';

/**
 * Hook d'apparition au défilement utilisant IntersectionObserver.
 * @param {Object} options
 * @param {number} [options.threshold=0.1] - Pourcentage de visibilité requis
 * @param {boolean} [options.once=true] - Déclencher l'animation une seule fois
 * @returns {[React.RefObject, boolean]}
 */
export function useScrollReveal({ threshold = 0.1, once = true } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Si le navigateur ne supporte pas IntersectionObserver, afficher directement
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, once]);

  return [ref, isVisible];
}
