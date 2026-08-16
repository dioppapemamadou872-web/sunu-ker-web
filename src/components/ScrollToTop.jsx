import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Remet le scroll de la fenêtre en haut (0, 0) à chaque changement de page.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
