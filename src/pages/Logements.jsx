import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLogements } from '../context/LogementsContext';
import SearchBar from '../components/SearchBar';
import LogementCard from '../components/LogementCard';
import { API_URL, API_BASE } from '../config';

function Logements() {
  const [searchParams] = useSearchParams();
  const { logements, chargement, rafraichir } = useLogements();

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  const secteur = searchParams.get('secteur');
  const type = searchParams.get('type');
  const budgetMax = searchParams.get('budgetMax');

  const resultats = logements.filter((l) => {
    if (l.statut !== 'validee') return false;
    if (secteur && l.secteur !== secteur) return false;
    if (type && l.type !== type) return false;
    if (budgetMax && l.prix > Number(budgetMax)) return false;
    return true;
  });

  return (
    <div>
      <div className="filter-bar-compact">
        <SearchBar />
      </div>
      <div style={{ background: 'red', color: 'white', padding: '12px', margin: '12px', fontSize: '12px', wordBreak: 'break-all' }}>
        DEBUG — API_URL: {API_URL} | API_BASE: {API_BASE}
      </div>

      <div className="logement-grid">
        {chargement ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton-card" />)
        ) : resultats.length > 0 ? (
          resultats.map((l) => (
            <Link key={l.id} to={`/logements/${l.id}`} style={{ textDecoration: 'none' }}>
              <LogementCard
                id={l.id}
                titre={l.titre}
                prix={l.prix}
                type={l.type}
                secteur={l.secteur}
                statut={l.statut}
                photos={l.photos}
                disponibilite={l.disponibilite}
                datePublication={l.datePublication}
              />
            </Link>
          ))
        ) : (
          <p>Aucun logement ne correspond à votre recherche pour l'instant.</p>
        )}
      </div>
    </div>
  );
}

export default Logements;