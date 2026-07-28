import { useEffect, useState } from 'react';
import { ClipboardList, Home, MessageSquare, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import AdminLogin from './AdminLogin';

const onglets = [
  { id: 'attente', label: 'En attente', icon: ClipboardList },
  { id: 'disponibilite', label: 'Disponibilité', icon: Home },
  { id: 'demandes', label: 'Demandes de contact', icon: MessageSquare },
];

function Admin() {
  const { token, estConnecte, deconnecter } = useAuth();

  if (!estConnecte) {
    return <AdminLogin />;
  }

  return <AdminDashboard token={token} deconnecter={deconnecter} />;
}

function AdminDashboard({ token, deconnecter }) {
  const [ongletActif, setOngletActif] = useState('attente');
  const [logements, setLogements] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [chargement, setChargement] = useState(true);

  async function charger() {
    const resLogements = await fetch(`${API_URL}/logements`);
    setLogements(await resLogements.json());

    const resDemandes = await fetch(`${API_URL}/demandes`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resDemandes.ok) {
      deconnecter();
      return;
    }

    setDemandes(await resDemandes.json());
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

      {ongletActif === 'attente' && (
        <div className="card">
          <h2>Annonces en attente de validation</h2>
          {enAttente.length === 0 ? (
            <p>Aucune annonce en attente.</p>
          ) : (
            enAttente.map((l) => (
              <div key={l.id} className="admin-row">
                <div>
                  <h3>{l.titre}</h3>
                  <p>{l.secteur} — {l.type} — {l.prix.toLocaleString()} FCFA</p>
                  <p>{l.description}</p>
                  <p><strong>Tél. propriétaire :</strong> {l.telephoneProprietaire}</p>
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
    </div>
  );
}

export default Admin;