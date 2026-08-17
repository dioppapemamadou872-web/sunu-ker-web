import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, BedDouble, Sofa, BadgeCheck, Heart, Share2, X,
  ChevronLeft, ChevronRight, ZoomIn, Calendar, Lock, UserCheck,
  Send, CheckCircle2, ShieldCheck, Video, Bath, Copy
} from 'lucide-react';
import { useLogements } from '../context/LogementsContext';
import { useFavoris } from '../context/FavorisContext';
import { useProprietaire } from '../context/ProprietaireContext';
import { API_BASE } from '../config';
import { estNouveau } from '../utils';
import ChampTelephone from '../components/ChampTelephone';

import logoIcon from '../assets/logo-icon.png';

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

function LogementCoverPlaceholder({ type, secteur }) {
  return (
    <div className="logement-placeholder-cover" style={{ minHeight: '340px' }}>
      <div className="placeholder-card-glass" style={{ padding: '28px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '8px' }}>
        <img src={logoIcon} alt="DëkuWaay Logo" className="placeholder-logo" style={{ width: '76px', height: '76px', objectFit: 'contain' }} />
        <span className="placeholder-tag" style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '6px' }}>
          {type || 'Logement'} · {secteur || 'Dakar'}
        </span>
        <span className="placeholder-subtext" style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          Photos à venir par le propriétaire
        </span>
      </div>
    </div>
  );
}

