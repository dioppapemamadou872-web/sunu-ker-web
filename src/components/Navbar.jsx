import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Menu, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useProprietaire } from '../context/ProprietaireContext';
import { API_BASE } from '../config';
import logoIcon from '../assets/logo-icon.png';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const { theme, basculerTheme } = useTheme();
  const { estConnecte, prenom, photoProfil } = useProprietaire();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

        {estConnecte ? (
          <Link to="/mon-espace" onClick={() => setMenuOuvert(false)} className="navbar-user-link navbar-user-link-mobile">
            <span className="navbar-avatar">
              {photoProfil ? <img src={`${API_BASE}${photoProfil}`} alt={prenom} /> : <User size={14} />}
            </span>
            {prenom}
          </Link>
        ) : (
          <Link to="/connexion" onClick={() => setMenuOuvert(false)}>Connexion</Link>
        )}
      </div>

      <div className="navbar-actions">
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
        <button className="menu-burger" onClick={() => setMenuOuvert((o) => !o)} aria-label="Menu">
          <Menu size={22} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;