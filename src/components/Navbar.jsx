import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, User, Bell, LogOut, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useProprietaire } from '../context/ProprietaireContext';
import { useAuth } from '../context/AuthContext';
import { API_URL, API_BASE } from '../config';
import logoIcon from '../assets/logo-icon.png';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const { theme, basculerTheme } = useTheme();
  const { estConnecte, prenom, photoProfil } = useProprietaire();

  const { token: tokenAdmin, estConnecte: adminEstConnecte, deconnecter: deconnecterAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const surPageAdmin = location.pathname.startsWith('/admin');
  const afficherControlesAdmin = surPageAdmin && adminEstConnecte;

  const [notifsOuvertes, setNotifsOuvertes] = useState(false);
  const [demandesNouvelles, setDemandesNouvelles] = useState([]);

  useEffect(() => {
    if (!afficherControlesAdmin) return;

    async function chargerDemandes() {
      const res = await fetch(`${API_URL}/demandes`, { headers: { Authorization: `Bearer ${tokenAdmin}` } });
      if (!res.ok) return;
      const data = await res.json();
      setDemandesNouvelles(data.filter((d) => d.statut === 'nouvelle'));
    }

    chargerDemandes();
    const interval = setInterval(chargerDemandes, 30000);
    return () => clearInterval(interval);
  }, [afficherControlesAdmin, tokenAdmin]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function allerVersNotification() {
    setNotifsOuvertes(false);
    navigate('/admin?section=demandes');
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <Link to="/" className="navbar-logo">
        <img src={logoIcon} alt="SunuKeur" className="logo-icon" />
        <span className="navbar-brand"><span className="logo-sunu">Sunu</span><span className="logo-keur">Keur</span></span>
      </Link>

      <div className={`navbar-links ${menuOuvert ? 'ouvert' : ''}`}>
        <Link to="/logements" onClick={() => setMenuOuvert(false)}>Logements</Link>
        <Link to="/publier" onClick={() => setMenuOuvert(false)}>Publier une annonce</Link>
        <Link to="/a-propos" onClick={() => setMenuOuvert(false)}>À propos</Link>
        <Link to="/contact" onClick={() => setMenuOuvert(false)}>Contact</Link>

        {!afficherControlesAdmin && (
          estConnecte ? (
            <Link to="/mon-espace" onClick={() => setMenuOuvert(false)} className="navbar-user-link navbar-user-link-mobile">
              <span className="navbar-avatar">
                {photoProfil ? <img src={`${API_BASE}${photoProfil}`} alt={prenom} /> : <User size={14} />}
              </span>
              {prenom}
            </Link>
          ) : (
            <Link to="/connexion" onClick={() => setMenuOuvert(false)}>Connexion</Link>
          )
        )}
      </div>

      <div className="navbar-actions">
        {afficherControlesAdmin ? (
          <>
            <div style={{ position: 'relative' }}>
              <button className="theme-toggle" onClick={() => setNotifsOuvertes((o) => !o)} aria-label="Notifications">
                <Bell size={18} />
                {demandesNouvelles.length > 0 && <span className="admin-notif-dot">{demandesNouvelles.length}</span>}
              </button>

              {notifsOuvertes && (
                <div className="admin-notif-dropdown">
                  <div className="admin-notif-dropdown-header">
                    <strong>Notifications</strong>
                    <span>{demandesNouvelles.length} en attente</span>
                  </div>
                  {demandesNouvelles.length === 0 ? (
                    <p style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                      Aucune nouvelle notification.
                    </p>
                  ) : (
                    demandesNouvelles.slice(0, 6).map((d) => (
                      <button key={d.id} className="admin-notif-item" onClick={allerVersNotification}>
                        <MessageSquare size={15} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                        <div>
                          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>{d.nom}</p>
                          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            Intéressé par "{d.logementTitre}"
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <button className="theme-toggle" onClick={basculerTheme} aria-label="Changer de thème">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button className="admin-logout-btn-nav" onClick={deconnecterAdmin}>
              <LogOut size={15} />
              <span className="navbar-user-link-desktop-text">Déconnexion</span>
            </button>
          </>
        ) : (
          <>
            {estConnecte ? (
              <Link to="/mon-espace" className="navbar-user-link navbar-user-link-desktop">
                <span className="navbar-avatar">
                  {photoProfil ? <img src={`${API_BASE}${photoProfil}`} alt={prenom} /> : <User size={14} />}
                </span>
                {prenom}
              </Link>
            ) : (
              <Link to="/connexion" className="navbar-user-link navbar-user-link-desktop">
                Connexion
              </Link>
            )}
            <button className="theme-toggle" onClick={basculerTheme} aria-label="Changer de thème">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </>
        )}

        <button className="menu-burger" onClick={() => setMenuOuvert((o) => !o)} aria-label="Menu">
          <Menu size={22} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;