import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Settings, User } from 'lucide-react';
import { useProprietaire } from '../context/ProprietaireContext';
import { useLogements } from '../context/LogementsContext';
import { useFavoris } from '../context/FavorisContext';
import ChampMotDePasse from '../components/ChampMotDePasse';
import ChampTelephone from '../components/ChampTelephone';
import LogementCard from '../components/LogementCard';
import { API_URL, API_BASE } from '../config';

const statutInfo = {
  en_attente: { label: 'En attente de validation', couleur: 'var(--color-accent)' },
  validee: { label: 'Validée — visible publiquement', couleur: 'var(--color-secondary)' },
  refusee: { label: 'Refusée', couleur: 'var(--color-error)' },
};

function MonEspace() {
  const { token, prenom, estConnecte, deconnecter, recupererProfil, modifierProfil, changerMotDePasse, uploaderPhoto } = useProprietaire();
  const { logements, rafraichir: rafraichirLogements } = useLogements();
  const { favoris } = useFavoris();

  const [ongletActif, setOngletActif] = useState('annonces');

  const [mesLogements, setMesLogements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [sessionExpiree, setSessionExpiree] = useState(false);

  const [profil, setProfil] = useState({
    prenom: '', nom: '', telephone: '', whatsapp: '', memeWhatsapp: true, email: '', photoProfil: null,
  });
  const [messageProfil, setMessageProfil] = useState('');
  const [erreurProfil, setErreurProfil] = useState('');
  const [envoiPhoto, setEnvoiPhoto] = useState(false);

  const [ancienMdp, setAncienMdp] = useState('');
  const [nouveauMdp, setNouveauMdp] = useState('');
  const [messageMdp, setMessageMdp] = useState('');
  const [erreurMdp, setErreurMdp] = useState('');

  async function charger() {
    const res = await fetch(`${API_URL}/mes-logements`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      deconnecter();
      setSessionExpiree(true);
      return;
    }

    setMesLogements(await res.json());
    setChargement(false);
  }

  async function chargerProfil() {
    try {
      const data = await recupererProfil();
      setProfil({
        prenom: data.prenom || '',
        nom: data.nom || '',
        telephone: data.telephone || '',
        whatsapp: data.whatsapp || data.telephone || '',
        memeWhatsapp: (data.whatsapp || data.telephone) === data.telephone,
        email: data.email || '',
        photoProfil: data.photoProfil || null,
      });
    } catch {
      // ignoré
    }
  }

  useEffect(() => {
    if (!token) return;
    charger();
    chargerProfil();
    rafraichirLogements();
  }, [token]);

  async function handleModifierProfil(e) {
    e.preventDefault();
    setMessageProfil('');
    setErreurProfil('');

    if (profil.telephone.length !== 9) {
      setErreurProfil('Le numéro de téléphone doit contenir exactement 9 chiffres.');
      return;
    }

    if (!profil.memeWhatsapp && profil.whatsapp.length !== 9) {
      setErreurProfil('Le numéro WhatsApp doit contenir exactement 9 chiffres.');
      return;
    }

    try {
      await modifierProfil({
        prenom: profil.prenom,
        nom: profil.nom,
        email: profil.email,
        telephone: profil.telephone,
        whatsapp: profil.memeWhatsapp ? profil.telephone : profil.whatsapp,
      });
      setMessageProfil('Profil mis à jour avec succès.');
    } catch (err) {
      setErreurProfil(err.message);
    }
  }

  async function handleChangerPhoto(e) {
    const fichier = e.target.files[0];
    if (!fichier) return;

    setEnvoiPhoto(true);
    try {
      const nouvellePhoto = await uploaderPhoto(fichier);
      setProfil((precedent) => ({ ...precedent, photoProfil: nouvellePhoto }));
    } catch (err) {
      setErreurProfil(err.message);
    } finally {
      setEnvoiPhoto(false);
    }
  }

  async function handleChangerMotDePasse(e) {
    e.preventDefault();
    setMessageMdp('');
    setErreurMdp('');

    if (nouveauMdp.length < 8) {
      setErreurMdp('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    try {
      await changerMotDePasse(ancienMdp, nouveauMdp);
      setMessageMdp('Mot de passe modifié avec succès.');
      setAncienMdp('');
      setNouveauMdp('');
    } catch (err) {
      setErreurMdp(err.message);
    }
  }

  if (!estConnecte || sessionExpiree) {
    return <Navigate to="/connexion" replace />;
  }

  const mesFavoris = logements.filter((l) => favoris.includes(l.id));
  const enAttente = mesLogements.filter((l) => l.statut === 'en_attente').length;

  return (
    <div className="mon-espace">
      <div className="mon-espace-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="avatar-preview" style={{ width: '52px', height: '52px' }}>
            {profil.photoProfil ? (
              <img src={`${API_BASE}${profil.photoProfil}`} alt="Photo de profil" />
            ) : (
              <User size={24} />
            )}
          </div>
          <div>
            <h2 style={{ margin: 0 }}>Bonjour {prenom} 👋</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Espace propriétaire</p>
          </div>
        </div>
        <button className="btn-secondary" onClick={deconnecter}>Se déconnecter</button>
      </div>

      <div className="mon-espace-tabs">
        <button className={`mon-espace-tab ${ongletActif === 'annonces' ? 'active' : ''}`} onClick={() => setOngletActif('annonces')}>
          Mes annonces
          {enAttente > 0 && <span className="tab-badge">{enAttente}</span>}
        </button>
        <button className={`mon-espace-tab ${ongletActif === 'compte' ? 'active' : ''}`} onClick={() => setOngletActif('compte')}>
          <User size={17} /> Mon compte
        </button>
        <button className={`mon-espace-tab ${ongletActif === 'favoris' ? 'active' : ''}`} onClick={() => setOngletActif('favoris')}>
          Favoris
          {mesFavoris.length > 0 && <span className="tab-badge">{mesFavoris.length}</span>}
        </button>
      </div>

      {ongletActif === 'annonces' && (
        <div className="card">
          <h2>Mes annonces</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '-8px' }}>
            La modification ou la suppression d'une annonce est gérée exclusivement par l'équipe SunuKeur.
            Pour tout changement, contactez-nous via la page Contact.
          </p>

          {chargement ? (
            <p>Chargement...</p>
          ) : mesLogements.length === 0 ? (
            <p>Vous n'avez pas encore publié d'annonce.</p>
          ) : (
            mesLogements.map((l) => (
              <div key={l.id} className="admin-row">
                <div>
                  <h3 style={{ margin: '0 0 4px' }}>{l.titre}</h3>
                  <p style={{ margin: '0 0 4px' }}>{l.secteur} — {l.prix.toLocaleString()} FCFA</p>
                  <p style={{ margin: '0 0 4px', fontWeight: 600, color: statutInfo[l.statut]?.couleur }}>
                    {statutInfo[l.statut]?.label}
                  </p>
                  {l.statut === 'refusee' && l.motifRefus && (
                    <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Motif : {l.motifRefus}
                    </p>
                  )}
                  {l.statut === 'validee' && (
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Disponibilité : <strong>{l.disponibilite === 'loue' ? 'Loué' : 'Disponible'}</strong>
                      <span style={{ fontStyle: 'italic' }}> (géré par SunuKeur)</span>
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {ongletActif === 'compte' && (
        <>
          <div className="card">
            <h2><User size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Informations personnelles</h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div className="avatar-preview">
                {profil.photoProfil ? (
                  <img src={`${API_BASE}${profil.photoProfil}`} alt="Photo de profil" />
                ) : (
                  <User size={28} />
                )}
              </div>
              <label className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-block' }}>
                {envoiPhoto ? 'Envoi...' : 'Changer la photo'}
                <input type="file" accept="image/*" onChange={handleChangerPhoto} hidden disabled={envoiPhoto} />
              </label>
            </div>

            <form onSubmit={handleModifierProfil}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Prénom</label>
                  <input
                    type="text"
                    value={profil.prenom}
                    onChange={(e) => setProfil((p) => ({ ...p, prenom: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Nom</label>
                  <input
                    type="text"
                    value={profil.nom}
                    onChange={(e) => setProfil((p) => ({ ...p, nom: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Téléphone (9 chiffres)</label>
                <ChampTelephone
                  value={profil.telephone}
                  onChange={(valeur) => setProfil((p) => ({ ...p, telephone: valeur }))}
                  required
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', margin: '-8px 0 14px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={profil.memeWhatsapp}
                  onChange={(e) => setProfil((p) => ({ ...p, memeWhatsapp: e.target.checked }))}
                />
                Mon numéro WhatsApp est le même
              </label>

              {!profil.memeWhatsapp && (
                <div className="form-group">
                  <label>Numéro WhatsApp (9 chiffres)</label>
                  <ChampTelephone
                    value={profil.whatsapp}
                    onChange={(valeur) => setProfil((p) => ({ ...p, whatsapp: valeur }))}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Adresse email (optionnel)</label>
                <input
                  type="email"
                  value={profil.email}
                  onChange={(e) => setProfil((p) => ({ ...p, email: e.target.value }))}
                  placeholder="vous@exemple.com"
                />
              </div>

              {erreurProfil && <p style={{ fontSize: '0.85rem', color: 'var(--color-error)' }}>{erreurProfil}</p>}
              {messageProfil && <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary)' }}>{messageProfil}</p>}

              <button type="submit" className="btn-primary">Enregistrer les modifications</button>
            </form>
          </div>

          <div className="card">
            <h2><Settings size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Sécurité</h2>

            <h3 style={{ fontSize: '1rem' }}>Changer mon mot de passe</h3>
            <form onSubmit={handleChangerMotDePasse}>
              <div className="form-group">
                <label>Mot de passe actuel</label>
                <ChampMotDePasse value={ancienMdp} onChange={(e) => setAncienMdp(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Nouveau mot de passe (8 caractères minimum)</label>
                <ChampMotDePasse value={nouveauMdp} onChange={(e) => setNouveauMdp(e.target.value)} required minLength={8} />
              </div>
              {erreurMdp && <p style={{ fontSize: '0.85rem', color: 'var(--color-error)' }}>{erreurMdp}</p>}
              {messageMdp && <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary)' }}>{messageMdp}</p>}
              <button type="submit" className="btn-primary">Changer le mot de passe</button>
            </form>
          </div>
        </>
      )}

      {ongletActif === 'favoris' && (
        <div className="card">
          <h2>Mes favoris</h2>
          {mesFavoris.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Vous n'avez pas encore de favoris.</p>
          ) : (
            <div className="logement-grid" style={{ padding: 0 }}>
              {mesFavoris.map((l) => (
                <Link key={l.id} to={`/logements/${l.id}`} style={{ textDecoration: 'none' }}>
                  <LogementCard
                    id={l.id}
                    titre={l.titre}
                    prix={l.prix}
                    type={l.type}
                    secteur={l.secteur}
                    statut={l.statut}
                    photos={l.photos}
                    disponibilite={l.disponibilite}
                    datePublication={l.datePublication}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MonEspace;