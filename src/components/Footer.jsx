import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, MessageCircle, Mail, MapPin, Building2, HelpCircle } from 'lucide-react';
import logoIcon from '../assets/logo-icon.png';

function Footer() {
  return (
    <footer className="footer-v2">
      <div className="footer-container-v2">
        <div className="footer-top-v2">
          {/* COL 1: BRAND */}
          <div className="footer-col-brand">
            <Link to="/" className="footer-logo-link">
              <img src={logoIcon} alt="SunuKeur" className="footer-logo-img" />
              <span className="footer-brand-name">
                <span className="logo-sunu">Sunu</span>
                <span className="logo-keur">Keur</span>
              </span>
            </Link>
            <p className="footer-brand-desc">
              La plateforme immobilière de référence pour la recherche et la publication de logements vérifiés à Dakar.
            </p>
            <div className="footer-badge-trust">
              <ShieldCheck size={14} style={{ color: 'var(--color-secondary)' }} />
              <span>Annonces 100% vérifiées</span>
            </div>
          </div>

          {/* COL 2: NAVIGATION */}
          <div className="footer-col-links">
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/logements">Logements disponibles</Link></li>
              <li><Link to="/publier">Publier une annonce</Link></li>
              <li><Link to="/a-propos">À propos de SunuKeur</Link></li>
              <li><Link to="/contact">Support & Contact</Link></li>
            </ul>
          </div>

          {/* COL 3: LÉGAL & FAQ */}
          <div className="footer-col-links">
            <h4>Informations</h4>
            <ul>
              <li><Link to="/contact">Foire aux questions (FAQ)</Link></li>
              <li><Link to="/mentions-legales">Mentions légales</Link></li>
              <li><Link to="/politique-confidentialite">Politique de confidentialité</Link></li>
              <li><Link to="/conditions-utilisation">Conditions d'utilisation</Link></li>
            </ul>
          </div>

          {/* COL 4: CONTACT DIRECT */}
          <div className="footer-col-contact">
            <h4>Contact direct</h4>
            <div className="footer-contact-list">
              <a href="tel:+221775350229" className="footer-contact-row">
                <Phone size={15} className="footer-icon-primary" />
                <span>+221 77 535 02 29</span>
              </a>
              <a href="https://wa.me/221775350229" target="_blank" rel="noreferrer" className="footer-contact-row whatsapp">
                <MessageCircle size={15} />
                <span>WhatsApp 24/7</span>
              </a>
              <a href="mailto:contact@sunukeur.com" className="footer-contact-row">
                <Mail size={15} className="footer-icon-primary" />
                <span>contact@sunukeur.com</span>
              </a>
              <div className="footer-contact-row">
                <MapPin size={15} className="footer-icon-muted" />
                <span>Dakar, Sénégal · 24h/24, 7j/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="footer-bottom-v2">
          <p>&copy; 2026 SunuKeur — Tous droits réservés. Dakar, Sénégal.</p>
          <div className="footer-bottom-links">
            <Link to="/mentions-legales">Mentions légales</Link>
            <span>•</span>
            <Link to="/politique-confidentialite">Confidentialité</Link>
            <span>•</span>
            <Link to="/conditions-utilisation">Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;