function LogementDetail() {
  const { id } = useParams();
  const { logements, chargement, ajouterDemande, rafraichir } = useLogements();
  const { estFavori, basculerFavori } = useFavoris();
  const { estConnecte, prenom, nom: nomUser } = useProprietaire();

  const logement = logements.find((l) => l.id === Number(id));

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  const [indexActif, setIndexActif] = useState(0);
  const [lightboxOuverte, setLightboxOuverte] = useState(false);

  const [modalCompteRequis, setModalCompteRequis] = useState(false);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const [lienCopie, setLienCopie] = useState(false);

  // Pré-remplir le nom si l'utilisateur est connecté
  useEffect(() => {
    if (estConnecte && prenom) {
      setNom(`${prenom} ${nomUser || ''}`.trim());
    }
  }, [estConnecte, prenom, nomUser]);

  const photos = logement?.photos?.length ? logement.photos : null;
  const listeVideos = logement?.videos?.length
    ? logement.videos
    : logement?.video
    ? [logement.video]
    : [];

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

  if (chargement) {
    return <div className="skeleton-card" style={{ maxWidth: '960px', height: '450px', margin: '30px auto' }} />;
  }

  if (!logement) {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '50px 20px' }}>
        <h2>Logement introuvable</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>Ce bien n'existe pas ou a été retiré de la plateforme.</p>
        <Link to="/logements" className="btn-primary">Retour aux annonces</Link>
      </div>
    );
  }

  function handleClicInteresse() {
    if (!estConnecte) {
      setModalCompteRequis(true);
    } else {
      setAfficherFormulaire(true);
    }
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

  async function copierLienDirect() {
    await navigator.clipboard.writeText(window.location.href);
    setLienCopie(true);
    setTimeout(() => setLienCopie(false), 2500);
  }

  async function partager() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: logement.titre, text: `Découvrez ce logement sur DëkuWaay : ${logement.titre}`, url });
      } catch {
        // annulé
      }
    } else {
      await copierLienDirect();
    }
  }

  const estLoue = logement.disponibilite === 'loue';
  const favori = estFavori(logement.id);
  const nouveau = estNouveau(logement.datePublication);
  const texteDate = formaterDate(logement.datePublication);

  const imageActuelle = photos ? `${API_BASE}${photos[indexActif]}` : `https://picsum.photos/seed/${logement.id}/900/500`;

  return (
    <div className="logement-detail-page">
      {/* BARRE SUPERIEURE DE NAVIGATION */}
      <div className="logement-detail-topbar">
        <Link to="/logements" className="btn-back-link">
          <ArrowLeft size={16} /> Retour aux logements
        </Link>

        <div className="logement-actions-top">
          <button className="icon-action-btn" onClick={copierLienDirect} title="Copier le lien direct de l'annonce">
            <Copy size={17} />
          </button>
          <button className="icon-action-btn" onClick={partager} title="Partager cette annonce">
            <Share2 size={18} />
          </button>
          <button
            className="icon-action-btn"
            onClick={() => (estConnecte ? basculerFavori(logement.id) : setModalCompteRequis(true))}
            title={favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart size={18} fill={favori ? '#EF4444' : 'none'} color={favori ? '#EF4444' : 'currentColor'} />
          </button>
        </div>
      </div>

      {lienCopie && <p className="alert-success-msg" style={{ marginBottom: '16px' }}>Lien copié dans le presse-papiers !</p>}

      {/* GALERIE EN TÊTE SAAS */}
      {photos ? (
        <div
          className="logement-hero-gallery"
          style={{ backgroundImage: `url(${imageActuelle})` }}
          onClick={() => setLightboxOuverte(true)}
        >
          <div className="gallery-badges-row">
            <span className={`badge ${estLoue ? 'badge-loue' : 'badge-available'}`}>
              {estLoue ? 'Loué' : 'Disponible'}
            </span>
            {logement.statut === 'validee' && (
              <span className="badge badge-verified"><BadgeCheck size={14} /> Vérifié par DëkuWaay</span>
            )}
            {nouveau && <span className="badge badge-nouveau">Nouveau</span>}
          </div>

          <button className="galerie-zoom-btn" onClick={(e) => { e.stopPropagation(); setLightboxOuverte(true); }}>
            <ZoomIn size={16} /> <span>Agrandir ({photos.length})</span>
          </button>
        </div>
      ) : (
        <div className="logement-hero-gallery" style={{ padding: 0, overflow: 'hidden' }}>
          <LogementCoverPlaceholder type={logement.type} secteur={logement.secteur} />
          <div className="gallery-badges-row">
            <span className={`badge ${estLoue ? 'badge-loue' : 'badge-available'}`}>
              {estLoue ? 'Loué' : 'Disponible'}
            </span>
            {logement.statut === 'validee' && (
              <span className="badge badge-verified"><BadgeCheck size={14} /> Vérifié par DëkuWaay</span>
            )}
          </div>
        </div>
      )}

      {photos && photos.length > 1 && (
        <div className="galerie-miniatures-strip">
          {photos.map((photo, i) => (
            <button
              key={i}
              className={`galerie-miniature-thumb ${i === indexActif ? 'active' : ''}`}
              onClick={() => setIndexActif(i)}
              style={{ backgroundImage: `url(${API_BASE}${photo})` }}
            />
          ))}
        </div>
      )}

      {/* LIGHTBOX FULLSCREEN */}
      {lightboxOuverte && photos && (
        <div className="lightbox-overlay" onClick={() => setLightboxOuverte(false)}>
          <button className="lightbox-close" onClick={() => setLightboxOuverte(false)}>
            <X size={24} />
          </button>

          {photos.length > 1 && (
            <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); imagePrecedente(); }}>
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
            <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); imageSuivante(); }}>
              <ChevronRight size={28} />
            </button>
          )}

          <span className="lightbox-compteur">{indexActif + 1} / {photos.length}</span>
        </div>
      )}

      {/* DISPOSITION 2 COLONNES (DÉTAILS + WIDGET CONTACT) */}
      <div className="logement-detail-grid">
        {/* COLONNE GAUCHE : INFOS DU BIEN */}
        <div className="logement-main-info card">
          <div className="logement-title-header">
            <div>
              <span className="logement-sector-tag"><MapPin size={14} /> {logement.secteur}</span>
              <h2>{logement.titre}</h2>
              {texteDate && (
                <span className="logement-pub-date"><Calendar size={13} /> {texteDate}</span>
              )}
            </div>
            <div className="logement-price-tag">
              <strong>{logement.prix.toLocaleString()} FCFA</strong>
              <span>/ mois</span>
            </div>
          </div>

          <div className="logement-specs-row">
            <div className="spec-pill">
              <BedDouble size={18} />
              <span><strong>{logement.chambres}</strong> Chambre(s)</span>
            </div>
            {logement.salons > 0 && (
              <div className="spec-pill">
                <Sofa size={18} />
                <span><strong>{logement.salons}</strong> Salon(s)</span>
              </div>
            )}
            <div className="spec-pill">
              <Bath size={18} />
              <span>
                {logement.salleDeBainPrivee === false ? (
                  <strong>SDB commune</strong>
                ) : (
                  <><strong>{logement.sallesDeBain || 1}</strong> Salle(s) de bain</>
                )}
              </span>
            </div>
            <div className="spec-pill">
              <ShieldCheck size={18} />
              <span>Type : <strong>{logement.type}</strong></span>
            </div>
          </div>

          <div className="logement-section-block">
            <h3>Description du bien</h3>
            <p className="logement-description-text">{logement.description || 'Aucune description fournie.'}</p>
          </div>

          {logement.equipements?.length > 0 && (
            <div className="logement-section-block">
              <h3>Équipements & Prestations</h3>
              <div className="equipements-grid">
                {logement.equipements.map((eq, i) => (
                  <span key={i} className="equipement-chip">
                    <CheckCircle2 size={14} color="var(--color-secondary)" /> {eq}
                  </span>
                ))}
              </div>
            </div>
          )}

          {listeVideos.length > 0 && (
            <div className="logement-section-block">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Video size={18} style={{ color: 'var(--color-primary)' }} /> Vidéo{listeVideos.length > 1 ? 's' : ''} du bien ({listeVideos.length})
              </h3>
              <div className="logement-videos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px', marginTop: '12px' }}>
                {listeVideos.map((vUrl, i) => (
                  <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', background: '#000', border: '1px solid var(--color-border)' }}>
                    <video
                      src={vUrl.startsWith('http') ? vUrl : `${API_BASE}${vUrl}`}
                      controls
                      preload="metadata"
                      style={{ width: '100%', maxHeight: '220px', display: 'block' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLONNE DROITE : WIDGET DE MISE EN RELATION BAILLEUR */}
        <div className="logement-sidebar-widget card">
          <div className="widget-landlord-header">
            <div className="landlord-avatar">
              <UserCheck size={24} />
            </div>
            <div>
              <span className="landlord-role">Propriétaire Vérifié</span>
              <h4 className="landlord-name">
                {logement.proprietairePrenom ? `${logement.proprietairePrenom} ${logement.proprietaireNom || ''}` : 'Bailleur DëkuWaay'}
              </h4>
            </div>
          </div>

          <div className="widget-price-summary">
            <span>Loyer mensuel</span>
            <strong className="widget-price-amount">{logement.prix.toLocaleString()} FCFA / mois</strong>
          </div>

          {estLoue ? (
            <div className="widget-loue-banner">
              <p>Ce logement a déjà été loué.</p>
            </div>
          ) : envoye ? (
            <div className="alert-success-msg" style={{ padding: '16px', borderRadius: '12px' }}>
              <CheckCircle2 size={24} style={{ marginBottom: '6px' }} />
              <h4 style={{ margin: '0 0 4px' }}>Demande transmise !</h4>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Notre équipe vous mettra en relation très rapidement avec le propriétaire.</p>
            </div>
          ) : afficherFormulaire ? (
            <form onSubmit={handleSubmit} className="widget-contact-form">
              <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem' }}>Formulaire de mise en relation</h4>
              <div className="form-group">
                <label>Votre nom complet</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Prénom & Nom"
                  required
                />
              </div>
              <div className="form-group">
                <label>Votre numéro de téléphone (9 chiffres)</label>
                <ChampTelephone value={telephone} onChange={setTelephone} required />
              </div>
              <button type="submit" className="btn-primary auth-submit-btn" disabled={telephone.length !== 9}>
                <Send size={16} /> Envoyer la demande
              </button>
            </form>
          ) : (
            <div className="widget-cta-block">
              <button className="btn-primary widget-btn-primary" onClick={handleClicInteresse}>
                <Send size={18} /> Je suis intéressé
              </button>
              <p className="widget-security-note">
                <ShieldCheck size={14} /> Service gratuit • Vos données restent protégées.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODALE EXIGENCE DU COMPTE POUR CONTINUER */}
      {modalCompteRequis && (
        <div className="saas-modal-backdrop" onClick={() => setModalCompteRequis(false)}>
          <div className="saas-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="var(--color-primary)" /> Compte requis
              </h3>
              <button className="modal-btn-close" onClick={() => setModalCompteRequis(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-card-body" style={{ textAlign: 'center', padding: '28px 24px' }}>
              <div className="auth-icon-badge" style={{ margin: '0 auto 16px' }}>
                <Lock size={26} />
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>Connectez-vous pour contacter le bailleur</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '22px' }}>
                Pour envoyer votre demande sur <strong>"{logement.titre}"</strong> et être rappelé par le propriétaire, vous devez posséder un compte DëkuWaay.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/connexion" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  Se connecter
                </Link>
                <Link to="/inscription" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  Créer un compte gratuitement
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STICKY MOBILE CTA BAR */}
      {!estLoue && (
        <div className="mobile-sticky-action-bar">
          <div className="mobile-sticky-price">
            <span>{logement.prix.toLocaleString()} FCFA</span>
            <small>/ mois</small>
          </div>
          <button className="btn-primary" onClick={handleClicInteresse} style={{ padding: '10px 20px', borderRadius: '12px' }}>
            <Send size={16} /> Contact
          </button>
        </div>
      )}
    </div>
  );
}

export default LogementDetail;