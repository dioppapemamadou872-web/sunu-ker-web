import { Link } from 'react-router-dom';
import { MapPin, Building2 } from 'lucide-react';
import { useLogements } from '../context/LogementsContext';

function QuartiersPopulaires() {
  const { logements } = useLogements();

  const comptage = logements
    .filter((l) => l.statut === 'validee')
    .reduce((acc, l) => {
      acc[l.secteur] = (acc[l.secteur] || 0) + 1;
      return acc;
    }, {});

  const topQuartiers = Object.entries(comptage)
    .map(([secteur, total]) => ({ secteur, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  if (topQuartiers.length === 0) return null;

  return (
    <section className="quartiers-section">
      <h2 className="section-title">Quartiers populaires</h2>
      <p className="section-subtitle">Découvrez les secteurs avec le plus de logements disponibles</p>

      <div className="quartiers-grid">
        {topQuartiers.map(({ secteur, total }) => (
          <Link key={secteur} to={`/logements?secteur=${encodeURIComponent(secteur)}`} className="quartier-card">
            <div className="quartier-icon"><MapPin size={20} /></div>
            <div>
              <h3>{secteur}</h3>
              <p><Building2 size={13} /> {total} logement{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default QuartiersPopulaires;