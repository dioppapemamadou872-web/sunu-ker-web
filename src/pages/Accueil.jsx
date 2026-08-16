import { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLogements } from '../context/LogementsContext';
import SearchBar from '../components/SearchBar';
import BentoSection from '../components/BentoSection';
import QuartiersPopulaires from '../components/QuartiersPopulaires';
import ScrollReveal from '../components/ScrollReveal';

function Accueil() {
  const { rafraichir } = useLogements();

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  return (
    <div>
      {/* SECTION HERO */}
      <section className="hero">
        <div className="hero-shapes" aria-hidden="true">
          <span className="hero-shape hero-shape-1"></span>
          <span className="hero-shape hero-shape-2"></span>
          <span className="hero-shape hero-shape-3"></span>
        </div>

        <div className="hero-content">
          <ScrollReveal animation="slide-up" delay={0}>
            <div className="hero-reputation-badge">
              <ShieldCheck size={15} style={{ color: 'var(--color-primary)' }} />
              <span>Plateforme de logements vérifiés à Dakar</span>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="slide-up" delay={150}>
            <h1>Trouvez votre <span className="text-primary">logement idéal</span><br />en toute confiance.</h1>
          </ScrollReveal>

          <ScrollReveal animation="slide-up" delay={250}>
            <p>Des annonces vérifiées, partout à Dakar.</p>
          </ScrollReveal>

          <ScrollReveal animation="zoom-in" delay={350}>
            <SearchBar />
          </ScrollReveal>
        </div>
      </section>

      {/* BENTO GRID */}
      <ScrollReveal animation="slide-up" delay={100}>
        <BentoSection />
      </ScrollReveal>

      {/* QUARTIERS POPULAIRES */}
      <ScrollReveal animation="slide-up" delay={100}>
        <QuartiersPopulaires />
      </ScrollReveal>
    </div>
  );
}

export default Accueil;