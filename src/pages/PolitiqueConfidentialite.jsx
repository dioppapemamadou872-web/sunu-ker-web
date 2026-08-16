import { ShieldCheck, Lock, Database, Target, Clock, HardDrive, UserCheck, Calendar, FileText, Eye } from 'lucide-react';

function PolitiqueConfidentialite() {
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
            <Lock size={16} color="#60a5fa" />
            <span>Protection des Données</span>
          </div>

          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            margin: '0 0 0.75rem 0',
            color: '#ffffff',
            letterSpacing: '-0.025em'
          }}>
            Politique de Confidentialité
          </h1>

          <p style={{
            margin: '0 auto 1.25rem auto',
            opacity: 0.9,
            fontSize: '1.05rem',
            maxWidth: '580px',
            lineHeight: 1.6
          }}>
            Comment nous protégeons vos données personnelles et garantissons la sécurité de vos échanges sur DëkuWaay.
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
          
          {/* SECTION 1 */}
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
              margin: '0 0 1rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
                <ShieldCheck size={20} color="#2563eb" />
              </div>
              1. Engagement sur la confidentialité
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
              Chez DëkuWaay, nous accordons une importance primordiale au respect de votre vie privée et à la protection de vos données personnelles. La présente politique décrit de manière transparente la façon dont nous collectons, utilisons et sécurisons vos informations.
            </p>
          </div>

          {/* SECTION 2 */}
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
              margin: '0 0 1rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
                <Database size={20} color="#2563eb" />
              </div>
              2. Données collectées
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: '0 0 0.75rem 0', fontSize: '0.95rem' }}>
              Nous ne collectons que les informations strictement nécessaires à la mise en relation immobilière et à la gestion de votre compte :
            </p>
            <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, margin: 0, paddingLeft: '1.25rem', fontSize: '0.95rem' }}>
              <li><strong>Compte Bailleur :</strong> Prénom, nom, numéro de téléphone, numéro WhatsApp, adresse email facultative et photo de profil.</li>
              <li><strong>Formulaire de contact :</strong> Prénom, nom et numéro de téléphone pour la mise en relation directe.</li>
              <li><strong>Alerte Recherche :</strong> Critères de recherche (secteur, budget, type) et coordonnées de contact.</li>
            </ul>
          </div>

          {/* SECTION 3 */}
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
              margin: '0 0 1rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
                <Eye size={20} color="#2563eb" />
              </div>
              3. Utilisation des données
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
              Vos données personnelles sont utilisées exclusivement pour assurer le bon fonctionnement de nos services (mise en relation avec les propriétaires, notifications d'alertes WhatsApp/Email et vérification des annonces). <strong>Vos données ne sont jamais vendues, cédées ou louées à des tiers.</strong>
            </p>
          </div>

          {/* SECTION 4 */}
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
              margin: '0 0 1rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
                <Lock size={20} color="#2563eb" />
              </div>
              4. Sécurité & Chiffrement
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
              Tous les mots de passe sont hachés de manière sécurisée via l'algorithme `bcrypt` avant stockage. Les échanges entre votre navigateur et nos serveurs sont intégralement chiffrés via le protocole HTTPS / TLS.
            </p>
          </div>

          {/* SECTION 5 */}
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
              margin: '0 0 1rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
                <UserCheck size={20} color="#2563eb" />
              </div>
              5. Vos droits (Accès, Modification, Suppression)
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
              Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles à tout moment depuis votre espace personnel ou en nous écrivant directement via notre page de contact.
            </p>
          </div>

          {/* SECTION 6 */}
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
              margin: '0 0 1rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
                <HardDrive size={20} color="#2563eb" />
              </div>
              6. Stockage local & Cookies
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
              DëkuWaay utilise le stockage local (`localStorage`) de votre navigateur exclusivement pour conserver votre préférence de thème (clair/sombre) et maintenir votre session active. Aucun cookie tiers ou traceur publicitaire n'est déposé sur votre appareil.
            </p>
          </div>

          {/* SECTION 7 */}
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
              margin: '0 0 1rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
                <UserCheck size={20} color="#2563eb" />
              </div>
              7. Vos Droits
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
              Vous bénéficiez d'un droit d'accès, de rectification et d'effacement de vos données personnelles. Vous pouvez exercer ce droit directement depuis "Mon espace" ou en contactant notre équipe via la page <a href="/contact" style={{ color: '#2563eb', fontWeight: 600 }}>Contact</a>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PolitiqueConfidentialite;