import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartOff } from 'lucide-react';
import { useLogements } from '../context/LogementsContext';
import { useFavoris } from '../context/FavorisContext';
import LogementCard from '../components/LogementCard';

function Favoris() {
  const { logements, rafraichir } = useLogements();
  const { favoris } = useFavoris();

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  const mesLogementsFavoris = logements.filter((l) => favoris.includes(l.id));

  return (
    <div className="card">
      <h2>Mes favoris</h2>

      {mesLogementsFavoris.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--color-text-muted)' }}>
          <HeartOff size={32} style={{ marginBottom: '10px' }} />
          <p>Vous n'avez pas encore de favoris. Cliquez sur le cœur d'une annonce pour l'ajouter ici.</p>
        </div>
      ) : (
        <div className="logement-grid" style={{ padding: 0 }}>
          {mesLogementsFavoris.map((l) => (
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
          ))}
        </div>
      )}
    </div>
  );
}

export default Favoris;