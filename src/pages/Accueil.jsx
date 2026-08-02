import { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLogements } from '../context/LogementsContext';
import SearchBar from '../components/SearchBar';
import BentoSection from '../components/BentoSection';
import QuartiersPopulaires from '../components/QuartiersPopulaires';

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
          <div className="hero-reputation-badge">
            <ShieldCheck size={15} style={{ color: 'var(--color-primary)' }} />
            <span>Plateforme de logements vérifiés à Dakar</span>
          </div>

          <h1>Trouvez votre <span className="text-primary">logement idéal</span><br />en toute confiance.</h1>
          <p>Des annonces vérifiées, partout à Dakar.</p>
          <SearchBar />
        </div>
      </section>

      {/* BENTO GRID */}
      <BentoSection />

      {/* QUARTIERS POPULAIRES */}
      <QuartiersPopulaires />
    </div>
  );
}

export default Accueil;