import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, BedDouble, Sofa, BadgeCheck, Heart, Share2, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useLogements } from '../context/LogementsContext';
import { useFavoris } from '../context/FavorisContext';
import { API_BASE } from '../config';
import { estNouveau, formaterDatePublication } from '../utils';
import ChampTelephone from '../components/ChampTelephone';

function LogementDetail() {
  const { id } = useParams();
  const { logements, ajouterDemande, rafraichir } = useLogements();
  const { estFavori, basculerFavori, estConnecte } = useFavoris();
  const navigate = useNavigate();
  const logement = logements.find((l) => l.id === Number(id));

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  const [indexPhoto, setIndexPhoto] = useState(0);
  const [zoomOuvert, setZoomOuvert] = useState(false);

  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const [lienCopie, setLienCopie] = useState(false);

  if (!logement) {
    return <p style={{ textAlign: 'center', padding: '40px' }}>Logement introuvable.</p>;
  }

  const photos = logement.photos?.length ? logement.photos : null;

  function handleSubmit(e) {
    e.preventDefault();
    if (telephone.length !== 9) return;

    ajouterDemande({
      logementId: logement.id,
      logementTitre: logement.titre,
      nom,
      telephone,
    });
    setEnvoye(true);
  }

  async function partager() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: logement.titre, text: `Découvrez ce logement sur SunuKeur : ${logement.titre}`, url });
      } catch {
        // partage annulé
      }
    } else {
      await navigator.clipboard.writeText(url);
      setLienCopie(true);
      setTimeout(() => setLienCopie(false), 2000);
    }
  }

  function photoSuivante(e) {
    e?.stopPropagation();
    setIndexPhoto((i) => (i + 1) % photos.length);
  }

  function photoPrecedente(e) {
    e?.stopPropagation();
    setIndexPhoto((i) => (i - 1 + photos.length) % photos.length);
  }

  const estLoue = logement.disponibilite === 'loue';
  const favori = estFavori(logement.id);
  const nouveau = estNouveau(logement.datePublication);
  const imageActuelle = photos ? `${API_BASE}${photos[indexPhoto]}` : `https://picsum.photos/seed/${logement.id}/700/400`;

  return (
    <div className="detail-layout">
      <div className="detail-topbar">
        <Link to="/logements" className="detail-back-link">
          <ArrowLeft size={16} /> Retour aux logements
        </Link>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="icon-action-btn" onClick={partager} aria-label="Partager">
            <Share2 size={18} />
          </button>
          <button
            className="icon-action-btn"
            onClick={() => (estConnecte ? basculerFavori(logement.id) : navigate('/connexion'))}
            aria-label="Ajouter aux favoris"
          >
            <Heart size={18} fill={favori ? '#EF4444' : 'none'} color={favori ? '#EF4444' : 'currentColor'} />
          </button>
        </div>
      </div>

      {lienCopie && <p className="alert-success" style={{ marginBottom: '12px' }}>Lien copié dans le presse-papiers !</p>}

      <div className="detail-grid">
        {/* Colonne galerie */}
        <div>
          <div className="detail-main-image" onClick={() => photos && setZoomOuvert(true)} style={{ backgroundImage: `url(${imageActuelle})` }}>
            <span className={`badge ${estLoue ? 'badge-loue' : 'badge-available'}`}>
              {estLoue ? 'Loué' : 'Disponible'}
            </span>
            {logement.statut === 'validee' && (
              <span className="badge badge-verified"><BadgeCheck size={14} /> Vérifié</span>
            )}
            {nouveau && <span className="badge badge-nouveau">Nouveau</span>}

            {photos && photos.length > 1 && (
              <>
                <button className="gallery-nav gallery-nav-left" onClick={photoPrecedente} aria-label="Photo précédente">
                  <ChevronLeft size={20} />
                </button>
                <button className="gallery-nav gallery-nav-right" onClick={photoSuivante} aria-label="Photo suivante">
                  <ChevronRight size={20} />
                </button>
                <span className="gallery-counter">{indexPhoto + 1} / {photos.length}</span>
              </>
            )}
          </div>

          {photos && photos.length > 1 && (
            <div className="thumbnail-strip">
              {photos.map((photo, i) => (
                <button
                  key={i}
                  className={`thumbnail-item ${i === indexPhoto ? 'active' : ''}`}
                  onClick={() => setIndexPhoto(i)}
                  style={{ backgroundImage: `url(${API_BASE}${photo})` }}
                  aria-label={`Voir la photo ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Colonne infos */}
        <div className="detail-info-col">
          <div className="card" style={{ marginBottom: '16px' }}>
            <p className="logement-prix" style={{ fontSize: '1.4rem' }}>
              {logement.prix.toLocaleString()} FCFA <span>/ mois</span>
            </p>
            <h2 style={{ marginTop: '4px' }}>{logement.titre}</h2>
            <p className="logement-meta" style={{ fontSize: '0.95rem', marginBottom: '6px' }}>
              <MapPin size={16} /> {logement.secteur}
            </p>
            {logement.datePublication && (
              <p className="logement-meta" style={{ fontSize: '0.82rem', marginBottom: '16px' }}>
                <Calendar size={14} /> {formaterDatePublication(logement.datePublication)}
              </p>
            )}

            <div style={{ display: 'flex', gap: '20px', marginBottom: '18px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                <BedDouble size={18} /> {logement.chambres} chambre(s)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                <Sofa size={18} /> {logement.salons} salon(s)
              </span>
            </div>

            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{logement.description}</p>

            {logement.equipements?.length > 0 && (
              <p><strong>Équipements :</strong> {logement.equipements.join(', ')}</p>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '20px 0' }} />

            {estLoue ? (
              <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                Ce logement a déjà été loué via SunuKeur.
              </p>
            ) : envoye ? (
              <div className="alert-success">
                <p>Votre demande a été envoyée. Notre équipe vous mettra en relation avec le propriétaire très rapidement.</p>
              </div>
            ) : afficherFormulaire ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Votre nom</label>
                  <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Votre téléphone (9 chiffres)</label>
                  <ChampTelephone value={telephone} onChange={setTelephone} required />
                </div>
                <button type="submit" className="btn-primary" disabled={telephone.length !== 9} style={{ width: '100%' }}>
                  Envoyer la demande
                </button>
              </form>
            ) : (
              <button className="btn-primary" onClick={() => setAfficherFormulaire(true)} style={{ width: '100%' }}>
                Je suis intéressé
              </button>
            )}
          </div>
        </div>
      </div>

      {zoomOuvert && photos && (
        <div className="lightbox-overlay" onClick={() => setZoomOuvert(false)}>
          <button className="lightbox-close" onClick={() => setZoomOuvert(false)} aria-label="Fermer">
            <X size={24} />
          </button>
          <img src={imageActuelle} alt={logement.titre} className="lightbox-image" onClick={(e) => e.stopPropagation()} />
          {photos.length > 1 && (
            <>
              <button className="gallery-nav gallery-nav-left lightbox-nav" onClick={photoPrecedente} aria-label="Photo précédente">
                <ChevronLeft size={24} />
              </button>
              <button className="gallery-nav gallery-nav-right lightbox-nav" onClick={photoSuivante} aria-label="Photo suivante">
                <ChevronRight size={24} />
              </button>
              <span className="gallery-counter" style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)' }}>
                {indexPhoto + 1} / {photos.length}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default LogementDetail;