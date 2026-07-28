import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Building2, Home, DoorOpen, ShieldCheck, Clock, MapPinned, Users, TrendingUp } from 'lucide-react';
import { API_BASE } from '../config';

const categories = [
  { label: 'Chambres', type: 'Chambre', icon: Bed },
  { label: 'Studios', type: 'Studio', icon: DoorOpen },
  { label: 'Appartements', type: 'Appartement', icon: Building2 },
  { label: 'Maisons', type: 'Maison', icon: Home },
];

const avantages = [
  { icon: ShieldCheck, titre: 'Annonces vérifiées', texte: 'Chaque logement est contrôlé avant publication.' },
  { icon: Clock, titre: 'Réponse rapide', texte: 'Notre équipe traite les demandes sous 24h.' },
  { icon: MapPinned, titre: 'Toute la région de Dakar', texte: 'Dakar, Pikine, Guédiawaye, Rufisque.' },
  { icon: Users, titre: 'Accompagnement complet', texte: 'On vous suit jusqu\'à la location.' },
];

function BentoSection() {
  const [topSecteurs, setTopSecteurs] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    async function charger() {
      const res = await fetch(`${API_BASE}/api/stats/secteurs`);
      setTopSecteurs(await res.json());
      setChargement(false);
    }
    charger();
  }, []);

  return (
    <div className="bento-grid">
      {categories.map(({ label, type, icon: Icon }) => (
        <Link key={type} to={`/logements?type=${type}`} className="bento-card bento-category">
          <Icon size={22} />
          <span>{label}</span>
        </Link>
      ))}

      <div className="bento-card bento-stats">
        <h3><TrendingUp size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />Secteurs les plus demandés</h3>
        {chargement ? (
          <p className="text-muted">Chargement...</p>
        ) : topSecteurs.length === 0 ? (
          <p className="text-muted">Pas encore assez de données pour établir un classement.</p>
        ) : (
          <div className="stats-list">
            {topSecteurs.map(({ secteur, total }) => (
              <div key={secteur} className="stats-row">
                <span>{secteur}</span>
                <span className="stats-count">{total} demande{total > 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bento-card bento-avantages">
        <h3>Pourquoi SunuKeur</h3>
        <div className="avantages-list">
          {avantages.map(({ icon: Icon, titre, texte }) => (
            <div key={titre} className="avantage-item">
              <Icon size={18} />
              <div>
                <strong>{titre}</strong>
                <p>{texte}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BentoSection;