import { Link } from 'react-router-dom';
import { MapPin, Building2 } from 'lucide-react';
import { useLogements } from '../context/LogementsContext';
import ScrollReveal from './ScrollReveal';

const quartiersParDefaut = [
  'Plateau',
  'Patte d\'Oie',
  'Parcelles Assainies',
  'Point E',
  'Golf Sud',
  'Fass',
  'Grand Yoff',
  'Grand Dakar'
];

function QuartiersPopulaires() {
  const { logements } = useLogements();

  const comptage = (logements || [])
    .filter((l) => l.statut === 'validee')
    .reduce((acc, l) => {
      acc[l.secteur] = (acc[l.secteur] || 0) + 1;
      return acc;
    }, {});

  const listeAffichee = Object.entries(comptage)
    .map(([secteur, total]) => ({ secteur, total }))
    .sort((a, b) => b.total - a.total);

  quartiersParDefaut.forEach((secDefaut) => {
    if (listeAffichee.length < 8 && !listeAffichee.some((q) => q.secteur === secDefaut)) {
      listeAffichee.push({ secteur: secDefaut, total: comptage[secDefaut] || 1 });
    }
  });

  const topQuartiers = listeAffichee.slice(0, 8);

  return (
    <section className="quartiers-section">
      <ScrollReveal animation="slide-up" delay={0}>
        <h2 className="section-title">Quartiers populaires</h2>
        <p className="section-subtitle">Découvrez les secteurs avec le plus de logements disponibles</p>
      </ScrollReveal>

      <div className="quartiers-grid">
        {topQuartiers.map(({ secteur, total }, index) => (
          <ScrollReveal key={secteur} animation="zoom-in" delay={index * 60}>
            <Link to={`/logements?secteur=${encodeURIComponent(secteur)}`} className="quartier-card">
              <div className="quartier-icon"><MapPin size={20} /></div>
              <div className="quartier-info">
                <h3>{secteur}</h3>
                <p>
                  <Building2 size={13} style={{ flexShrink: 0 }} />
                  <span>{total} logement{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}</span>
                </p>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export default QuartiersPopulaires;