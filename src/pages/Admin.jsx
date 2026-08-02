import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ClipboardList, Home, MessageSquare, RotateCcw, BarChart3, Users,
  CheckCircle2, XCircle, Clock, Building2, Trash2, Mail, Phone,
  SquarePen, Check, X, ListChecks, Search, RefreshCw, MessageCircle,
  ExternalLink, ShieldCheck, AlertTriangle, Filter, Eye, ChevronRight, Menu, LogOut,
  Sparkles, SlidersHorizontal, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL, API_BASE } from '../config';
import { secteurs, typesLogement } from '../data/logements';
import AdminLogin from './AdminLogin';
import logoIcon from '../assets/logo-icon.png';

const groupesMenu = [
  {
    titre: "Vue d'ensemble",
    items: [
      { id: 'stats', label: 'Statistiques & Bilan', icon: BarChart3 },
    ]
  },
  {
    titre: "Modération & Biens",
    items: [
      { id: 'attente', label: 'En attente de validation', icon: ClipboardList, badgeKey: 'attente', badgeStyle: 'amber' },
      { id: 'gestion', label: 'Toutes les annonces', icon: ListChecks },
      { id: 'disponibilite', label: 'Gestion des disponibilités', icon: Home },
    ]
  },
  {
    titre: "Relations & Utilisateurs",
    items: [
      { id: 'demandes', label: 'Demandes de contact', icon: MessageSquare, badgeKey: 'demandes', badgeStyle: 'blue' },
      { id: 'proprietaires', label: 'Comptes Propriétaires', icon: Users },
    ]
  }
];

const onglets = groupesMenu.flatMap((g) => g.items);

const statutBadge = {
  en_attente: { label: 'En attente', classe: 'badge-warning', icon: Clock, bg: 'color-mix(in srgb, var(--color-accent) 12%, transparent)', color: 'var(--color-accent)' },
  validee: { label: 'Validée', classe: 'badge-success', icon: CheckCircle2, bg: 'color-mix(in srgb, var(--color-secondary) 12%, transparent)', color: 'var(--color-secondary)' },
  refusee: { label: 'Refusée', classe: 'badge-danger', icon: XCircle, bg: 'color-mix(in srgb, var(--color-error) 12%, transparent)', color: 'var(--color-error)' },
};

function Admin() {
  const { token, estConnecte, deconnecter } = useAuth();

  if (!estConnecte) {
    return <AdminLogin />;
  }

  return <AdminDashboard token={token} deconnecter={deconnecter} />;
}

