import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2026 SunuKeur — Dakar, Sénégal</p>
      <div className="footer-links">
        <Link to="/contact">FAQ</Link>
        <Link to="/a-propos">À propos</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/mentions-legales">Mentions légales</Link>
        <Link to="/politique-confidentialite">Politique de confidentialité</Link>
        <Link to="/conditions-utilisation">Conditions d'utilisation</Link>
      </div>
    </footer>
  );
}

export default Footer;