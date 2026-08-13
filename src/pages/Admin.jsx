import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardCheck, Building2, Users, MessageSquare,
  CheckCircle2, XCircle, Clock, Trash2, Mail, Phone, SquarePen,
  Check, X, Search, MessageCircle, RotateCcw, ShieldCheck, AlertCircle,
  Filter, Eye, ChevronRight, SlidersHorizontal, ArrowUpRight, Sparkles,
  TrendingUp, Home, ChevronDown, CheckSquare, Layers, Activity, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL, API_BASE } from '../config';
import { secteurs, typesLogement } from '../data/logements';
import AdminLogin from './AdminLogin';

const navigationGroups = [
  {
    title: "VUE D'ENSEMBLE",
    items: [
      { id: 'stats', label: 'Tableau de bord', icon: LayoutDashboard },
    ]
  },
  {
    title: "GESTION & MODÉRATION",
    items: [
      { id: 'attente', label: 'File de modération', icon: ClipboardCheck, badgeKey: 'attente', badgeVariant: 'warning' },
      { id: 'gestion', label: 'Toutes les annonces', icon: Building2 },
      { id: 'disponibilite', label: 'Disponibilités', icon: Layers },
    ]
  },
  {
    title: "UTILISATEURS & LEADS",
    items: [
      { id: 'demandes', label: 'Demandes de contact', icon: MessageSquare, badgeKey: 'demandes', badgeVariant: 'primary' },
      { id: 'alertes', label: 'Alertes Recherche', icon: Bell, badgeKey: 'alertes', badgeVariant: 'warning' },
      { id: 'proprietaires', label: 'Comptes Bailleurs', icon: Users },
    ]
  }
];

const allNavItems = navigationGroups.flatMap((g) => g.items);

const statutConfig = {
  en_attente: { label: 'En attente', icon: Clock, className: 'status-pill-warning' },
  validee: { label: 'En ligne', icon: CheckCircle2, className: 'status-pill-success' },
  refusee: { label: 'Refusée', icon: XCircle, className: 'status-pill-danger' },
};

function Admin() {
  const { token, estConnecte, deconnecter } = useAuth();

  if (!estConnecte) {
    return <AdminLogin />;
  }

  return <AdminSaaSConsole token={token} deconnecter={deconnecter} />;
}

