import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
  User, PlusCircle, Building2, Clock, CheckCircle2,
  XCircle, Heart, Lock, LogOut, Camera, ShieldCheck, Eye, MapPin, Check, X, Send, MessageSquare, Trash2
} from 'lucide-react';
import { useProprietaire } from '../context/ProprietaireContext';
import { useLogements } from '../context/LogementsContext';
import { useFavoris } from '../context/FavorisContext';
import ChampMotDePasse from '../components/ChampMotDePasse';
import ChampTelephone from '../components/ChampTelephone';
import LogementCard from '../components/LogementCard';
import ModalConfirmation from '../components/ModalConfirmation';
import { API_URL, API_BASE } from '../config';

const statutInfo = {
  en_attente: { label: 'En attente de validation', couleur: 'var(--color-accent)', icon: Clock, bg: 'color-mix(in srgb, var(--color-accent) 12%, transparent)' },
  validee: { label: 'Validée (En ligne)', couleur: 'var(--color-secondary)', icon: CheckCircle2, bg: 'color-mix(in srgb, var(--color-secondary) 12%, transparent)' },
  refusee: { label: 'Refusée', couleur: 'var(--color-error)', icon: XCircle, bg: 'color-mix(in srgb, var(--color-error) 12%, transparent)' },
};

function MonEspace() {
  const { token, prenom, estConnecte, deconnecter, recupererProfil, modifierProfil, changerMotDePasse, uploaderPhoto, supprimerPhoto } = useProprietaire();
  const { logements, rafraichir: rafraichirLogements } = useLogements();
  const { favoris } = useFavoris();

  const [ongletActif, setOngletActif] = useState('favoris');

  const [mesLogements, setMesLogements] = useState([]);
  const [mesDemandes, setMesDemandes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [sessionExpiree, setSessionExpiree] = useState(false);

  const [profil, setProfil] = useState({
    prenom: '', nom: '', telephone: '', whatsapp: '', memeWhatsapp: true, email: '', photoProfil: null,
  });
  const [messageProfil, setMessageProfil] = useState('');
  const [erreurProfil, setErreurProfil] = useState('');
  const [envoiPhoto, setEnvoiPhoto] = useState(false);
  const [modalSuppressionPhotoOuvert, setModalSuppressionPhotoOuvert] = useState(false);

  const [ancienMdp, setAncienMdp] = useState('');
  const [nouveauMdp, setNouveauMdp] = useState('');
  const [confirmNouveauMdp, setConfirmNouveauMdp] = useState('');
  const [messageMdp, setMessageMdp] = useState('');
  const [erreurMdp, setErreurMdp] = useState('');

  const mdpEgaux = Boolean(nouveauMdp && confirmNouveauMdp && nouveauMdp === confirmNouveauMdp);
  const mdpDifferents = Boolean(nouveauMdp && confirmNouveauMdp && nouveauMdp !== confirmNouveauMdp);

  async function charger() {
    try {
      const resMesLogements = await fetch(`${API_URL}/mes-logements`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resMesLogements.ok) {
        setMesLogements(await resMesLogements.json());
      } else {
        deconnecter();
        setSessionExpiree(true);
        return;
      }

      const resDemandes = await fetch(`${API_URL}/demandes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resDemandes.ok) {
        const dataDemandes = await resDemandes.json();
        // Filtrer les demandes correspondant à cet utilisateur par téléphone
        setMesDemandes(dataDemandes);
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setMessageProfil('');
    setErreurProfil('');
    try {
      const nouvellePhoto = await uploaderPhoto(fichier);
      setProfil((precedent) => ({ ...precedent, photoProfil: nouvellePhoto }));
      setMessageProfil('Photo de profil mise à jour avec succès.');
    } catch (err) {
      setErreurProfil(err.message);
    } finally {
      setEnvoiPhoto(false);
    }
  }

  function handleSupprimerPhoto() {
    setModalSuppressionPhotoOuvert(true);
  }

  async function confirmerSuppressionPhoto() {
    setEnvoiPhoto(true);
    setMessageProfil('');
    setErreurProfil('');
    try {
      await supprimerPhoto();
      setProfil((precedent) => ({ ...precedent, photoProfil: null }));
      setMessageProfil('Photo de profil supprimée avec succès.');
      setModalSuppressionPhotoOuvert(false);
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

    if (nouveauMdp !== confirmNouveauMdp) {
      setErreurMdp('Le nouveau mot de passe et sa confirmation ne correspondent pas.');
      return;
    }

    try {
      await changerMotDePasse(ancienMdp, nouveauMdp);
      setMessageMdp('Mot de passe modifié avec succès.');
      setAncienMdp('');
      setNouveauMdp('');
      setConfirmNouveauMdp('');
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
    <div className="mon-espace-dashboard">
      {/* UNIVERSAL HEADER BANNER (LOCATAIRE & BAILLEUR) */}
      <div className="espace-hero-banner">
        <div className="user-profile-header">
          <div className="avatar-wrapper-lg">
            {profil.photoProfil ? (
              <img src={`${API_BASE}${profil.photoProfil}`} alt={prenom} />
            ) : (
              <User size={32} />
            )}
            <div className="avatar-actions">
              <label className="btn-upload-photo" title="Changer la photo de profil">
                <Camera size={13} />
                <input type="file" accept="image/*" onChange={handleChangerPhoto} hidden disabled={envoiPhoto} />
              </label>
              {profil.photoProfil && (
                <button
                  type="button"
                  className="btn-delete-photo"
                  onClick={handleSupprimerPhoto}
                  title="Supprimer la photo de profil"
                  disabled={envoiPhoto}
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="user-profile-info">
            <div className="user-name-row">
              <h2>Bonjour {prenom || 'Cher utilisateur'} 👋</h2>
              <span className="badge-bailleur-online">
                <ShieldCheck size={14} /> Compte Vérifié
              </span>
            </div>
            <p className="user-subtitle-text">
              Gérez vos favoris, vos demandes de logement, vos annonces et vos paramètres personnels sur DëkuWaay.
            </p>
          </div>
        </div>

        <div className="espace-hero-actions">
          <Link to="/publier" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={17} /> Proposer un bien
          </Link>
          <button className="btn-secondary" onClick={deconnecter} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="espace-nav-tabs">
        <button
          className={`tab-item ${ongletActif === 'favoris' ? 'active' : ''}`}
          onClick={() => setOngletActif('favoris')}
        >
          <Heart size={18} />
          <span>Mes favoris</span>
          {mesFavoris.length > 0 && <span className="tab-pill-blue">{mesFavoris.length}</span>}
        </button>

        <button
          className={`tab-item ${ongletActif === 'demandes' ? 'active' : ''}`}
          onClick={() => setOngletActif('demandes')}
        >
          <Send size={18} />
          <span>Mes demandes de contact</span>
          {mesDemandes.length > 0 && <span className="tab-pill-blue">{mesDemandes.length}</span>}
        </button>

        <button
          className={`tab-item ${ongletActif === 'annonces' ? 'active' : ''}`}
          onClick={() => setOngletActif('annonces')}
        >
          <Building2 size={18} />
          <span>Mes annonces (Bailleur)</span>
          {enAttente > 0 && <span className="tab-pill-warning">{enAttente}</span>}
        </button>

        <button
          className={`tab-item ${ongletActif === 'compte' ? 'active' : ''}`}
          onClick={() => setOngletActif('compte')}
        >
          <User size={18} />
          <span>Mon profil & Sécurité</span>
        </button>
      </div>

      {/* ONGLET 1 : FAVORIS */}
      {ongletActif === 'favoris' && (
        <div className="card espace-tab-card">
          <div className="tab-card-header">
            <div>
              <h3>Vos logements favoris enregistrés</h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Retrouvez facilement les annonces que vous avez sauvegardées pour les consulter ou les comparer.
              </p>
            </div>
            <Link to="/logements" className="btn-secondary" style={{ fontSize: '0.85rem' }}>
              Parcourir les offres
            </Link>
          </div>

          {mesFavoris.length === 0 ? (
            <div className="empty-state" style={{ padding: '50px 20px' }}>
              <Heart size={42} style={{ color: 'var(--color-text-muted)' }} />
              <h3>Aucun favori enregistré pour le moment</h3>
              <p>Parcourez nos annonces et cliquez sur le cœur pour conserver vos coups de cœur.</p>
              <Link to="/logements" className="btn-primary" style={{ marginTop: '12px' }}>
                Explorer les logements à Dakar
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

      {/* ONGLET 2 : MES DEMANDES DE CONTACT */}
      {ongletActif === 'demandes' && (
        <div className="card espace-tab-card">
          <div className="tab-card-header">
            <div>
              <h3>Historique de vos demandes de mise en relation</h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Suivez les logements pour lesquels vous avez exprimé un intérêt. L'équipe DëkuWaay s'occupe du suivi avec les propriétaires.
              </p>
            </div>
          </div>

          {mesDemandes.length === 0 ? (
            <div className="empty-state" style={{ padding: '50px 20px' }}>
              <MessageSquare size={42} style={{ color: 'var(--color-text-muted)' }} />
              <h3>Vous n'avez pas encore envoyé de demande</h3>
              <p>Lorsque vous cliquez sur "Je suis intéressé" sur une annonce, votre demande apparaît ici.</p>
              <Link to="/logements" className="btn-primary" style={{ marginTop: '12px' }}>
                Rechercher un logement
              </Link>
            </div>
          ) : (
            <div className="saas-table-wrapper" style={{ marginTop: '20px' }}>
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Logement</th>
                    <th>Nom soumis</th>
                    <th>Téléphone</th>
                    <th>Date de demande</th>
                    <th>Statut</th>
                    <th>Contact direct</th>
                  </tr>
                </thead>
                <tbody>
                  {mesDemandes.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <strong className="td-title">{d.logementTitre || `Logement #${d.logementId}`}</strong>
                      </td>
                      <td>{d.nom}</td>
                      <td>{d.telephone}</td>
                      <td>{d.dateCreation ? new Date(d.dateCreation).toLocaleDateString('fr-FR') : 'Récemment'}</td>
                      <td>
                        <span className="saas-badge success">
                          <CheckCircle2 size={13} /> Transmise au bailleur
                        </span>
                      </td>
                      <td>
                        <a
                          href={`https://wa.me/221${d.telephone.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${d.nom}, suite à votre intérêt sur DëkuWaay concernant "${d.logementTitre || 'le logement'}"`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-sm"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            textDecoration: 'none',
                            background: '#25D366',
                            color: '#ffffff',
                            borderRadius: '8px',
                            padding: '4px 10px',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}
                        >
                          <MessageSquare size={13} /> WhatsApp
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ONGLET 3 : MES ANNONCES (BAILLEUR) */}
      {ongletActif === 'annonces' && (
        <div className="card espace-tab-card">
          <div className="tab-card-header">
            <div>
              <h3>Espace Propriétaire — Vos biens référencés</h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Gérez la disponibilité de vos logements ou soumettez un nouveau bien à la modération.
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
              <h3>Vous êtes propriétaire ou bailleur à Dakar ?</h3>
              <p>Proposez votre appartement, maison ou studio à des milliers de locataires vérifiés.</p>
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
                          Disponibilité : <strong>{l.disponibilite === 'loue' ? 'Loué' : 'Disponible'}</strong>
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

      {/* ONGLET 4 : MON COMPTE & SÉCURITÉ */}
      {ongletActif === 'compte' && (
        <div className="espace-profile-grid">
          <div className="card">
            <h3><User size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)' }} />Informations personnelles</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '-6px', marginBottom: '20px' }}>
              Vos coordonnées sont utilisées pour pré-remplir vos demandes de contact et échanger avec les bailleurs.
            </p>

            <div className="profile-photo-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'color-mix(in srgb, var(--color-primary) 5%, transparent)', borderRadius: '14px', border: '1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid var(--color-primary)' }}>
                {profil.photoProfil ? (
                  <img src={`${API_BASE}${profil.photoProfil}`} alt={prenom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={26} style={{ color: 'var(--color-text-muted)' }} />
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Photo de profil</span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <label className="btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Camera size={14} /> {profil.photoProfil ? 'Changer la photo' : 'Ajouter une photo'}
                    <input type="file" accept="image/*" onChange={handleChangerPhoto} hidden disabled={envoiPhoto} />
                  </label>
                  {profil.photoProfil && (
                    <button
                      type="button"
                      className="btn-danger-light btn-sm"
                      onClick={handleSupprimerPhoto}
                      disabled={envoiPhoto}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Trash2 size={14} /> Supprimer la photo
                    </button>
                  )}
                </div>
              </div>
            </div>

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
                <label>Téléphone principal</label>
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
                  <label>Numéro WhatsApp</label>
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
              Mettez à jour votre mot de passe pour sécuriser votre compte.
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

              <div className="form-group">
                <label>Confirmer le nouveau mot de passe</label>
                <ChampMotDePasse value={confirmNouveauMdp} onChange={(e) => setConfirmNouveauMdp(e.target.value)} required minLength={8} />
                {mdpEgaux && (
                  <span className="password-match-badge match">
                    <Check size={13} /> Les mots de passe correspondent
                  </span>
                )}
                {mdpDifferents && (
                  <span className="password-match-badge mismatch">
                    <X size={13} /> Les mots de passe ne correspondent pas
                  </span>
                )}
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

      {/* MODAL SUPPRESSION PHOTO DE PROFIL */}
      <ModalConfirmation
        isOpen={modalSuppressionPhotoOuvert}
        onClose={() => setModalSuppressionPhotoOuvert(false)}
        onConfirm={confirmerSuppressionPhoto}
        titre="Supprimer la photo de profil ?"
        message="Êtes-vous sûr de vouloir supprimer votre photo de profil ? Votre avatar sera réinitialisé."
        texteConfirmer="Oui, supprimer"
        texteAnnuler="Annuler"
        variante="danger"
        chargement={envoiPhoto}
      />
    </div>
  );
}

export default MonEspace;