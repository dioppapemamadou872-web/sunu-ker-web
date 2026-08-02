import { useEffect, useState } from 'react';
import {
  ClipboardList, Home, MessageSquare, RotateCcw, BarChart3, Users,
  CheckCircle2, XCircle, Clock, Building2, Trash2, Mail, Phone,
  SquarePen, Check, X, ListChecks,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL, API_BASE } from '../config';
import { secteurs, typesLogement } from '../data/logements';
import AdminLogin from './AdminLogin';

const onglets = [
  { id: 'stats', label: 'Statistiques', icon: BarChart3 },
  { id: 'attente', label: 'En attente', icon: ClipboardList },
  { id: 'gestion', label: 'Toutes les annonces', icon: ListChecks },
  { id: 'disponibilite', label: 'Disponibilité', icon: Home },
  { id: 'demandes', label: 'Demandes de contact', icon: MessageSquare },
  { id: 'proprietaires', label: 'Propriétaires', icon: Users },
];

const statutInfo = {
  en_attente: { label: 'En attente', couleur: 'var(--color-accent)' },
  validee: { label: 'Validée', couleur: 'var(--color-secondary)' },
  refusee: { label: 'Refusée', couleur: 'var(--color-error)' },
};

function Admin() {
  const { token, estConnecte, deconnecter } = useAuth();

  if (!estConnecte) {
    return <AdminLogin />;
  }

  return <AdminDashboard token={token} deconnecter={deconnecter} />;
}

