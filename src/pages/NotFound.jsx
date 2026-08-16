import { Link } from 'react-router-dom';
import { Home, Building2, Bell, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found-page" style={{ padding: '80px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <div className="not-found-icon-wrapper" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '88px', height: '88px', borderRadius: '50%', background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
        <Compass size={44} />
      </div>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
        Page Introuvable (404)
      </h1>
      <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: '0 0 2rem 0' }}>
        Oups ! La page ou l'annonce que vous recherchez n'existe pas, a été déplacée ou n'est plus disponible sur DëkuWaay.
      </p>
      <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Home size={18} /> Accueil
        </Link>
        <Link to="/logements" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Building2 size={18} /> Voir les logements
        </Link>
        <Link to="/creer-alerte" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Bell size={18} /> Créer une alerte
        </Link>
      </div>
    </div>
  );
}
