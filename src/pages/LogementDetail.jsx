import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, BedDouble, Sofa, BadgeCheck, Heart, Share2, X, ChevronLeft, ChevronRight, ZoomIn, Calendar } from 'lucide-react';
import { useLogements } from '../context/LogementsContext';
import { useFavoris } from '../context/FavorisContext';
import { API_BASE } from '../config';
import { estNouveau } from '../utils';
import ChampTelephone from '../components/ChampTelephone';

function formaterDate(dateISO) {
  if (!dateISO) return null;
  const date = new Date(dateISO);
  const maintenant = new Date();
  const diffJours = Math.floor((maintenant - date) / (1000 * 60 * 60 * 24));

  if (diffJours === 0) return "Publié aujourd'hui";
  if (diffJours === 1) return 'Publié hier';
  if (diffJours < 7) return `Publié il y a ${diffJours} jours`;

  return `Ajouté le ${date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
}

function LogementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logements, ajouterDemande, rafraichir } = useLogements();
  const { estFavori, basculerFavori, estConnecte } = useFavoris();
  const logement = logements.find((l) => l.id === Number(id));

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  const [indexActif, setIndexActif] = useState(0);
  const [lightboxOuverte, setLightboxOuverte] = useState(false);

  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const [lienCopie, setLienCopie] = useState(false);

  const photos = logement?.photos?.length ? logement.photos : null;

  const imageSuivante = useCallback(() => {
    if (!photos) return;
    setIndexActif((i) => (i + 1) % photos.length);
  }, [photos]);

  const imagePrecedente = useCallback(() => {
    if (!photos) return;
    setIndexActif((i) => (i - 1 + photos.length) % photos.length);
  }, [photos]);

  useEffect(() => {
    if (!lightboxOuverte) return;
    function gererClavier(e) {
      if (e.key === 'Escape') setLightboxOuverte(false);
      if (e.key === 'ArrowRight') imageSuivante();
      if (e.key === 'ArrowLeft') imagePrecedente();
    }
    window.addEventListener('keydown', gererClavier);
    return () => window.removeEventListener('keydown', gererClavier);
  }, [lightboxOuverte, imageSuivante, imagePrecedente]);

  if (!logement) {
    return <p style={{ textAlign: 'center', padding: '40px' }}>Logement introuvable.</p>;
  }

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
        // partage annulé, rien à faire
      }
    } else {
      await navigator.clipboard.writeText(url);
      setLienCopie(true);
      setTimeout(() => setLienCopie(false), 2000);
    }
  }

  const estLoue = logement.disponibilite === 'loue';
  const favori = estFavori(logement.id);
  const nouveau = estNouveau(logement.datePublication);
  const texteDate = formaterDate(logement.datePublication);

  const imageActuelle = photos ? `${API_BASE}${photos[indexActif]}` : `https://picsum.photos/seed/${logement.id}/700/400`;

  return (
    <div className="card" style={{ maxWidth: '700px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Link to="/logements" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
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

      {/* GALERIE */}
      <div
        className="logement-image galerie-principale"
        style={{ backgroundImage: `url(${imageActuelle})`, height: '300px', borderRadius: 'var(--radius)', marginBottom: '10px' }}
        onClick={() => photos && setLightboxOuverte(true)}
      >
        <span className={`badge ${estLoue ? 'badge-loue' : 'badge-available'}`}>
          {estLoue ? 'Loué' : 'Disponible'}
        </span>
        {logement.statut === 'validee' && (
          <span className="badge badge-verified"><BadgeCheck size={14} /> Vérifié</span>
        )}
        {nouveau && <span className="badge badge-nouveau">Nouveau</span>}

        {photos && (
          <button className="galerie-zoom-btn" onClick={(e) => { e.stopPropagation(); setLightboxOuverte(true); }}>
            <ZoomIn size={16} />
          </button>
        )}
      </div>

      {photos && photos.length > 1 && (
        <div className="galerie-miniatures">
          {photos.map((photo, i) => (
            <button
              key={i}
              className={`galerie-miniature ${i === indexActif ? 'active' : ''}`}
              onClick={() => setIndexActif(i)}
              style={{ backgroundImage: `url(${API_BASE}${photo})` }}
              aria-label={`Photo ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* LIGHTBOX */}
      {lightboxOuverte && photos && (
        <div className="lightbox-overlay" onClick={() => setLightboxOuverte(false)}>
          <button className="lightbox-close" onClick={() => setLightboxOuverte(false)} aria-label="Fermer">
            <X size={24} />
          </button>

          {photos.length > 1 && (
            <button
              className="lightbox-nav lightbox-prev"
              onClick={(e) => { e.stopPropagation(); imagePrecedente(); }}
              aria-label="Photo précédente"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          <img
            src={`${API_BASE}${photos[indexActif]}`}
            alt={`Photo ${indexActif + 1}`}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />

          {photos.length > 1 && (
            <button
              className="lightbox-nav lightbox-next"
              onClick={(e) => { e.stopPropagation(); imageSuivante(); }}
              aria-label="Photo suivante"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {photos.length > 1 && (
            <span className="lightbox-compteur">{indexActif + 1} / {photos.length}</span>
          )}
        </div>
      )}

      <p className="logement-prix" style={{ fontSize: '1.4rem' }}>
        {logement.prix.toLocaleString()} FCFA <span>/ mois</span>
      </p>
      <h2 style={{ marginTop: '4px' }}>{logement.titre}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', marginBottom: '18px' }}>
        <p className="logement-meta" style={{ fontSize: '0.95rem', margin: 0 }}>
          <MapPin size={16} /> {logement.secteur}
        </p>
        {texteDate && (
          <p className="logement-meta" style={{ fontSize: '0.85rem', margin: 0 }}>
            <Calendar size={14} /> {texteDate}
          </p>
        )}
      </div>

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
          <button type="submit" className="btn-primary" disabled={telephone.length !== 9}>
            Envoyer la demande
          </button>
        </form>
      ) : (
        <button className="btn-primary" onClick={() => setAfficherFormulaire(true)}>
          Je suis intéressé
        </button>
      )}
    </div>
  );
}

export default LogementDetail;