import { useState, useEffect, useRef } from 'react';
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
  const notifRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    if (!menuOuvert) return;

    function handleOutsideClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOuvert(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [menuOuvert]);

  useEffect(() => {
    if (!afficherControlesAdmin) return;

    async function chargerDemandes() {
      try {
        const res = await fetch(`${API_URL}/demandes`, { headers: { Authorization: `Bearer ${tokenAdmin}` } });
        if (!res.ok) return;
        const data = await res.json();
        setDemandesNouvelles(data.filter((d) => d.statut === 'nouvelle'));
      } catch {
        // ignoré
      }
    }

    chargerDemandes();
    const interval = setInterval(chargerDemandes, 30000);
    return () => clearInterval(interval);
  }, [afficherControlesAdmin, tokenAdmin]);

  useEffect(() => {
    if (!notifsOuvertes) return;

    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifsOuvertes(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [notifsOuvertes]);

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
    <>
      {menuOuvert && (
        <div
          className="navbar-backdrop"
          onClick={() => setMenuOuvert(false)}
          title="Fermer le menu"
        />
      )}

      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} ref={navRef}>
        <Link to="/" className="navbar-logo" onClick={() => setMenuOuvert(false)}>
          <img src={logoIcon} alt="DëkuWaay" className="logo-icon" />
          <span className="navbar-brand"><span className="logo-sunu">Dëku</span><span className="logo-keur">Waay</span></span>
        </Link>

        <div className={`navbar-links ${menuOuvert ? 'ouvert' : ''}`}>
          <Link to="/logements" onClick={() => setMenuOuvert(false)}>Logements</Link>
          <Link to="/publier" onClick={() => setMenuOuvert(false)}>Publier une annonce</Link>
          <Link to="/creer-alerte" onClick={() => setMenuOuvert(false)} className="navbar-link-alerte-mobile">
            <Bell size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            <span>Créer une alerte</span>
          </Link>
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
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                className="theme-toggle"
                onClick={() => setNotifsOuvertes((o) => !o)}
                aria-label="Notifications"
                title="Notifications administration"
              >
                <Bell size={18} />
                {demandesNouvelles.length > 0 && <span className="admin-notif-dot">{demandesNouvelles.length}</span>}
              </button>

              {notifsOuvertes && (
                <div className="admin-notif-dropdown">
                  <div className="admin-notif-dropdown-header">
                    <strong>Notifications Admin</strong>
                    <span>{demandesNouvelles.length} nouvelle{demandesNouvelles.length > 1 ? 's' : ''}</span>
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
            <Link 
              to="/creer-alerte"
              className="navbar-btn-alerte"
              title="Créer une alerte logement"
              style={{
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: '#2563eb',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                padding: '0.45rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
                e.currentTarget.style.color = '#2563eb';
              }}
            >
              <Bell size={15} />
              <span className="navbar-alerte-btn-text">Créer une alerte</span>
            </Link>
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
    </>
  );
}

export default Navbar;