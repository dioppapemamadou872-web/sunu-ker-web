import { ShieldCheck, Clock, MapPinned, Users, Search, FileEdit, CheckCircle2, Handshake, BookOpen, Target, Telescope, Sparkles, Workflow } from 'lucide-react';

const avantages = [
  { icon: ShieldCheck, titre: 'Annonces vérifiées', texte: 'Chaque logement est contrôlé manuellement avant publication.' },
  { icon: Clock, titre: 'Réponse rapide', texte: 'Notre équipe traite les demandes de contact rapidement.' },
  { icon: MapPinned, titre: 'Toute la région de Dakar', texte: 'Dakar, Pikine, Guédiawaye, Rufisque et leurs quartiers.' },
  { icon: Users, titre: 'Accompagnement complet', texte: 'On vous suit de la recherche jusqu\'à la location.' },
];

const etapesChercheur = [
  { icon: Search, titre: 'Cherchez', texte: 'Filtrez par quartier, type de logement et budget.' },
  { icon: FileEdit, titre: 'Contactez', texte: 'Cliquez "Je suis intéressé" et laissez vos coordonnées.' },
  { icon: Handshake, titre: 'Rencontrez', texte: 'Notre équipe vous met en relation avec le propriétaire.' },
];

const etapesProprietaire = [
  { icon: FileEdit, titre: 'Publiez', texte: 'Renseignez votre logement et vos photos.' },
  { icon: CheckCircle2, titre: 'Validation', texte: 'Notre équipe vérifie votre annonce avant publication.' },
  { icon: Handshake, titre: 'Louez', texte: 'Nous vous mettons en relation avec les locataires intéressés.' },
];

function APropos() {
  return (
    <div>
      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><BookOpen size={20} style={{ color: 'var(--color-primary)' }} />Notre histoire</h2>
        <p>
          SunuKeur est né d'un constat simple : à Dakar, trouver un logement fiable prend du temps et
          repose souvent sur le bouche-à-oreille. Entre les annonces obsolètes, les doublons et le manque
          de transparence, chercher un logement devenait une source de stress plutôt qu'une étape excitante
          d'un nouveau chapitre de vie. Nous avons voulu construire une plateforme où chaque annonce est
          vérifiée par une vraie personne, pas seulement publiée et oubliée.
        </p>

        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Target size={20} style={{ color: 'var(--color-primary)' }} />Notre mission</h2>
        <p>
          Faciliter la mise en relation entre propriétaires et locataires à Dakar, en apportant fiabilité
          et transparence à chaque étape — de la publication d'une annonce jusqu'à la conclusion d'une location.
        </p>

        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Telescope size={20} style={{ color: 'var(--color-primary)' }} />Notre vision</h2>
        <p>
          Devenir la plateforme de référence pour le logement au Sénégal, reconnue pour la qualité de sa
          vérification et la confiance qu'elle inspire, aussi bien aux propriétaires qu'aux locataires.
        </p>
      </div>

      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Sparkles size={20} style={{ color: 'var(--color-primary)' }} />Pourquoi SunuKeur</h2>
        <div className="avantages-grid-large">
          {avantages.map(({ icon: Icon, titre, texte }) => (
            <div key={titre} className="avantage-card-large">
              <div className="avantage-icon-large"><Icon size={22} /></div>
              <h3>{titre}</h3>
              <p>{texte}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Workflow size={20} style={{ color: 'var(--color-primary)' }} />Comment ça fonctionne</h2>

        <h3 style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
          Pour un chercheur de logement
        </h3>
        <div className="etapes-fonctionnement">
          {etapesChercheur.map(({ icon: Icon, titre, texte }, i) => (
            <div key={titre} className="etape-fonctionnement">
              <div className="etape-fonctionnement-numero">{i + 1}</div>
              <div className="etape-fonctionnement-icon"><Icon size={18} /></div>
              <h4>{titre}</h4>
              <p>{texte}</p>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em', marginTop: '28px' }}>
          Pour un propriétaire
        </h3>
        <div className="etapes-fonctionnement">
          {etapesProprietaire.map(({ icon: Icon, titre, texte }, i) => (
            <div key={titre} className="etape-fonctionnement">
              <div className="etape-fonctionnement-numero">{i + 1}</div>
              <div className="etape-fonctionnement-icon"><Icon size={18} /></div>
              <h4>{titre}</h4>
              <p>{texte}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default APropos;