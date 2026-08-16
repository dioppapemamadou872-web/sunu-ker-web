import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Building2, Home, DoorOpen, ShieldCheck, Clock, MapPinned, Users, TrendingUp } from 'lucide-react';
import { API_BASE } from '../config';
import AnimatedCounter from './AnimatedCounter';
import ScrollReveal from './ScrollReveal';

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
      try {
        const res = await fetch(`${API_BASE}/api/stats/secteurs`);
        if (res.ok) {
          const data = await res.json();
          setTopSecteurs(Array.isArray(data) ? data : []);
        }
      } catch {
        // En cas d'erreur réseau, on garde une liste vide silencieusement
        setTopSecteurs([]);
      } finally {
        setChargement(false);
      }
    }
    charger();
  }, []);

  return (
    <div className="bento-grid">
      {categories.map(({ label, type, icon: Icon }, index) => (
        <ScrollReveal key={type} animation="zoom-in" delay={index * 80}>
          <Link to={`/logements?type=${type}`} className="bento-card bento-category">
            <Icon size={22} />
            <span>{label}</span>
          </Link>
        </ScrollReveal>
      ))}

      <ScrollReveal animation="slide-up" delay={320} className="bento-card bento-stats">
        <h3><TrendingUp size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />Secteurs les plus demandés</h3>
        {chargement ? (
          <p className="text-muted" style={{ padding: '12px 0', fontSize: '0.85rem' }}>Chargement des statistiques...</p>
        ) : topSecteurs.length === 0 ? (
          <div className="stats-list-fallback" style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
            <p className="text-muted" style={{ fontSize: '0.82rem', margin: 0 }}>Secteurs populaires du moment :</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['Plateau', 'Almadies', 'Ngor', 'Mermoz', 'Parcelles Assainies', 'Point E'].map((sec) => (
                <span key={sec} style={{
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                  color: 'var(--color-primary)',
                  fontWeight: 600
                }}>
                  📍 {sec}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="stats-list">
            {topSecteurs.map(({ secteur, total }) => (
              <div key={secteur} className="stats-row">
                <span>{secteur}</span>
                <span className="stats-count">
                  <AnimatedCounter endValue={total} duration={1200} /> demande{total > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </ScrollReveal>

      <ScrollReveal animation="slide-up" delay={400} className="bento-card bento-avantages">
        <h3>Pourquoi DëkuWaay</h3>
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
      </ScrollReveal>
    </div>
  );
}

export default BentoSection;