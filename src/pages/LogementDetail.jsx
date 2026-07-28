import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, BedDouble, Sofa, BadgeCheck, Heart, Share2 } from 'lucide-react';
import { useLogements } from '../context/LogementsContext';
import { useFavoris } from '../context/FavorisContext';
import { API_BASE } from '../config';
import { estNouveau } from '../utils';
import ChampTelephone from '../components/ChampTelephone';
import { useNavigate } from 'react-router-dom';

function LogementDetail() {
  const { id } = useParams();
  const { logements, ajouterDemande, rafraichir } = useLogements();
  const { estFavori, basculerFavori, estConnecte } = useFavoris();
  const navigate = useNavigate();
  const logement = logements.find((l) => l.id === Number(id));

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const [lienCopie, setLienCopie] = useState(false);

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
        // partage annulé par l'utilisateur, rien à faire
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

      <div
        className="logement-image"
        style={{
          backgroundImage: `url(${logement.photos?.length ? API_BASE + logement.photos[0] : `https://picsum.photos/seed/${logement.id}/700/400`})`,
          height: '280px',
          borderRadius: 'var(--radius)',
          marginBottom: '12px',
        }}
      >
        <span className={`badge ${estLoue ? 'badge-loue' : 'badge-available'}`}>
          {estLoue ? 'Loué' : 'Disponible'}
        </span>
        {logement.statut === 'validee' && (
          <span className="badge badge-verified"><BadgeCheck size={14} /> Vérifié</span>
        )}
        {nouveau && <span className="badge badge-nouveau">Nouveau</span>}
      </div>

      {logement.photos?.length > 1 && (
        <div className="photo-gallery">
          {logement.photos.map((photo, i) => (
            <img key={i} src={`${API_BASE}${photo}`} alt={`Photo ${i + 1}`} />
          ))}
        </div>
      )}

      <p className="logement-prix" style={{ fontSize: '1.4rem' }}>
        {logement.prix.toLocaleString()} FCFA <span>/ mois</span>
      </p>
      <h2 style={{ marginTop: '4px' }}>{logement.titre}</h2>
      <p className="logement-meta" style={{ fontSize: '0.95rem', marginBottom: '18px' }}>
        <MapPin size={16} /> {logement.secteur}
      </p>

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