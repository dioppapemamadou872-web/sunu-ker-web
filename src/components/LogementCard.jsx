import { useNavigate } from 'react-router-dom';
import { MapPin, BadgeCheck, Heart, Calendar } from 'lucide-react';
import { API_BASE } from '../config';
import { useFavoris } from '../context/FavorisContext';
import { estNouveau } from '../utils';
import logoIcon from '../assets/logo-icon.png';

function formaterDateCourte(dateISO) {
  if (!dateISO) return null;
  const date = new Date(dateISO);
  const maintenant = new Date();
  const diffJours = Math.floor((maintenant - date) / (1000 * 60 * 60 * 24));

  if (diffJours === 0) return "Aujourd'hui";
  if (diffJours === 1) return 'Hier';
  if (diffJours < 7) return `Il y a ${diffJours} jours`;

  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function LogementCoverPlaceholder({ type, secteur }) {
  return (
    <div className="logement-placeholder-cover">
      <img src={logoIcon} alt="DëkuWaay Logo" className="placeholder-logo" />
      <span className="placeholder-tag">{type || 'Logement'} · {secteur || 'Dakar'}</span>
      <span className="placeholder-subtext">DëkuWaay Immobilier</span>
    </div>
  );
}

function LogementCard({ id, titre, prix, type, secteur, statut, photos, disponibilite, datePublication, chambres, salons, sallesDeBain }) {
  const { estFavori, basculerFavori, estConnecte } = useFavoris();
  const navigate = useNavigate();
  const favori = estFavori(id);
  const nouveau = estNouveau(datePublication);
  const texteDate = formaterDateCourte(datePublication);

  const aVraiPhoto = photos && photos.length > 0;
  const image = aVraiPhoto ? `${API_BASE}${photos[0]}` : null;
  const estLoue = disponibilite === 'loue';

  async function handleFavoriClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!estConnecte) {
      navigate('/connexion');
      return;
    }

    await basculerFavori(id);
  }

  const descSpecs = [];
  if (chambres > 0) descSpecs.push(`${chambres} Ch`);
  if (salons > 0) descSpecs.push(`${salons} Sal`);
  if (sallesDeBain > 0) descSpecs.push(`${sallesDeBain} SDB`);

  return (
    <div className="logement-card-v2" style={estLoue ? { opacity: 0.75 } : undefined}>
      <div
        className="logement-image"
        style={aVraiPhoto ? { backgroundImage: `url(${image})` } : undefined}
      >
        {!aVraiPhoto && <LogementCoverPlaceholder type={type} secteur={secteur} />}
        
        {/* TOP BADGES BAR WITH NO OVERLAPS */}
        <div className="card-top-badges-bar">
          <div className="card-top-badges-left">
            <span className={`badge ${estLoue ? 'badge-loue' : 'badge-available'}`}>
              {estLoue ? 'Loué' : 'Disponible'}
            </span>
            {statut === 'validee' && (
              <span className="badge badge-verified">
                <BadgeCheck size={14} /> Vérifié
              </span>
            )}
            {nouveau && <span className="badge badge-nouveau">Nouveau</span>}
          </div>

          <div className="card-top-badges-right">
            <button className="favori-btn" onClick={handleFavoriClick} aria-label="Ajouter aux favoris">
              <Heart size={15} fill={favori ? '#EF4444' : 'none'} color={favori ? '#EF4444' : '#666'} />
            </button>
          </div>
        </div>
      </div>

      <div className="logement-body">
        <p className="logement-prix">{prix.toLocaleString()} FCFA <span>/ mois</span></p>
        <h3>{titre}</h3>
        <p className="logement-meta">
          <MapPin size={14} /> {secteur} · {type} {descSpecs.length > 0 ? `(${descSpecs.join(' · ')})` : ''}
        </p>
        {texteDate && (
          <p className="logement-meta" style={{ marginTop: '4px' }}>
            <Calendar size={13} /> {texteDate}
          </p>
        )}
      </div>
    </div>
  );
}

export default LogementCard;