function AdminDashboard({ token, deconnecter }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionParam = searchParams.get('section') || 'stats';

  const [ongletActif, setOngletActif] = useState(sectionParam);
  const [sidebarMobileOuverte, setSidebarMobileOuverte] = useState(false);
  const [logements, setLogements] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [stats, setStats] = useState(null);
  const [proprietaires, setProprietaires] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [rafraichissant, setRafraichissant] = useState(false);

  // Recherche & Filtres
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [filtreSecteur, setFiltreSecteur] = useState('');

  // Modales
  const [logementEnEdition, setLogementEnEdition] = useState(null);
  const [formEdition, setFormEdition] = useState({});
  const [erreurEdition, setErreurEdition] = useState('');

  const [modalRefus, setModalRefus] = useState(null);
  const [motifRefus, setMotifRefus] = useState('');

  const [modalSuppr, setModalSuppr] = useState(null);

  useEffect(() => {
    if (sectionParam && ongletActif !== sectionParam) {
      setOngletActif(sectionParam);
    }
  }, [sectionParam]);

  function changerOnglet(id) {
    setOngletActif(id);
    setSearchParams({ section: id });
    setSidebarMobileOuverte(false);
  }

  async function charger(silencieux = false) {
    if (!silencieux) setChargement(true);
    setRafraichissant(true);
    try {
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
      if (resDemandes.ok) setDemandes(await resDemandes.json());

      const resStats = await fetch(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resStats.ok) setStats(await resStats.json());

      const resProprietaires = await fetch(`${API_URL}/admin/proprietaires`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resProprietaires.ok) setProprietaires(await resProprietaires.json());
    } catch (e) {
      console.error(e);
    } finally {
      setChargement(false);
      setRafraichissant(false);
    }
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
    charger(true);
  }

  function ouvrirModalRefus(logement) {
    setModalRefus(logement);
    setMotifRefus('');
  }

  async function confirmerRefus() {
    if (!modalRefus) return;
    await fetch(`${API_URL}/logements/${modalRefus.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ statut: 'refusee', motifRefus: motifRefus.trim() || 'Non précisé par l\'administration' }),
    });
    setModalRefus(null);
    setMotifRefus('');
    charger(true);
  }

  async function changerDisponibilite(id, disponibiliteActuelle) {
    const nouvelleDisponibilite = disponibiliteActuelle === 'disponible' ? 'loue' : 'disponible';
    await fetch(`${API_URL}/logements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ disponibilite: nouvelleDisponibilite }),
    });
    charger(true);
  }

  async function traiterDemande(id) {
    await fetch(`${API_URL}/demandes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ statut: 'traitee' }),
    });
    charger(true);
  }

  function ouvrirModalSuppression(type, id, nom) {
    setModalSuppr({ type, id, nom });
  }

  async function confirmerSuppression() {
    if (!modalSuppr) return;
    if (modalSuppr.type === 'logement') {
      await fetch(`${API_URL}/logements/${modalSuppr.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } else if (modalSuppr.type === 'proprietaire') {
      await fetch(`${API_URL}/admin/proprietaires/${modalSuppr.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setModalSuppr(null);
    charger(true);
  }

  function ouvrirEdition(l) {
    setLogementEnEdition(l);
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
      setErreurEdition('Veuillez remplir correctement tous les champs obligatoires.');
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
      setErreurEdition("Une erreur s'est produite lors de la sauvegarde.");
      return;
    }

    setLogementEnEdition(null);
    charger(true);
  }

  const logementsAttente = logements.filter((l) => l.statut === 'en_attente');
  const demandesNouvelles = demandes.filter((d) => d.statut === 'nouvelle');

  const badgesCount = {
    attente: logementsAttente.length,
    demandes: demandesNouvelles.length,
  };

  const logementsFiltres = logements.filter((l) => {
    if (filtreStatut !== 'tous' && l.statut !== filtreStatut) return false;
    if (filtreSecteur && l.secteur !== filtreSecteur) return false;
    if (recherche.trim()) {
      const q = recherche.toLowerCase();
      const matchTitre = l.titre?.toLowerCase().includes(q);
      const matchSecteur = l.secteur?.toLowerCase().includes(q);
      const matchProprio = `${l.proprietairePrenom || ''} ${l.proprietaireNom || ''}`.toLowerCase().includes(q);
      if (!matchTitre && !matchSecteur && !matchProprio) return false;
    }
    return true;
  });

  return (
    <div className="admin-console-layout">
      {/* SIDEBAR NAVIGATION */}
      <aside className={`admin-console-sidebar ${sidebarMobileOuverte ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand-header">
          <img src={logoIcon} alt="SunuKeur" className="sidebar-logo-img" />
          <div>
            <span className="sidebar-brand-title">SunuKeur</span>
            <span className="sidebar-brand-badge">Console Admin</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          {groupesMenu.map((groupe) => (
            <div key={groupe.titre} className="sidebar-group">
              <span className="sidebar-group-title">{groupe.titre}</span>
              {groupe.items.map(({ id, label, icon: Icon, badgeKey, badgeStyle }) => {
                const count = badgeKey ? badgesCount[badgeKey] : 0;
                const estActif = ongletActif === id;

                return (
                  <button
                    key={id}
                    className={`sidebar-nav-item ${estActif ? 'active' : ''}`}
                    onClick={() => changerOnglet(id)}
                  >
                    <Icon size={18} className="sidebar-nav-icon" />
                    <span>{label}</span>
                    {count > 0 && (
                      <span className={`sidebar-pill-badge ${badgeStyle || ''}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer-user">
          <div className="sidebar-user-avatar">
            <ShieldCheck size={18} />
          </div>
          <div className="sidebar-user-info">
            <strong>Administrateur</strong>
            <span>Accès Système Superviseur</span>
          </div>
          <button className="sidebar-btn-logout" onClick={deconnecter} title="Déconnexion admin">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <main className="admin-console-main">
        {/* TOP BAR */}
        <header className="admin-topbar">
          <button className="mobile-toggle-btn" onClick={() => setSidebarMobileOuverte((o) => !o)}>
            <Menu size={20} />
          </button>

          <div className="topbar-page-title">
            <h2>{onglets.find((o) => o.id === ongletActif)?.label || 'Administration'}</h2>
            <span className="topbar-subtitle">Plateforme de modération et gestion SunuKeur</span>
          </div>

          <div className="topbar-actions">
            <button
              className={`topbar-btn-refresh ${rafraichissant ? 'spinning' : ''}`}
              onClick={() => charger(true)}
              title="Actualiser les données"
            >
              <RefreshCw size={16} />
              <span className="desktop-text">Actualiser</span>
            </button>
          </div>
        </header>

        {/* DASHBOARD VIEW CONTENT */}
        <div className="admin-console-body">
          {/* ONGLET 1 : STATISTIQUES */}
          {ongletActif === 'stats' && (
            <div className="admin-view-stats">
              <div className="stats-cards-grid">
                <div className="admin-stat-card primary">
                  <div className="stat-card-icon-box">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <span className="stat-card-value">{stats?.totalLogements || 0}</span>
                    <span className="stat-card-label">Logements soumis</span>
                  </div>
                </div>

                <div className="admin-stat-card success">
                  <div className="stat-card-icon-box">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <span className="stat-card-value">{stats?.validees || 0}</span>
                    <span className="stat-card-label">Annonces validées (En ligne)</span>
                  </div>
                </div>

                <div className="admin-stat-card warning">
                  <div className="stat-card-icon-box">
                    <Clock size={24} />
                  </div>
                  <div>
                    <span className="stat-card-value">{stats?.enAttente || 0}</span>
                    <span className="stat-card-label">En attente de modération</span>
                  </div>
                </div>

                <div className="admin-stat-card info">
                  <div className="stat-card-icon-box">
                    <Users size={24} />
                  </div>
                  <div>
                    <span className="stat-card-value">{stats?.totalProprietaires || 0}</span>
                    <span className="stat-card-label">Bailleurs inscrits</span>
                  </div>
                </div>
              </div>

              <div className="admin-grid-2-col" style={{ marginTop: '24px' }}>
                <div className="card admin-panel">
                  <h3>Répartition des statuts d'annonces</h3>
                  <div className="repartition-list">
                    <div className="repartition-row">
                      <span className="repartition-label"><CheckCircle2 size={15} style={{ color: 'var(--color-secondary)' }} /> Validées en ligne</span>
                      <strong className="repartition-val">{stats?.validees || 0}</strong>
                    </div>
                    <div className="repartition-row">
                      <span className="repartition-label"><Clock size={15} style={{ color: 'var(--color-accent)' }} /> En attente de contrôle</span>
                      <strong className="repartition-val">{stats?.enAttente || 0}</strong>
                    </div>
                    <div className="repartition-row">
                      <span className="repartition-label"><XCircle size={15} style={{ color: 'var(--color-error)' }} /> Refusées</span>
                      <strong className="repartition-val">{stats?.refusees || 0}</strong>
                    </div>
                  </div>
                </div>

                <div className="card admin-panel">
                  <h3>Secteurs les plus demandés à Dakar</h3>
                  {stats?.topSecteurs && stats.topSecteurs.length > 0 ? (
                    <div className="repartition-list">
                      {stats.topSecteurs.map((s, idx) => (
                        <div key={s.secteur} className="repartition-row">
                          <span className="repartition-label">#{idx + 1} {s.secteur}</span>
                          <strong className="repartition-val">{s.total} demande{s.total > 1 ? 's' : ''}</strong>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Aucune donnée disponible.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 2 : EN ATTENTE */}
          {ongletActif === 'attente' && (
            <div className="card admin-panel">
              <div className="panel-header-row">
                <div>
                  <h3>File d'attente de modération ({logementsAttente.length})</h3>
                  <p className="panel-subtext">Examinez et validez les annonces soumises avant mise en ligne publique.</p>
                </div>
              </div>

              {logementsAttente.length === 0 ? (
                <div className="admin-empty-state">
                  <CheckCircle2 size={44} style={{ color: 'var(--color-secondary)' }} />
                  <h4>Aucune annonce en attente !</h4>
                  <p>Toutes les annonces soumises par les propriétaires ont été modérées.</p>
                </div>
              ) : (
                <div className="admin-cards-list">
                  {logementsAttente.map((l) => {
                    const photo = l.photos && l.photos.length > 0 ? `${API_BASE}${l.photos[0]}` : null;

                    return (
                      <div key={l.id} className="admin-moderation-card">
                        {photo ? (
                          <div className="moderation-thumb" style={{ backgroundImage: `url(${photo})` }} />
                        ) : (
                          <div className="moderation-thumb-placeholder"><Building2 size={24} /></div>
                        )}

                        <div className="moderation-card-body">
                          <div className="moderation-card-top">
                            <h4>{l.titre}</h4>
                            <span className="price-tag-v2">{l.prix?.toLocaleString()} FCFA / mois</span>
                          </div>

                          <p className="moderation-meta">
                            <span>{l.secteur}</span> • <span>{l.type}</span> • <span>{l.chambres} ch. / {l.salons} sal.</span>
                          </p>

                          <div className="moderation-owner-box">
                            <span>Bailleur : <strong>{l.proprietairePrenom} {l.proprietaireNom}</strong> ({l.proprietaireTelephone})</span>
                          </div>

                          {l.description && <p className="moderation-description">"{l.description}"</p>}

                          <div className="moderation-actions-bar">
                            <button className="btn-success-sm" onClick={() => validerLogement(l.id)}>
                              <Check size={16} /> Valider l'annonce
                            </button>
                            <button className="btn-danger-sm" onClick={() => ouvrirModalRefus(l)}>
                              <X size={16} /> Refuser
                            </button>
                            <button className="btn-secondary-sm" onClick={() => ouvrirEdition(l)}>
                              <SquarePen size={15} /> Modifier
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ONGLET 3 : TOUTES LES ANNONCES */}
          {ongletActif === 'gestion' && (
            <div className="card admin-panel">
              <div className="panel-header-row">
                <div>
                  <h3>Catalogue général des annonces ({logementsFiltres.length})</h3>
                  <p className="panel-subtext">Consultez, modifiez ou supprimez n'importe quelle annonce de la base.</p>
                </div>
              </div>

              {/* FILTRES BAR */}
              <div className="admin-filters-bar">
                <div className="admin-search-input-box">
                  <Search size={16} style={{ color: 'var(--color-text-muted)' }} />
                  <input
                    type="text"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    placeholder="Rechercher par titre, quartier ou bailleur..."
                  />
                </div>

                <div className="admin-filter-select">
                  <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}>
                    <option value="tous">Tous les statuts</option>
                    <option value="validee">Validées</option>
                    <option value="en_attente">En attente</option>
                    <option value="refusee">Refusées</option>
                  </select>
                </div>

                <div className="admin-filter-select">
                  <select value={filtreSecteur} onChange={(e) => setFiltreSecteur(e.target.value)}>
                    <option value="">Tous les secteurs</option>
                    {secteurs.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
              </div>

              {/* TABLE */}
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Titre & Secteur</th>
                      <th>Type</th>
                      <th>Prix</th>
                      <th>Bailleur</th>
                      <th>Statut</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logementsFiltres.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                          Aucune annonce ne correspond aux filtres.
                        </td>
                      </tr>
                    ) : (
                      logementsFiltres.map((l) => {
                        const BadgeIcon = statutBadge[l.statut]?.icon || Clock;

                        return (
                          <tr key={l.id}>
                            <td>
                              <strong>{l.titre}</strong>
                              <span className="td-sub">{l.secteur}</span>
                            </td>
                            <td>{l.type}</td>
                            <td><strong>{l.prix?.toLocaleString()} FCFA</strong></td>
                            <td>{l.proprietairePrenom} {l.proprietaireNom}</td>
                            <td>
                              <span className="statut-pill-v2" style={{ color: statutBadge[l.statut]?.color, background: statutBadge[l.statut]?.bg }}>
                                <BadgeIcon size={12} /> {statutBadge[l.statut]?.label}
                              </span>
                            </td>
                            <td>
                              <div className="td-actions-right">
                                {l.statut === 'en_attente' && (
                                  <button className="btn-icon-v2 success" onClick={() => validerLogement(l.id)} title="Valider">
                                    <Check size={15} />
                                  </button>
                                )}
                                <button className="btn-icon-v2" onClick={() => ouvrirEdition(l)} title="Modifier">
                                  <SquarePen size={15} />
                                </button>
                                <button className="btn-icon-v2 danger" onClick={() => ouvrirModalSuppression('logement', l.id, l.titre)} title="Supprimer">
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ONGLET 4 : DISPONIBILITÉ */}
          {ongletActif === 'disponibilite' && (
            <div className="card admin-panel">
              <h3>Gestion directe des disponibilités</h3>
              <p className="panel-subtext">Basculez rapidement l'état d'un logement validé entre "Disponible" et "Loué".</p>

              <div className="admin-dispo-grid">
                {logements.filter((l) => l.statut === 'validee').map((l) => {
                  const estLoue = l.disponibilite === 'loue';

                  return (
                    <div key={l.id} className="dispo-card-v2">
                      <div className="dispo-card-header">
                        <h4>{l.titre}</h4>
                        <span>{l.secteur}</span>
                      </div>
                      <div className="dispo-card-body">
                        <span className={`dispo-status-badge ${estLoue ? 'loue' : 'disponible'}`}>
                          {estLoue ? 'Loué' : 'Disponible'}
                        </span>
                        <button
                          className={`btn-toggle-dispo ${estLoue ? 'to-dispo' : 'to-loue'}`}
                          onClick={() => changerDisponibilite(l.id, l.disponibilite)}
                        >
                          Marquer comme {estLoue ? 'Disponible' : 'Loué'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ONGLET 5 : DEMANDES DE CONTACT */}
          {ongletActif === 'demandes' && (
            <div className="card admin-panel">
              <h3>Demandes de contact reçues ({demandes.length})</h3>
              <p className="panel-subtext">Mises en relation locataires - propriétaires générées par la plateforme.</p>

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Locataire</th>
                      <th>Téléphone</th>
                      <th>Annonce visée</th>
                      <th>Date</th>
                      <th>Statut</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demandes.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                          Aucune demande de contact reçue pour le moment.
                        </td>
                      </tr>
                    ) : (
                      demandes.map((d) => (
                        <tr key={d.id}>
                          <td>
                            <strong>{d.nom}</strong>
                            {d.email && <span className="td-sub">{d.email}</span>}
                          </td>
                          <td>
                            <a href={`tel:${d.telephone}`} className="td-link"><Phone size={13} /> {d.telephone}</a>
                          </td>
                          <td><strong>{d.logementTitre}</strong> ({d.secteur})</td>
                          <td>{new Date(d.dateCreation).toLocaleDateString('fr-FR')}</td>
                          <td>
                            <span className={`statut-pill-v2 ${d.statut === 'nouvelle' ? 'warning' : 'success'}`}>
                              {d.statut === 'nouvelle' ? 'Nouvelle' : 'Traitée'}
                            </span>
                          </td>
                          <td>
                            <div className="td-actions-right">
                              <a href={`https://wa.me/221${d.telephone}`} target="_blank" rel="noreferrer" className="btn-icon-v2 whatsapp" title="Ouvrir WhatsApp">
                                <MessageCircle size={15} />
                              </a>
                              {d.statut === 'nouvelle' && (
                                <button className="btn-icon-v2 success" onClick={() => traiterDemande(d.id)} title="Marquer comme traitée">
                                  <Check size={15} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ONGLET 6 : PROPRIÉTAIRES */}
          {ongletActif === 'proprietaires' && (
            <div className="card admin-panel">
              <h3>Comptes propriétaires enregistrés ({proprietaires.length})</h3>
              <p className="panel-subtext">Liste de tous les bailleurs disposant d'un compte sur SunuKeur.</p>

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Bailleur</th>
                      <th>Téléphone / WhatsApp</th>
                      <th>Email</th>
                      <th>Date d'inscription</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proprietaires.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                          Aucun propriétaire inscrit.
                        </td>
                      </tr>
                    ) : (
                      proprietaires.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div className="td-avatar">
                                {p.photoProfil ? <img src={`${API_BASE}${p.photoProfil}`} alt="" /> : <Users size={16} />}
                              </div>
                              <strong>{p.prenom} {p.nom}</strong>
                            </div>
                          </td>
                          <td>{p.telephone}</td>
                          <td>{p.email || '—'}</td>
                          <td>{new Date(p.dateCreation).toLocaleDateString('fr-FR')}</td>
                          <td>
                            <div className="td-actions-right">
                              <button className="btn-icon-v2 danger" onClick={() => ouvrirModalSuppression('proprietaire', p.id, `${p.prenom} ${p.nom}`)} title="Supprimer le compte">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODALE EDITION */}
      {logementEnEdition && (
        <div className="modal-backdrop-v2">
          <div className="modal-card-v2">
            <div className="modal-header">
              <h4>Modifier l'annonce</h4>
              <button onClick={annulerEdition} className="btn-close-modal"><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Titre de l'annonce</label>
                <input
                  type="text"
                  value={formEdition.titre}
                  onChange={(e) => setFormEdition((f) => ({ ...f, titre: e.target.value }))}
                />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Secteur</label>
                  <select value={formEdition.secteur} onChange={(e) => setFormEdition((f) => ({ ...f, secteur: e.target.value }))}>
                    {secteurs.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select value={formEdition.type} onChange={(e) => setFormEdition((f) => ({ ...f, type: e.target.value }))}>
                    {typesLogement.map((t) => (<option key={t} value={t}>{t}</option>))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Prix mensuel (FCFA)</label>
                <input
                  type="number"
                  value={formEdition.prix}
                  onChange={(e) => setFormEdition((f) => ({ ...f, prix: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={4}
                  value={formEdition.description}
                  onChange={(e) => setFormEdition((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              {erreurEdition && <p className="alert-error-msg">{erreurEdition}</p>}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={annulerEdition}>Annuler</button>
              <button className="btn-primary" onClick={() => enregistrerEdition(logementEnEdition.id)}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE REFUS */}
      {modalRefus && (
        <div className="modal-backdrop-v2">
          <div className="modal-card-v2">
            <div className="modal-header">
              <h4>Motif de refus de l'annonce</h4>
              <button onClick={() => setModalRefus(null)} className="btn-close-modal"><X size={18} /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: '0 0 12px' }}>
                Expliquez au propriétaire la raison du refus de l'annonce <strong>"{modalRefus.titre}"</strong> :
              </p>
              <textarea
                rows={4}
                value={motifRefus}
                onChange={(e) => setMotifRefus(e.target.value)}
                placeholder="Ex: Photos floues, prix manquant, description incomplète..."
              />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setModalRefus(null)}>Annuler</button>
              <button className="btn-danger-sm" onClick={confirmerRefus}>Confirmer le refus</button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE SUPPRESSION */}
      {modalSuppr && (
        <div className="modal-backdrop-v2">
          <div className="modal-card-v2">
            <div className="modal-header">
              <h4>Confirmation de suppression</h4>
              <button onClick={() => setModalSuppr(null)} className="btn-close-modal"><X size={18} /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.95rem', margin: 0 }}>
                Êtes-vous sûr de vouloir supprimer définitivement {modalSuppr.type === 'logement' ? 'l\'annonce' : 'le compte'} <strong>"{modalSuppr.nom}"</strong> ?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setModalSuppr(null)}>Annuler</button>
              <button className="btn-danger-sm" onClick={confirmerSuppression}>Supprimer définitivement</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;