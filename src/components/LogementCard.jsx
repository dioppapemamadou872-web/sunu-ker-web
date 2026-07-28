import { useNavigate } from 'react-router-dom';
import { MapPin, BadgeCheck, Heart } from 'lucide-react';
import { API_BASE } from '../config';
import { useFavoris } from '../context/FavorisContext';
import { estNouveau } from '../utils';

function LogementCard({ id, titre, prix, type, secteur, statut, photos, disponibilite, datePublication }) {
  const { estFavori, basculerFavori, estConnecte } = useFavoris();
  const navigate = useNavigate();
  const favori = estFavori(id);
  const nouveau = estNouveau(datePublication);

  const image = photos && photos.length > 0
    ? `${API_BASE}${photos[0]}`
    : `https://picsum.photos/seed/${id}/500/300`;

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

  return (
    <div className="logement-card-v2" style={estLoue ? { opacity: 0.75 } : undefined}>
      <div className="logement-image" style={{ backgroundImage: `url(${image})` }}>
        <span className={`badge ${estLoue ? 'badge-loue' : 'badge-available'}`}>
          {estLoue ? 'Loué' : 'Disponible'}
        </span>
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px' }}>
          {statut === 'validee' && (
            <span className="badge badge-verified" style={{ position: 'static' }}>
              <BadgeCheck size={14} /> Vérifié
            </span>
          )}
          <button className="favori-btn" onClick={handleFavoriClick} aria-label="Ajouter aux favoris">
            <Heart size={15} fill={favori ? '#EF4444' : 'none'} color={favori ? '#EF4444' : '#666'} />
          </button>
        </div>
        {nouveau && <span className="badge badge-nouveau">Nouveau</span>}
      </div>
      <div className="logement-body">
        <p className="logement-prix">{prix.toLocaleString()} FCFA <span>/ mois</span></p>
        <h3>{titre}</h3>
        <p className="logement-meta"><MapPin size={14} /> {secteur} · {type}</p>
      </div>
    </div>
  );
}

export default LogementCard;