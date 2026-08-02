import { ShieldCheck, Clock, MapPinned, Users, Search, FileEdit, CheckCircle2, Handshake, BookOpen, Target, Telescope, Sparkles, Workflow, Info } from 'lucide-react';

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
    <div className="apropos-page-modern">
      {/* HEADER BANNER */}
      <div className="apropos-page-header text-center">
        <div className="apropos-badge-top">
          <Info size={15} /> À propos de SunuKeur
        </div>
        <h1>Fiabilité & Transparence pour votre logement à Dakar</h1>
        <p>Découvrez notre histoire, notre mission et notre engagement auprès des chercheurs de logements et des propriétaires au Sénégal.</p>
      </div>

      {/* 3 CARDS HISTOIRE / MISSION / VISION */}
      <div className="apropos-pillars-grid">
        <div className="card pillar-item-card">
          <div className="pillar-icon-box primary">
            <BookOpen size={24} />
          </div>
          <h3>Notre histoire</h3>
          <p>
            SunuKeur est né d'un constat simple : à Dakar, trouver un logement fiable prend du temps et
            repose souvent sur le bouche-à-oreille. Entre les annonces obsolètes, les doublons et le manque
            de transparence, chercher un logement devenait une source de stress plutôt qu'une étape excitante
            d'un nouveau chapitre de vie. Nous avons voulu construire une plateforme où chaque annonce est
            vérifiée par une vraie personne, pas seulement publiée et oubliée.
          </p>
        </div>

        <div className="card pillar-item-card">
          <div className="pillar-icon-box success">
            <Target size={24} />
          </div>
          <h3>Notre mission</h3>
          <p>
            Faciliter la mise en relation entre propriétaires et locataires à Dakar, en apportant fiabilité
            et transparence à chaque étape — de la publication d'une annonce jusqu'à la conclusion d'une location.
          </p>
        </div>

        <div className="card pillar-item-card">
          <div className="pillar-icon-box warning">
            <Telescope size={24} />
          </div>
          <h3>Notre vision</h3>
          <p>
            Devenir la plateforme de référence pour le logement au Sénégal, reconnue pour la qualité de sa
            vérification et la confiance qu'elle inspire, aussi bien aux propriétaires qu'aux locataires.
          </p>
        </div>
      </div>

      {/* POURQUOI SUNUKEUR */}
      <div className="card apropos-section-card">
        <div className="section-title-header">
          <h3>
            <Sparkles size={20} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)' }} />
            Pourquoi SunuKeur
          </h3>
          <p className="card-subtext">Quatre raisons qui font la différence pour votre recherche immobilière.</p>
        </div>

        <div className="avantages-grid-large">
          {avantages.map(({ icon: Icon, titre, texte }) => (
            <div key={titre} className="avantage-card-large">
              <div className="avantage-icon-large">
                <Icon size={22} />
              </div>
              <h4>{titre}</h4>
              <p>{texte}</p>
            </div>
          ))}
        </div>
      </div>

      {/* COMMENT ÇA FONCTIONNE */}
      <div className="card apropos-section-card">
        <div className="section-title-header">
          <h3>
            <Workflow size={20} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)' }} />
            Comment ça fonctionne
          </h3>
          <p className="card-subtext">Un processus simple et guidé pour locataires et bailleurs.</p>
        </div>

        <div className="process-group">
          <h4 className="process-subhead">Pour un chercheur de logement</h4>
          <div className="etapes-fonctionnement">
            {etapesChercheur.map(({ icon: Icon, titre, texte }, i) => (
              <div key={titre} className="etape-fonctionnement">
                <div className="etape-fonctionnement-numero">{i + 1}</div>
                <div className="etape-fonctionnement-icon">
                  <Icon size={18} />
                </div>
                <h5>{titre}</h5>
                <p>{texte}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="process-group" style={{ marginTop: '32px' }}>
          <h4 className="process-subhead">Pour un propriétaire</h4>
          <div className="etapes-fonctionnement">
            {etapesProprietaire.map(({ icon: Icon, titre, texte }, i) => (
              <div key={titre} className="etape-fonctionnement">
                <div className="etape-fonctionnement-numero">{i + 1}</div>
                <div className="etape-fonctionnement-icon">
                  <Icon size={18} />
                </div>
                <h5>{titre}</h5>
                <p>{texte}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default APropos;