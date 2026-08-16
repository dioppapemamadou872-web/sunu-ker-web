import { ShieldCheck, Building2, MapPin, Mail, Phone, Globe, Server, FileText, Calendar } from 'lucide-react';

function MentionsLegales() {
  return (
    <div style={{
      maxWidth: '900px',
      margin: '2.5rem auto 5rem auto',
      padding: '0 1.25rem'
    }}>
      {/* HERO HEADER */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: '24px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow)',
        overflow: 'hidden',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)',
          color: '#ffffff',
          padding: '3rem 2rem 2.5rem 2rem',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            padding: '0.4rem 1.1rem',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.25rem'
          }}>
            <FileText size={16} color="#60a5fa" />
            <span>Information Réglementaire</span>
          </div>

          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            margin: '0 0 0.75rem 0',
            color: '#ffffff',
            letterSpacing: '-0.025em'
          }}>
            Mentions Légales
          </h1>

          <p style={{
            margin: '0 auto 1.25rem auto',
            opacity: 0.9,
            fontSize: '1.05rem',
            maxWidth: '580px',
            lineHeight: 1.6
          }}>
            Informations juridiques, éditeur et hébergement de la plateforme immobilière DëkuWaay.
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            opacity: 0.85,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '0.35rem 0.9rem',
            borderRadius: '20px'
          }}>
            <Calendar size={14} />
            <span>Dernière mise à jour : Août 2026</span>
          </div>
        </div>

        {/* CONTENT BODY */}
        <div style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* SECTION 1: ÉDITEUR */}
          <div style={{
            backgroundColor: 'var(--color-bg)',
            padding: '1.75rem',
            borderRadius: '18px',
            border: '1px solid var(--color-border)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              margin: '0 0 1.25rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
                <Building2 size={20} color="#2563eb" />
              </div>
              1. Éditeur de la Plateforme
            </h2>
            
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: '0 0 1.25rem 0', fontSize: '0.95rem' }}>
              Le site web et l'application <strong>DëkuWaay</strong> sont édités et exploités par la société DëkuWaay S.A.R.L., plateforme de mise en relation immobilière au Sénégal.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'var(--color-surface)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <MapPin size={18} color="#2563eb" />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Siège social</span>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>Dakar, Sénégal</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'var(--color-surface)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <Phone size={18} color="#10b981" />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Téléphone / WhatsApp</span>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>+221 77 535 02 29</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'var(--color-surface)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <Mail size={18} color="#f59e0b" />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Email Support</span>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>contact@dekuwaay.com</strong>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: HÉBERGEMENT */}
          <div style={{
            backgroundColor: 'var(--color-bg)',
            padding: '1.75rem',
            borderRadius: '18px',
            border: '1px solid var(--color-border)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              margin: '0 0 1.25rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
                <Server size={20} color="#2563eb" />
              </div>
              2. Hébergement & Infrastructure
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
              Les infrastructures d'hébergement et les bases de données de DëkuWaay sont déployées sur des serveurs haute sécurité garantissant une disponibilité de 99.9% et un chiffrement renforcé des données (SSL / HTTPS TLS 1.3).
            </p>
          </div>

          {/* SECTION 3: PROPRIÉTÉ INTELLECTUELLE */}
          <div style={{
            backgroundColor: 'var(--color-bg)',
            padding: '1.75rem',
            borderRadius: '18px',
            border: '1px solid var(--color-border)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              margin: '0 0 1.25rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
                <ShieldCheck size={20} color="#2563eb" />
              </div>
              3. Propriété Intellectuelle
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: '0 0 1rem 0', fontSize: '0.95rem' }}>
              L'ensemble du contenu présent sur le site DëkuWaay (logos, textes, visuels, architecture logicielle, bases de données) est protégé par les lois sur la propriété intellectuelle au Sénégal et à l'international.
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
              Toute reproduction, distribution ou extraction non autorisée d'éléments de la plateforme est strictement interdite sans accord écrit préalable de DëkuWaay.
            </p>
          </div>

          {/* SECTION 4: PROTECTION DES DONNÉES */}
          <div style={{
            backgroundColor: 'var(--color-bg)',
            padding: '1.75rem',
            borderRadius: '18px',
            border: '1px solid var(--color-border)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              margin: '0 0 1.25rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
                <Globe size={20} color="#2563eb" />
              </div>
              4. Protection des Données Personnelles
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
              Conformément à la réglementation sénégalaise relative à la protection des données personnelles (Commission des Données Personnelles - CDP), vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour plus de détails, vous pouvez consulter notre <a href="/politique-confidentialite" style={{ color: '#2563eb', fontWeight: 600 }}>Politique de Confidentialité</a>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MentionsLegales;