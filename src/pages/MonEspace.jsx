import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
  Settings, User, PlusCircle, Building2, Clock, CheckCircle2,
  XCircle, Heart, Lock, LogOut, Camera, ShieldCheck, Eye, Phone, MapPin
} from 'lucide-react';
import { useProprietaire } from '../context/ProprietaireContext';
import { useLogements } from '../context/LogementsContext';
import { useFavoris } from '../context/FavorisContext';
import ChampMotDePasse from '../components/ChampMotDePasse';
import ChampTelephone from '../components/ChampTelephone';
import LogementCard from '../components/LogementCard';
import { API_URL, API_BASE } from '../config';

const statutInfo = {
  en_attente: { label: 'En attente de validation', couleur: 'var(--color-accent)', icon: Clock, bg: 'color-mix(in srgb, var(--color-accent) 12%, transparent)' },
  validee: { label: 'Validée (En ligne)', couleur: 'var(--color-secondary)', icon: CheckCircle2, bg: 'color-mix(in srgb, var(--color-secondary) 12%, transparent)' },
  refusee: { label: 'Refusée', couleur: 'var(--color-error)', icon: XCircle, bg: 'color-mix(in srgb, var(--color-error) 12%, transparent)' },
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
    try {
      const res = await fetch(`${API_URL}/mes-logements`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        deconnecter();
        setSessionExpiree(true);
        return;
      }

      setMesLogements(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setChargement(false);
    }
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
  const validees = mesLogements.filter((l) => l.statut === 'validee').length;

  return (
    <div className="mon-espace-dashboard">
      {/* HEADER BANNER */}
      <div className="espace-hero-banner">
        <div className="user-profile-header">
          <div className="avatar-wrapper-lg">
            {profil.photoProfil ? (
              <img src={`${API_BASE}${profil.photoProfil}`} alt={prenom} />
            ) : (
              <User size={32} />
            )}
            <label className="btn-upload-photo" title="Changer la photo">
              <Camera size={14} />
              <input type="file" accept="image/*" onChange={handleChangerPhoto} hidden disabled={envoiPhoto} />
            </label>
          </div>

          <div className="user-profile-info">
            <div className="user-name-row">
              <h2>Bonjour {prenom} 👋</h2>
              <span className="badge-bailleur-online">
                <ShieldCheck size={14} /> Compte Bailleur Vérifié
              </span>
            </div>
            <p className="user-subtitle-text">Gérez facilement vos annonces et votre profil propriétaire sur SunuKeur.</p>
          </div>
        </div>

        <div className="espace-hero-actions">
          <Link to="/publier" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={17} /> Publier une annonce
          </Link>
          <button className="btn-secondary" onClick={deconnecter} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </div>

      {/* QUICK METRICS */}
      <div className="espace-metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box primary">
            <Building2 size={22} />
          </div>
          <div>
            <span className="metric-value">{mesLogements.length}</span>
            <span className="metric-label">Logement(s) soumis</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box success">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span className="metric-value">{validees}</span>
            <span className="metric-label">Annonce(s) en ligne</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box warning">
            <Clock size={22} />
          </div>
          <div>
            <span className="metric-value">{enAttente}</span>
            <span className="metric-label">En cours de modération</span>
          </div>
        </div>
      </div>

      {/* TABS BAR */}
      <div className="espace-nav-tabs">
        <button
          className={`tab-item ${ongletActif === 'annonces' ? 'active' : ''}`}
          onClick={() => setOngletActif('annonces')}
        >
          <Building2 size={18} />
          <span>Mes annonces</span>
          {enAttente > 0 && <span className="tab-pill-warning">{enAttente}</span>}
        </button>

        <button
          className={`tab-item ${ongletActif === 'compte' ? 'active' : ''}`}
          onClick={() => setOngletActif('compte')}
        >
          <User size={18} />
          <span>Mon profil & Sécurité</span>
        </button>

        <button
          className={`tab-item ${ongletActif === 'favoris' ? 'active' : ''}`}
          onClick={() => setOngletActif('favoris')}
        >
          <Heart size={18} />
          <span>Mes favoris</span>
          {mesFavoris.length > 0 && <span className="tab-pill-blue">{mesFavoris.length}</span>}
        </button>
      </div>

      {/* ONGLET 1 : MES ANNONCES */}
      {ongletActif === 'annonces' && (
        <div className="card espace-tab-card">
          <div className="tab-card-header">
            <div>
              <h3>Vos logements référencés sur SunuKeur</h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Pour toute modification majeure ou retrait d'annonce validée, contactez l'équipe SunuKeur via la page Contact.
              </p>
            </div>
            <Link to="/publier" className="btn-secondary" style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
              <PlusCircle size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Nouvelle annonce
            </Link>
          </div>

          {chargement ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
              Chargement de vos logements...
            </div>
          ) : mesLogements.length === 0 ? (
            <div className="empty-state" style={{ padding: '50px 20px' }}>
              <Building2 size={42} style={{ color: 'var(--color-text-muted)' }} />
              <h3>Vous n'avez pas encore publié d'annonce</h3>
              <p>Proposez votre bien à des centaines de chercheurs de logements à Dakar dès maintenant.</p>
              <Link to="/publier" className="btn-primary" style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle size={16} /> Publier ma première annonce
              </Link>
            </div>
          ) : (
            <div className="mes-annonces-grid">
              {mesLogements.map((l) => {
                const StatusIcon = statutInfo[l.statut]?.icon || Clock;
                const photo = l.photos && l.photos.length > 0 ? `${API_BASE}${l.photos[0]}` : null;

                return (
                  <div key={l.id} className="mes-annonce-card">
                    {photo ? (
                      <div className="mes-annonce-thumb" style={{ backgroundImage: `url(${photo})` }} />
                    ) : (
                      <div className="mes-annonce-thumb-placeholder">
                        <Building2 size={24} />
                      </div>
                    )}

                    <div className="mes-annonce-body">
                      <div className="mes-annonce-header-row">
                        <h4>{l.titre}</h4>
                        <span
                          className="statut-pill"
                          style={{
                            color: statutInfo[l.statut]?.couleur,
                            background: statutInfo[l.statut]?.bg,
                          }}
                        >
                          <StatusIcon size={13} /> {statutInfo[l.statut]?.label}
                        </span>
                      </div>

                      <div className="mes-annonce-meta-row">
                        <span><MapPin size={13} /> {l.secteur}</span>
                        <span className="dot-sep">•</span>
                        <span>{l.type}</span>
                        <span className="dot-sep">•</span>
                        <strong className="mes-annonce-prix">{l.prix.toLocaleString()} FCFA / mois</strong>
                      </div>

                      {l.statut === 'refusee' && l.motifRefus && (
                        <div className="motif-refus-banner">
                          <strong>Motif de refus :</strong> {l.motifRefus}
                        </div>
                      )}

                      {l.statut === 'validee' && (
                        <div className="dispo-status-row">
                          Statut de disponibilité : <strong>{l.disponibilite === 'loue' ? 'Loué' : 'Disponible'}</strong>
                        </div>
                      )}

                      <div className="mes-annonce-footer">
                        {l.statut === 'validee' && (
                          <Link to={`/logements/${l.id}`} className="btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Eye size={14} /> Voir l'annonce publique
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ONGLET 2 : MON COMPTE & SÉCURITÉ */}
      {ongletActif === 'compte' && (
        <div className="espace-profile-grid">
          <div className="card">
            <h3><User size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)' }} />Informations personnelles</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '-6px', marginBottom: '20px' }}>
              Vos coordonnées sont utilisées pour la mise en relation avec les locataires intéressés.
            </p>

            <form onSubmit={handleModifierProfil}>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Prénom</label>
                  <input
                    type="text"
                    value={profil.prenom}
                    onChange={(e) => setProfil((p) => ({ ...p, prenom: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
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
                <label>Téléphone principal (9 chiffres)</label>
                <ChampTelephone
                  value={profil.telephone}
                  onChange={(valeur) => setProfil((p) => ({ ...p, telephone: valeur }))}
                  required
                />
              </div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={profil.memeWhatsapp}
                  onChange={(e) => setProfil((p) => ({ ...p, memeWhatsapp: e.target.checked }))}
                />
                <span>Mon numéro WhatsApp est identique au numéro principal</span>
              </label>

              {!profil.memeWhatsapp && (
                <div className="form-group" style={{ marginTop: '12px' }}>
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
                  placeholder="nom@exemple.com"
                />
              </div>

              {erreurProfil && <p className="alert-error-msg">{erreurProfil}</p>}
              {messageProfil && <p className="alert-success-msg">{messageProfil}</p>}

              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                Enregistrer les modifications
              </button>
            </form>
          </div>

          <div className="card">
            <h3><Lock size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)' }} />Sécurité & Mot de passe</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '-6px', marginBottom: '20px' }}>
              Mettez à jour régulièrement votre mot de passe pour protéger l'accès à vos annonces.
            </p>

            <form onSubmit={handleChangerMotDePasse}>
              <div className="form-group">
                <label>Mot de passe actuel</label>
                <ChampMotDePasse value={ancienMdp} onChange={(e) => setAncienMdp(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Nouveau mot de passe (8 caractères minimum)</label>
                <ChampMotDePasse value={nouveauMdp} onChange={(e) => setNouveauMdp(e.target.value)} required minLength={8} />
              </div>

              {erreurMdp && <p className="alert-error-msg">{erreurMdp}</p>}
              {messageMdp && <p className="alert-success-msg">{messageMdp}</p>}

              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                Mettre à jour le mot de passe
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ONGLET 3 : FAVORIS */}
      {ongletActif === 'favoris' && (
        <div className="card espace-tab-card">
          <div className="tab-card-header">
            <div>
              <h3>Vos logements favoris enregistrés</h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Retrouvez facilement les annonces que vous avez sauvegardées lors de vos recherches.
              </p>
            </div>
          </div>

          {mesFavoris.length === 0 ? (
            <div className="empty-state" style={{ padding: '50px 20px' }}>
              <Heart size={42} style={{ color: 'var(--color-text-muted)' }} />
              <h3>Aucun favori enregistré</h3>
              <p>Parcourez nos annonces et cliquez sur le cœur pour conserver vos biens préférés.</p>
              <Link to="/logements" className="btn-primary" style={{ marginTop: '12px' }}>
                Explorer les logements
              </Link>
            </div>
          ) : (
            <div className="logement-grid" style={{ padding: 0, marginTop: '20px' }}>
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