function AdminDashboard({ token, deconnecter }) {
  const [ongletActif, setOngletActif] = useState('stats');
  const [logements, setLogements] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [stats, setStats] = useState(null);
  const [proprietaires, setProprietaires] = useState([]);
  const [chargement, setChargement] = useState(true);

  const [logementEnEdition, setLogementEnEdition] = useState(null);
  const [formEdition, setFormEdition] = useState({});
  const [erreurEdition, setErreurEdition] = useState('');

  async function charger() {
    const resLogements = await fetch(`${API_URL}/admin/logements`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resLogements.ok) {
      deconnecter();
      return;
    }

    setLogements(await resLogements.json());

    const resDemandes = await fetch(`${API_URL}/demandes`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resDemandes.ok) {
      deconnecter();
      return;
    }

    setDemandes(await resDemandes.json());

    const resStats = await fetch(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (resStats.ok) setStats(await resStats.json());

    const resProprietaires = await fetch(`${API_URL}/admin/proprietaires`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (resProprietaires.ok) setProprietaires(await resProprietaires.json());

    setChargement(false);
  }

  useEffect(() => {
    charger();
  }, []);

  async function validerLogement(id) {
    await fetch(`${API_URL}/logements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ statut: 'validee' }),
    });
    charger();
  }

  async function refuserLogement(id) {
    const motif = window.prompt('Motif du refus (visible par le propriétaire) :');
    if (motif === null) return;

    await fetch(`${API_URL}/logements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ statut: 'refusee', motifRefus: motif || 'Non précisé' }),
    });
    charger();
  }

  async function changerDisponibilite(id, disponibiliteActuelle) {
    const nouvelleDisponibilite = disponibiliteActuelle === 'disponible' ? 'loue' : 'disponible';
    await fetch(`${API_URL}/logements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ disponibilite: nouvelleDisponibilite }),
    });
    charger();
  }

  async function traiterDemande(id) {
    await fetch(`${API_URL}/demandes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ statut: 'traitee' }),
    });
    charger();
  }

  async function supprimerProprietaire(id, nomComplet) {
    const confirmation = window.confirm(
      `Supprimer définitivement le compte de ${nomComplet} ? Cela supprimera aussi toutes ses annonces. Cette action est irréversible.`
    );
    if (!confirmation) return;

    await fetch(`${API_URL}/admin/proprietaires/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    charger();
  }

  function ouvrirEdition(l) {
    setLogementEnEdition(l.id);
    setErreurEdition('');
    setFormEdition({
      titre: l.titre,
      secteur: l.secteur,
      type: l.type,
      prix: l.prix,
      chambres: l.chambres,
      salons: l.salons,
      description: l.description || '',
    });
  }

  function annulerEdition() {
    setLogementEnEdition(null);
    setErreurEdition('');
  }

  async function enregistrerEdition(id) {
    setErreurEdition('');

    if (!formEdition.titre || !formEdition.secteur || !formEdition.prix || Number(formEdition.prix) <= 0) {
      setErreurEdition('Merci de remplir correctement tous les champs obligatoires.');
      return;
    }

    const res = await fetch(`${API_URL}/logements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        titre: formEdition.titre,
        secteur: formEdition.secteur,
        type: formEdition.type,
        prix: Number(formEdition.prix),
        chambres: Math.max(0, Number(formEdition.chambres) || 0),
        salons: Math.max(0, Number(formEdition.salons) || 0),
        description: formEdition.description,
      }),
    });

    if (!res.ok) {
      setErreurEdition("Erreur lors de la modification");
      return;
    }

    setLogementEnEdition(null);
    charger();
  }

  async function supprimerLogementAdmin(id, titre) {
    const confirmation = window.confirm(`Supprimer définitivement l'annonce "${titre}" ? Cette action est irréversible.`);
    if (!confirmation) return;

    await fetch(`${API_URL}/logements/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    charger();
  }

  if (chargement) {
    return <p style={{ textAlign: 'center', padding: '40px' }}>Chargement...</p>;
  }

  const enAttente = logements.filter((l) => l.statut === 'en_attente');
  const validees = logements.filter((l) => l.statut === 'validee');
  const demandesNouvelles = demandes.filter((d) => d.statut === 'nouvelle');

  return (
    <div className="mon-espace">
      <div className="mon-espace-header">
        <div>
          <h2 style={{ margin: 0 }}>Administration SunuKeur</h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Tableau de bord</p>
        </div>
        <button className="btn-secondary" onClick={deconnecter}>Se déconnecter</button>
      </div>

      <div className="mon-espace-tabs">
        {onglets.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`mon-espace-tab ${ongletActif === id ? 'active' : ''}`}
            onClick={() => setOngletActif(id)}
          >
            <Icon size={17} />
            {label}
            {id === 'attente' && enAttente.length > 0 && <span className="tab-badge">{enAttente.length}</span>}
            {id === 'demandes' && demandesNouvelles.length > 0 && <span className="tab-badge">{demandesNouvelles.length}</span>}
          </button>
        ))}
      </div>

      {ongletActif === 'stats' && stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
              <Building2 size={22} />
            </div>
            <div>
              <p className="stat-value">{stats.totalLogements}</p>
              <p className="stat-label">Annonces au total</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)', color: 'var(--color-accent)' }}>
              <Clock size={22} />
            </div>
            <div>
              <p className="stat-value">{stats.enAttente}</p>
              <p className="stat-label">En attente de validation</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'color-mix(in srgb, var(--color-secondary) 15%, transparent)', color: 'var(--color-secondary)' }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="stat-value">{stats.validees}</p>
              <p className="stat-label">Annonces validées</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'color-mix(in srgb, var(--color-error) 15%, transparent)', color: 'var(--color-error)' }}>
              <XCircle size={22} />
            </div>
            <div>
              <p className="stat-value">{stats.refusees}</p>
              <p className="stat-label">Annonces refusées</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
              <Users size={22} />
            </div>
            <div>
              <p className="stat-value">{stats.totalProprietaires}</p>
              <p className="stat-label">Propriétaires inscrits</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)', color: 'var(--color-accent)' }}>
              <MessageSquare size={22} />
            </div>
            <div>
              <p className="stat-value">{stats.demandesNouvelles}</p>
              <p className="stat-label">Demandes à traiter</p>
            </div>
          </div>
        </div>
      )}

      {ongletActif === 'attente' && (
        <div className="card">
          <h2>Annonces en attente de validation</h2>
          {enAttente.length === 0 ? (
            <p>Aucune annonce en attente.</p>
          ) : (
            enAttente.map((l) => (
              <div key={l.id} className="admin-annonce-block">
                <div>
                  <h3>{l.titre}</h3>
                  <p>{l.secteur} — {l.type} — {l.prix.toLocaleString()} FCFA</p>
                  <p>{l.description}</p>
                  <p><strong>Tél. propriétaire :</strong> {l.telephoneProprietaire}</p>
                  {l.whatsappProprietaire && l.whatsappProprietaire !== l.telephoneProprietaire && (
                    <p><strong>WhatsApp :</strong> {l.whatsappProprietaire}</p>
                  )}
                  <p style={{ fontSize: '0.85rem' }}>
                    <strong>Statut :</strong> {
                      { proprietaire: 'Propriétaire', mandataire: 'Mandataire', famille: 'Membre de la famille autorisé' }[l.statutDeclarant] || 'Non précisé'
                    } — <span style={{ color: 'var(--color-secondary)' }}>✓ Déclaration sur l'honneur signée</span>
                  </p>
                </div>
                <div className="admin-actions">
                  <button className="btn-primary" onClick={() => validerLogement(l.id)}>Valider</button>
                  <button className="btn-secondary" onClick={() => refuserLogement(l.id)}>Refuser</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {ongletActif === 'gestion' && (
        <div className="card">
          <h2>Toutes les annonces</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '-8px' }}>
            Seule l'équipe SunuKeur peut modifier ou supprimer une annonce, quel que soit son statut.
          </p>

          {logements.length === 0 ? (
            <p>Aucune annonce pour l'instant.</p>
          ) : (
            logements.map((l) => (
              <div key={l.id} className="admin-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                {logementEnEdition === l.id ? (
                  <div style={{ width: '100%' }}>
                    <div className="form-group">
                      <label>Titre</label>
                      <input
                        type="text"
                        value={formEdition.titre}
                        onChange={(e) => setFormEdition((f) => ({ ...f, titre: e.target.value }))}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Secteur</label>
                        <select value={formEdition.secteur} onChange={(e) => setFormEdition((f) => ({ ...f, secteur: e.target.value }))}>
                          {secteurs.map((s) => (<option key={s} value={s}>{s}</option>))}
                        </select>
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Type</label>
                        <select value={formEdition.type} onChange={(e) => setFormEdition((f) => ({ ...f, type: e.target.value }))}>
                          {typesLogement.map((t) => (<option key={t} value={t}>{t}</option>))}
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Prix (FCFA)</label>
                      <input
                        type="number"
                        value={formEdition.prix}
                        onChange={(e) => setFormEdition((f) => ({ ...f, prix: e.target.value }))}
                        onWheel={(e) => e.target.blur()}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Chambres</label>
                        <input
                          type="number"
                          min="0"
                          value={formEdition.chambres}
                          onChange={(e) => setFormEdition((f) => ({ ...f, chambres: e.target.value }))}
                          onWheel={(e) => e.target.blur()}
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Salons</label>
                        <input
                          type="number"
                          min="0"
                          value={formEdition.salons}
                          onChange={(e) => setFormEdition((f) => ({ ...f, salons: e.target.value }))}
                          onWheel={(e) => e.target.blur()}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={formEdition.description}
                        onChange={(e) => setFormEdition((f) => ({ ...f, description: e.target.value }))}
                      />
                    </div>

                    {erreurEdition && <p style={{ fontSize: '0.85rem', color: 'var(--color-error)' }}>{erreurEdition}</p>}

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-primary" onClick={() => enregistrerEdition(l.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={16} /> Enregistrer
                      </button>
                      <button className="btn-secondary" onClick={annulerEdition} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <X size={16} /> Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px' }}>{l.titre}</h3>
                      <p style={{ margin: '0 0 4px' }}>{l.secteur} — {l.prix.toLocaleString()} FCFA</p>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: statutInfo[l.statut]?.couleur }}>
                        {statutInfo[l.statut]?.label}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="icon-btn icon-btn-edit" onClick={() => ouvrirEdition(l)} aria-label="Modifier l'annonce">
                        <SquarePen size={17} />
                      </button>
                      <button className="icon-btn icon-btn-delete" onClick={() => supprimerLogementAdmin(l.id, l.titre)} aria-label="Supprimer l'annonce">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {ongletActif === 'disponibilite' && (
        <div className="card">
          <h2>Logements validés — Disponibilité</h2>
          {validees.length === 0 ? (
            <p>Aucun logement validé pour l'instant.</p>
          ) : (
            validees.map((l) => (
              <div key={l.id} className="admin-row">
                <div>
                  <h3 style={{ margin: '0 0 4px' }}>{l.titre}</h3>
                  <p style={{ margin: '0 0 4px' }}>{l.secteur} — {l.prix.toLocaleString()} FCFA</p>
                  <p style={{ margin: 0, fontWeight: 600, color: l.disponibilite === 'loue' ? 'var(--color-accent)' : 'var(--color-secondary)' }}>
                    {l.disponibilite === 'loue' ? 'Loué' : 'Disponible'}
                  </p>
                </div>
                <div className="admin-actions">
                  <button
                    className="btn-primary"
                    onClick={() => changerDisponibilite(l.id, l.disponibilite)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {l.disponibilite === 'loue' ? <RotateCcw size={16} /> : <Home size={16} />}
                    {l.disponibilite === 'loue' ? 'Remettre disponible' : 'Marquer comme loué'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {ongletActif === 'demandes' && (
        <div className="card">
          <h2>Demandes de contact à traiter</h2>
          {demandesNouvelles.length === 0 ? (
            <p>Aucune demande en attente.</p>
          ) : (
            demandesNouvelles.map((d) => {
              const logement = logements.find((l) => l.id === d.logementId);
              return (
                <div key={d.id} className="admin-row">
                  <div>
                    <h3>{d.logementTitre}</h3>
                    <p><strong>Chercheur :</strong> {d.nom} — {d.telephone}</p>
                    <p><strong>Propriétaire à contacter :</strong> {logement?.telephoneProprietaire}</p>
                    {logement?.whatsappProprietaire && logement.whatsappProprietaire !== logement.telephoneProprietaire && (
                      <p><strong>WhatsApp propriétaire :</strong> {logement.whatsappProprietaire}</p>
                    )}
                  </div>
                  <div className="admin-actions">
                    <button className="btn-primary" onClick={() => traiterDemande(d.id)}>
                      Marquer comme traitée
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {ongletActif === 'proprietaires' && (
        <div className="card">
          <h2>Propriétaires inscrits ({proprietaires.length})</h2>
          {proprietaires.length === 0 ? (
            <p>Aucun propriétaire inscrit pour l'instant.</p>
          ) : (
            proprietaires.map((p) => (
              <div key={p.id} className="admin-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="avatar-preview" style={{ width: '44px', height: '44px' }}>
                    {p.photoProfil ? (
                      <img src={`${API_BASE}${p.photoProfil}`} alt={p.prenom} />
                    ) : (
                      <Users size={20} />
                    )}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px' }}>{p.prenom} {p.nom}</h3>
                    <p style={{ margin: '0 0 2px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Phone size={13} /> {p.telephone}
                    </p>
                    {p.email && (
                      <p style={{ margin: '0 0 2px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Mail size={13} /> {p.email}
                      </p>
                    )}
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      {p.nombreAnnonces} annonce{p.nombreAnnonces !== 1 ? 's' : ''} publiée{p.nombreAnnonces !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="admin-actions">
                  <button
                    className="icon-btn icon-btn-delete"
                    onClick={() => supprimerProprietaire(p.id, `${p.prenom} ${p.nom}`)}
                    aria-label="Supprimer ce compte"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Admin;