import SearchBar from '../components/SearchBar';
import BentoSection from '../components/BentoSection';

function Accueil() {
  return (
    <div>
      <section className="hero">
        <h1>Trouvez votre <span className="text-primary">logement idéal</span><br />en toute confiance.</h1>
        <p>Des annonces vérifiées, partout à Dakar.</p>
        <SearchBar />
      </section>

      <BentoSection />
    </div>
  );
}

export default Accueil;