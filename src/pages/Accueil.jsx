import SearchBar from '../components/SearchBar';
import BentoSection from '../components/BentoSection';
import QuartiersPopulaires from '../components/QuartiersPopulaires';

function Accueil() {
  return (
    <div>
      <section className="hero">
        <div className="hero-shapes" aria-hidden="true">
          <span className="hero-shape hero-shape-1"></span>
          <span className="hero-shape hero-shape-2"></span>
          <span className="hero-shape hero-shape-3"></span>
        </div>

        <div className="hero-content">
          <h1>Trouvez votre <span className="text-primary">logement idéal</span><br />en toute confiance.</h1>
          <p>Des annonces vérifiées, partout à Dakar.</p>
          <SearchBar />
        </div>
      </section>

      <BentoSection />
      <QuartiersPopulaires />
    </div>
  );
}

export default Accueil;