function AdminSaaSConsole({ token, deconnecter }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSectionParam = searchParams.get('section') || 'stats';

  const [activeSection, setActiveSection] = useState(activeSectionParam);
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  const [logements, setLogements] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [stats, setStats] = useState(null);
  const [proprietaires, setProprietaires] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [sectorFilter, setSectorFilter] = useState('');

  // Modals
  const [editingLogement, setEditingLogement] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editError, setEditError] = useState('');

  const [refuseModalLogement, setRefuseModalLogement] = useState(null);
  const [refuseReason, setRefuseReason] = useState('');

  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    if (activeSectionParam && activeSection !== activeSectionParam) {
      setActiveSection(activeSectionParam);
    }
  }, [activeSectionParam]);

  function navigateToSection(id) {
    setActiveSection(id);
    setSearchParams({ section: id });
    setSidebarOpenMobile(false);
  }

  async function loadData(silent = false) {
    if (!silent) setLoading(true);
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

      const resAlertes = await fetch(`${API_BASE}/api/alertes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resAlertes.ok) setAlertes(await resAlertes.json());

      const resStats = await fetch(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resStats.ok) setStats(await resStats.json());

      const resProprietaires = await fetch(`${API_URL}/admin/proprietaires`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resProprietaires.ok) setProprietaires(await resProprietaires.json());
    } catch (err) {
      console.error('Erreur chargement admin :', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function validateLogement(id) {
    await fetch(`${API_URL}/logements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ statut: 'validee' }),
    });
    loadData(true);
  }

  function openRefuseModal(logement) {
    setRefuseModalLogement(logement);
    setRefuseReason('');
  }

  async function confirmRefusal() {
    if (!refuseModalLogement) return;
    await fetch(`${API_URL}/logements/${refuseModalLogement.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ statut: 'refusee', motifRefus: refuseReason.trim() || 'Dossier non conforme aux exigences' }),
    });
    setRefuseModalLogement(null);
    setRefuseReason('');
    loadData(true);
  }

  async function toggleAvailability(id, currentAvail) {
    const nextAvail = currentAvail === 'disponible' ? 'loue' : 'disponible';
    await fetch(`${API_URL}/logements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ disponibilite: nextAvail }),
    });
    loadData(true);
  }

  async function resolveDemande(id) {
    await fetch(`${API_URL}/demandes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ statut: 'traitee' }),
    });
    loadData(true);
  }

  async function changerStatutAlerte(id, nouveauStatut) {
    await fetch(`${API_BASE}/api/alertes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ statut: nouveauStatut }),
    });
    loadData(true);
  }

  async function supprimerAlerte(id) {
    if (!window.confirm('Voulez-vous supprimer cette alerte ?')) return;
    await fetch(`${API_BASE}/api/alertes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    loadData(true);
  }

  function openDeleteModal(type, id, name) {
    setDeleteModal({ type, id, name });
  }

  async function confirmDeletion() {
    if (!deleteModal) return;
    if (deleteModal.type === 'logement') {
      await fetch(`${API_URL}/logements/${deleteModal.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } else if (deleteModal.type === 'proprietaire') {
      await fetch(`${API_URL}/admin/proprietaires/${deleteModal.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setDeleteModal(null);
    loadData(true);
  }

  function openEditModal(l) {
    setEditingLogement(l);
    setEditError('');
    setEditForm({
      titre: l.titre,
      secteur: l.secteur,
      type: l.type,
      prix: l.prix,
      chambres: l.chambres,
      salons: l.salons,
      description: l.description || '',
    });
  }

  function cancelEdit() {
    setEditingLogement(null);
    setEditError('');
  }

  async function saveEdit(id) {
    setEditError('');
    if (!editForm.titre || !editForm.secteur || !editForm.prix || Number(editForm.prix) <= 0) {
      setEditError('Veuillez remplir correctement les champs obligatoires.');
      return;
    }

    const res = await fetch(`${API_URL}/logements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        titre: editForm.titre,
        secteur: editForm.secteur,
        type: editForm.type,
        prix: Number(editForm.prix),
        chambres: Math.max(0, Number(editForm.chambres) || 0),
        salons: Math.max(0, Number(editForm.salons) || 0),
        description: editForm.description,
      }),
    });

    if (!res.ok) {
      setEditError('Erreur lors de la mise à jour.');
      return;
    }

    setEditingLogement(null);
    loadData(true);
  }

  const pendingLogements = logements.filter((l) => l.statut === 'en_attente');
  const newDemandes = demandes.filter((d) => d.statut === 'nouvelle');
  const activeAlertes = alertes.filter((a) => a.statut === 'active');

  const badgeCounts = {
    attente: pendingLogements.length,
    demandes: newDemandes.length,
    alertes: activeAlertes.length,
  };

  const filteredLogements = logements.filter((l) => {
    if (statusFilter !== 'tous' && l.statut !== statusFilter) return false;
    if (sectorFilter && l.secteur !== sectorFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitre = l.titre?.toLowerCase().includes(q);
      const matchSecteur = l.secteur?.toLowerCase().includes(q);
      const matchProprio = `${l.proprietairePrenom || ''} ${l.proprietaireNom || ''}`.toLowerCase().includes(q);
      if (!matchTitre && !matchSecteur && !matchProprio) return false;
    }
    return true;
  });

  const activeNavItem = allNavItems.find((i) => i.id === activeSection);

  return (
    <div className="saas-admin-wrapper">
      <div className="saas-admin-layout">
        {/* SIDEBAR NAVIGATION (Linear/Stripe Style) */}
        <aside className={`saas-sidebar ${sidebarOpenMobile ? 'open-mobile' : ''}`}>
          <div className="saas-sidebar-header">
            <div className="saas-brand-tag">
              <div className="brand-dot-active" />
              <span>Console Système</span>
            </div>
          </div>

          <div className="saas-sidebar-nav">
            {navigationGroups.map((group) => (
              <div key={group.title} className="saas-nav-group">
                <span className="saas-group-label">{group.title}</span>
                {group.items.map(({ id, label, icon: Icon, badgeKey, badgeVariant }) => {
                  const count = badgeKey ? badgeCounts[badgeKey] : 0;
                  const isActive = activeSection === id;

                  return (
                    <button
                      key={id}
                      className={`saas-nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => navigateToSection(id)}
                    >
                      <Icon size={17} className="nav-link-icon" />
                      <span className="nav-link-text">{label}</span>
                      {count > 0 && (
                        <span className={`saas-badge-pill ${badgeVariant || ''}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="saas-sidebar-footer">
            <div className="saas-admin-profile">
              <div className="admin-avatar">
                <ShieldCheck size={16} />
              </div>
              <div className="admin-profile-meta">
                <strong>Superviser Admin</strong>
                <span>SunuKeur Dakar</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN DASHBOARD PANEL */}
        <main className="saas-main-panel">
          {/* HEADER CONTEXT BAR */}
          <header className="saas-header-bar">
            <div className="header-breadcrumbs">
              <span className="bc-root">Administration</span>
              <ChevronRight size={14} className="bc-sep" />
              <span className="bc-current">{activeNavItem?.label}</span>
            </div>

            <div className="header-status-indicator">
              <span className="status-live-dot" />
              <span className="status-live-text">API En Ligne</span>
            </div>
          </header>

          {/* DYNAMIC VIEW CONTENT */}
          <div className="saas-content-area">
            {/* VIEW 1: OVERVIEW DASHBOARD */}
            {activeSection === 'stats' && (
              <div className="saas-view-fade">
                <div className="saas-page-header">
                  <div>
                    <h1>Vue d'ensemble analytique</h1>
                    <p>Statistiques en temps réel et performances de la plateforme à Dakar.</p>
                  </div>
                </div>

                {/* KPI CARDS GRID */}
                <div className="saas-kpi-grid">
                  <div className="saas-kpi-card">
                    <div className="kpi-card-top">
                      <span className="kpi-card-title">Annonces au Total</span>
                      <div className="kpi-icon-wrapper primary"><Building2 size={18} /></div>
                    </div>
                    <div className="kpi-card-value">{stats?.totalLogements || 0}</div>
                    <div className="kpi-card-footer positive">
                      <TrendingUp size={13} />
                      <span>Volume global soumis</span>
                    </div>
                  </div>

                  <div className="saas-kpi-card">
                    <div className="kpi-card-top">
                      <span className="kpi-card-title">En attente de contrôle</span>
                      <div className="kpi-icon-wrapper warning"><Clock size={18} /></div>
                    </div>
                    <div className="kpi-card-value">{stats?.enAttente || 0}</div>
                    <div className="kpi-card-footer warning">
                      <span>{pendingLogements.length} dossier{pendingLogements.length > 1 ? 's' : ''} à valider</span>
                    </div>
                  </div>

                  <div className="saas-kpi-card">
                    <div className="kpi-card-top">
                      <span className="kpi-card-title">Validées (En ligne)</span>
                      <div className="kpi-icon-wrapper success"><CheckCircle2 size={18} /></div>
                    </div>
                    <div className="kpi-card-value">{stats?.validees || 0}</div>
                    <div className="kpi-card-footer success">
                      <span>Logements actifs</span>
                    </div>
                  </div>

                  <div className="saas-kpi-card">
                    <div className="kpi-card-top">
                      <span className="kpi-card-title">Refusées</span>
                      <div className="kpi-icon-wrapper danger"><XCircle size={18} /></div>
                    </div>
                    <div className="kpi-card-value">{stats?.refusees || 0}</div>
                    <div className="kpi-card-footer neutral">
                      <span>Dossiers non conformes</span>
                    </div>
                  </div>

                  <div className="saas-kpi-card">
                    <div className="kpi-card-top">
                      <span className="kpi-card-title">Bailleurs Inscrits</span>
                      <div className="kpi-icon-wrapper info"><Users size={18} /></div>
                    </div>
                    <div className="kpi-card-value">{stats?.totalProprietaires || 0}</div>
                    <div className="kpi-card-footer positive">
                      <span>Comptes enregistrés</span>
                    </div>
                  </div>

                  <div className="saas-kpi-card">
                    <div className="kpi-card-top">
                      <span className="kpi-card-title">Demandes à traiter</span>
                      <div className="kpi-icon-wrapper orange"><MessageSquare size={18} /></div>
                    </div>
                    <div className="kpi-card-value">{newDemandes.length}</div>
                    <div className="kpi-card-footer orange">
                      <span>Mises en relation en attente</span>
                    </div>
                  </div>
                </div>

                {/* DISTRIBUTION CHARTS & TOP SECTORS */}
                <div className="saas-analytics-grid">
                  <div className="saas-panel-card">
                    <div className="panel-card-header">
                      <h3>Statuts du parc immobilier</h3>
                    </div>
                    <div className="status-progress-list">
                      <div className="status-progress-item">
                        <div className="status-progress-labels">
                          <span>Validées en ligne</span>
                          <strong>{stats?.validees || 0}</strong>
                        </div>
                        <div className="progress-bar-bg">
                          <div
                            className="progress-bar-fill success"
                            style={{ width: `${stats?.totalLogements ? ((stats.validees || 0) / stats.totalLogements) * 100 : 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="status-progress-item">
                        <div className="status-progress-labels">
                          <span>En attente de modération</span>
                          <strong>{stats?.enAttente || 0}</strong>
                        </div>
                        <div className="progress-bar-bg">
                          <div
                            className="progress-bar-fill warning"
                            style={{ width: `${stats?.totalLogements ? ((stats.enAttente || 0) / stats.totalLogements) * 100 : 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="status-progress-item">
                        <div className="status-progress-labels">
                          <span>Refusées</span>
                          <strong>{stats?.refusees || 0}</strong>
                        </div>
                        <div className="progress-bar-bg">
                          <div
                            className="progress-bar-fill danger"
                            style={{ width: `${stats?.totalLogements ? ((stats.refusees || 0) / stats.totalLogements) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="saas-panel-card">
                    <div className="panel-card-header">
                      <h3>Top Secteurs les plus prisés à Dakar</h3>
                    </div>
                    {stats?.topSecteurs && stats.topSecteurs.length > 0 ? (
                      <div className="top-secteurs-list">
                        {stats.topSecteurs.map((s, index) => (
                          <div key={s.secteur} className="secteur-rank-row">
                            <span className="rank-badge">#{index + 1}</span>
                            <span className="secteur-name">{s.secteur}</span>
                            <span className="secteur-count">{s.total} demande{s.total > 1 ? 's' : ''}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="saas-empty-text">Aucune statistique de secteur disponible pour le moment.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: MODERATION QUEUE */}
            {activeSection === 'attente' && (
              <div className="saas-view-fade">
                <div className="saas-page-header">
                  <div>
                    <h1>File de modération ({pendingLogements.length})</h1>
                    <p>Vérifiez et contrôlez chaque annonce soumise avant sa diffusion publique sur SunuKeur.</p>
                  </div>
                </div>

                {pendingLogements.length === 0 ? (
                  <div className="saas-empty-card">
                    <CheckCircle2 size={48} className="empty-icon-success" />
                    <h3>File d'attente totalement vide</h3>
                    <p>Excellente nouvelle ! Toutes les annonces soumises ont été contrôlées et traitées.</p>
                  </div>
                ) : (
                  <div className="moderation-cards-stream">
                    {pendingLogements.map((l) => {
                      const photo = l.photos && l.photos.length > 0 ? `${API_BASE}${l.photos[0]}` : null;

                      return (
                        <div key={l.id} className="saas-moderation-item">
                          {photo ? (
                            <div className="mod-item-media" style={{ backgroundImage: `url(${photo})` }} />
                          ) : (
                            <div className="mod-item-media placeholder"><Building2 size={28} /></div>
                          )}

                          <div className="mod-item-body">
                            <div className="mod-item-top">
                              <div>
                                <h3 className="mod-item-title">{l.titre}</h3>
                                <span className="mod-item-sub">{l.secteur} — {l.type} ({l.chambres} ch. / {l.salons} sal.)</span>
                              </div>
                              <div className="mod-item-price">{l.prix?.toLocaleString()} FCFA <small>/ mois</small></div>
                            </div>

                            {l.description && <p className="mod-item-desc">"{l.description}"</p>}

                            <div className="mod-item-meta">
                              <div className="meta-proprio">
                                <span>Bailleur :</span> <strong>{l.proprietairePrenom} {l.proprietaireNom}</strong>
                                <a href={`tel:${l.proprietaireTelephone}`} className="meta-phone-link"><Phone size={12} /> {l.proprietaireTelephone}</a>
                              </div>
                              <div className="meta-declaration">
                                <ShieldCheck size={14} className="icon-shield-green" />
                                <span>Déclaration sur l'honneur signée par le bailleur</span>
                              </div>
                            </div>

                            <div className="mod-item-actions">
                              <button className="saas-btn-action primary" onClick={() => validateLogement(l.id)}>
                                <Check size={16} /> Valider & Publier
                              </button>
                              <button className="saas-btn-action danger" onClick={() => openRefuseModal(l)}>
                                <X size={16} /> Refuser le dossier
                              </button>
                              <button className="saas-btn-action secondary" onClick={() => openEditModal(l)}>
                                <SquarePen size={15} /> Editer
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

            {/* VIEW 3: TOUTES LES ANNONCES */}
            {activeSection === 'gestion' && (
              <div className="saas-view-fade">
                <div className="saas-page-header">
                  <div>
                    <h1>Catalogue général des annonces ({filteredLogements.length})</h1>
                    <p>Gestion et modération de l'ensemble du parc immobilier SunuKeur.</p>
                  </div>
                </div>

                {/* FILTERS TOOLBAR */}
                <div className="saas-toolbar">
                  <div className="saas-search-input">
                    <Search size={16} className="search-icon" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher par titre, quartier ou bailleur..."
                    />
                  </div>

                  <div className="saas-select-box">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="tous">Tous les statuts</option>
                      <option value="validee">Validées</option>
                      <option value="en_attente">En attente</option>
                      <option value="refusee">Refusées</option>
                    </select>
                  </div>

                  <div className="saas-select-box">
                    <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}>
                      <option value="">Tous les secteurs</option>
                      {secteurs.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                </div>

                {/* DATA TABLE */}
                <div className="saas-table-container">
                  <table className="saas-table">
                    <thead>
                      <tr>
                        <th>Logement</th>
                        <th>Type & Configuration</th>
                        <th>Loyer mensuel</th>
                        <th>Propriétaire</th>
                        <th>Statut</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogements.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                            Aucune annonce ne correspond aux filtres de recherche.
                          </td>
                        </tr>
                      ) : (
                        filteredLogements.map((l) => {
                          const conf = statutConfig[l.statut] || statutConfig.en_attente;
                          const StatusIcon = conf.icon;

                          return (
                            <tr key={l.id}>
                              <td>
                                <strong className="td-title">{l.titre}</strong>
                                <span className="td-sub">{l.secteur}</span>
                              </td>
                              <td>
                                <span className="td-text">{l.type}</span>
                                <span className="td-sub">{l.chambres} ch. / {l.salons} sal.</span>
                              </td>
                              <td>
                                <strong className="td-price">{l.prix?.toLocaleString()} FCFA</strong>
                              </td>
                              <td>
                                <span className="td-text">{l.proprietairePrenom} {l.proprietaireNom}</span>
                                <span className="td-sub">{l.proprietaireTelephone}</span>
                              </td>
                              <td>
                                <span className={`saas-status-pill ${conf.className}`}>
                                  <StatusIcon size={12} /> {conf.label}
                                </span>
                              </td>
                              <td>
                                <div className="td-actions">
                                  {l.statut === 'en_attente' && (
                                    <button className="icon-btn-square success" onClick={() => validateLogement(l.id)} title="Valider">
                                      <Check size={15} />
                                    </button>
                                  )}
                                  <button className="icon-btn-square" onClick={() => openEditModal(l)} title="Modifier">
                                    <SquarePen size={15} />
                                  </button>
                                  <button className="icon-btn-square danger" onClick={() => openDeleteModal('logement', l.id, l.titre)} title="Supprimer">
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

            {/* VIEW 4: DISPONIBILITÉS */}
            {activeSection === 'disponibilite' && (
              <div className="saas-view-fade">
                <div className="saas-page-header">
                  <div>
                    <h1>Gestion des Disponibilités</h1>
                    <p>Basculez rapidement l'état des logements validés en ligne.</p>
                  </div>
                </div>

                <div className="dispo-cards-grid">
                  {logements.filter((l) => l.statut === 'validee').map((l) => {
                    const isRented = l.disponibilite === 'loue';

                    return (
                      <div key={l.id} className="saas-dispo-card">
                        <div className="dispo-card-head">
                          <h4>{l.titre}</h4>
                          <span>{l.secteur} — {l.prix?.toLocaleString()} FCFA/mois</span>
                        </div>
                        <div className="dispo-card-foot">
                          <span className={`dispo-status-badge ${isRented ? 'rented' : 'available'}`}>
                            {isRented ? 'Loué' : 'Disponible'}
                          </span>
                          <button
                            className={`saas-btn-dispo ${isRented ? 'to-available' : 'to-rented'}`}
                            onClick={() => toggleAvailability(l.id, l.disponibilite)}
                          >
                            {isRented ? <RotateCcw size={14} /> : <CheckCircle2 size={14} />}
                            <span>{isRented ? 'Remettre disponible' : 'Marquer comme loué'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW 5: DEMANDES DE CONTACT */}
            {activeSection === 'demandes' && (
              <div className="saas-view-fade">
                <div className="saas-page-header">
                  <div>
                    <h1>Demandes de contact ({demandes.length})</h1>
                    <p>Leads et mises en relation enregistrés entre locataires et propriétaires.</p>
                  </div>
                </div>

                <div className="saas-table-container">
                  <table className="saas-table">
                    <thead>
                      <tr>
                        <th>Chercheur (Locataire)</th>
                        <th>Téléphone</th>
                        <th>Annonce visée</th>
                        <th>Bailleur concerné</th>
                        <th>Statut</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demandes.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                            Aucune demande de contact enregistrée.
                          </td>
                        </tr>
                      ) : (
                        demandes.map((d) => (
                          <tr key={d.id}>
                            <td>
                              <strong className="td-title">{d.nom}</strong>
                              {d.email && <span className="td-sub">{d.email}</span>}
                            </td>
                            <td>
                              <a href={`tel:${d.telephone}`} className="td-phone-link"><Phone size={13} /> {d.telephone}</a>
                            </td>
                            <td>
                              <strong className="td-text">{d.logementTitre}</strong>
                              <span className="td-sub">{d.secteur}</span>
                            </td>
                            <td>
                              <span className="td-text">{d.telephoneProprietaire || 'Non renseigné'}</span>
                            </td>
                            <td>
                              <span className={`saas-status-pill ${d.statut === 'nouvelle' ? 'status-pill-warning' : 'status-pill-success'}`}>
                                {d.statut === 'nouvelle' ? 'Nouvelle' : 'Traitée'}
                              </span>
                            </td>
                            <td>
                              <div className="td-actions">
                                <a href={`https://wa.me/221${d.telephone}`} target="_blank" rel="noreferrer" className="icon-btn-square whatsapp" title="WhatsApp">
                                  <MessageCircle size={15} />
                                </a>
                                {d.statut === 'nouvelle' && (
                                  <button className="icon-btn-square success" onClick={() => resolveDemande(d.id)} title="Marquer comme traitée">
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

            {/* VIEW 6: ALERTES RECHERCHE */}
            {activeSection === 'alertes' && (
              <div className="saas-view-fade">
                <div className="saas-page-header">
                  <div>
                    <h1>Alertes Recherche ({alertes.length})</h1>
                    <p>Liste des demandes d'alertes enregistrées par les locataires à la recherche d'un bien.</p>
                  </div>
                </div>

                <div className="saas-table-container">
                  <table className="saas-table">
                    <thead>
                      <tr>
                        <th>Locataire</th>
                        <th>Téléphone / WhatsApp</th>
                        <th>Critères (Secteur & Type)</th>
                        <th>Budget Max</th>
                        <th>Statut</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alertes.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                            Aucune alerte de recherche enregistrée.
                          </td>
                        </tr>
                      ) : (
                        alertes.map((a) => (
                          <tr key={a.id}>
                            <td>
                              <strong className="td-title">{a.prenom} {a.nom}</strong>
                              {a.email && <span className="td-sub">{a.email}</span>}
                            </td>
                            <td>
                              <a href={`tel:${a.telephone}`} className="td-phone-link"><Phone size={13} /> {a.telephone}</a>
                            </td>
                            <td>
                              <strong className="td-text">{a.secteur || 'Tous'} • {a.typeLogement || 'Tous'}</strong>
                              <span className="td-sub">Créée le {new Date(a.dateCreation || a.id).toLocaleDateString('fr-FR')}</span>
                            </td>
                            <td>
                              <strong style={{ color: '#2563eb' }}>
                                {a.budgetMax ? `${Number(a.budgetMax).toLocaleString()} FCFA` : 'Non spécifié'}
                              </strong>
                            </td>
                            <td>
                              <span className={`saas-status-pill ${a.statut === 'active' ? 'status-pill-warning' : 'status-pill-success'}`}>
                                {a.statut === 'active' ? 'Active' : 'Traitée'}
                              </span>
                            </td>
                            <td>
                              <div className="td-actions">
                                <a 
                                  href={`https://wa.me/221${a.whatsapp || a.telephone}?text=${encodeURIComponent(`Bonjour ${a.prenom || a.nom}, nous avons de nouveaux logements correspondant à votre alerte sur Sunu Ker (${a.secteur} - ${a.typeLogement}) !`)}`} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="icon-btn-square whatsapp" 
                                  title="Contacter sur WhatsApp"
                                >
                                  <MessageCircle size={15} />
                                </a>
                                {a.statut === 'active' ? (
                                  <button className="icon-btn-square success" onClick={() => changerStatutAlerte(a.id, 'traitee')} title="Marquer comme traitée">
                                    <Check size={15} />
                                  </button>
                                ) : (
                                  <button className="icon-btn-square warning" onClick={() => changerStatutAlerte(a.id, 'active')} title="Réactiver l'alerte">
                                    <RotateCcw size={15} />
                                  </button>
                                )}
                                <button className="icon-btn-square danger" onClick={() => supprimerAlerte(a.id)} title="Supprimer">
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

            {/* VIEW 7: PROPRIÉTAIRES */}
            {activeSection === 'proprietaires' && (
              <div className="saas-view-fade">
                <div className="saas-page-header">
                  <div>
                    <h1>Comptes Bailleurs ({proprietaires.length})</h1>
                    <p>Répertoire de tous les propriétaires inscrits sur la plateforme.</p>
                  </div>
                </div>

                <div className="saas-table-container">
                  <table className="saas-table">
                    <thead>
                      <tr>
                        <th>Propriétaire</th>
                        <th>Téléphone</th>
                        <th>Email</th>
                        <th>Inscription</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proprietaires.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                            Aucun compte propriétaire enregistré.
                          </td>
                        </tr>
                      ) : (
                        proprietaires.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <div className="td-user-avatar-row">
                                <div className="user-avatar">
                                  {p.photoProfil ? <img src={`${API_BASE}${p.photoProfil}`} alt="" /> : <Users size={16} />}
                                </div>
                                <div>
                                  <strong className="td-title">{p.prenom} {p.nom}</strong>
                                </div>
                              </div>
                            </td>
                            <td>
                              <a href={`tel:${p.telephone}`} className="td-phone-link"><Phone size={13} /> {p.telephone}</a>
                            </td>
                            <td>
                              <span className="td-text">{p.email || '—'}</span>
                            </td>
                            <td>
                              <span className="td-sub">{new Date(p.dateCreation || p.id).toLocaleDateString('fr-FR')}</span>
                            </td>
                            <td>
                              <div className="td-actions">
                                <a href={`https://wa.me/221${p.telephone}`} target="_blank" rel="noreferrer" className="icon-btn-square whatsapp" title="WhatsApp">
                                  <MessageCircle size={15} />
                                </a>
                                <button className="icon-btn-square danger" onClick={() => openDeleteModal('proprietaire', p.id, `${p.prenom} ${p.nom}`)} title="Supprimer le compte">
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

        {/* MODAL EDIT */}
        {editingLogement && (
          <div className="saas-modal-backdrop">
            <div className="saas-modal-card">
              <div className="modal-card-header">
                <h3>Modifier l'annonce</h3>
                <button onClick={cancelEdit} className="modal-btn-close"><X size={18} /></button>
              </div>
              <div className="modal-card-body">
                <div className="form-group">
                  <label>Titre de l'annonce</label>
                  <input
                    type="text"
                    value={editForm.titre}
                    onChange={(e) => setEditForm((f) => ({ ...f, titre: e.target.value }))}
                  />
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Secteur</label>
                    <select value={editForm.secteur} onChange={(e) => setEditForm((f) => ({ ...f, secteur: e.target.value }))}>
                      {secteurs.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select value={editForm.type} onChange={(e) => setEditForm((f) => ({ ...f, type: e.target.value }))}>
                      {typesLogement.map((t) => (<option key={t} value={t}>{t}</option>))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Prix mensuel (FCFA)</label>
                  <input
                    type="number"
                    value={editForm.prix}
                    onChange={(e) => setEditForm((f) => ({ ...f, prix: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows={4}
                    value={editForm.description}
                    onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>
                {editError && <p className="alert-error-msg">{editError}</p>}
              </div>
              <div className="modal-card-footer">
                <button className="saas-btn-action secondary" onClick={cancelEdit}>Annuler</button>
                <button className="saas-btn-action primary" onClick={() => saveEdit(editingLogement.id)}>Sauvegarder</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL REFUSE */}
        {refuseModalLogement && (
          <div className="saas-modal-backdrop">
            <div className="saas-modal-card">
              <div className="modal-card-header">
                <h3>Motif de refus d'annonce</h3>
                <button onClick={() => setRefuseModalLogement(null)} className="modal-btn-close"><X size={18} /></button>
              </div>
              <div className="modal-card-body">
                <p className="modal-subtitle-text">
                  Indiquez la raison du refus pour <strong>"{refuseModalLogement.titre}"</strong> :
                </p>
                <textarea
                  rows={4}
                  value={refuseReason}
                  onChange={(e) => setRefuseReason(e.target.value)}
                  placeholder="Ex : Photos non conformes, tarif incohérent, informations insuffisantes..."
                />
              </div>
              <div className="modal-card-footer">
                <button className="saas-btn-action secondary" onClick={() => setRefuseModalLogement(null)}>Annuler</button>
                <button className="saas-btn-action danger" onClick={confirmRefusal}>Confirmer le refus</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DELETE */}
        {deleteModal && (
          <div className="saas-modal-backdrop">
            <div className="saas-modal-card">
              <div className="modal-card-header">
                <h3>Confirmation de suppression</h3>
                <button onClick={() => setDeleteModal(null)} className="modal-btn-close"><X size={18} /></button>
              </div>
              <div className="modal-card-body">
                <p className="modal-subtitle-text">
                  Voulez-vous vraiment supprimer définitivement {deleteModal.type === 'logement' ? 'l\'annonce' : 'le compte'} <strong>"{deleteModal.name}"</strong> ?
                </p>
              </div>
              <div className="modal-card-footer">
                <button className="saas-btn-action secondary" onClick={() => setDeleteModal(null)}>Annuler</button>
                <button className="saas-btn-action danger" onClick={confirmDeletion}>Supprimer définitivement</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;