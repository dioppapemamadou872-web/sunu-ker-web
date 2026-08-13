import { Scale, FileText, UserCheck, ShieldCheck, CheckCircle2, AlertTriangle, Trash2, RefreshCw, Calendar } from 'lucide-react';

function ConditionsUtilisation() {
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
            <Scale size={16} color="#60a5fa" />
            <span>Cadre Contractuel</span>
          </div>

          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            margin: '0 0 0.75rem 0',
            color: '#ffffff',
            letterSpacing: '-0.025em'
          }}>
            Conditions Générales d'Utilisation
          </h1>

          <p style={{
            margin: '0 auto 1.25rem auto',
            opacity: 0.9,
            fontSize: '1.05rem',
            maxWidth: '580px',
            lineHeight: 1.6
          }}>
            Les règles et principes régissant l'utilisation de la plateforme immobilière SunuKeur.
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
                <FileText size={20} color="#2563eb" />
              </div>
              1. Objet du service
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
              SunuKeur est une plateforme numérique facilitant la recherche, la publication et la mise en relation pour la location et la vente de logements à Dakar et au Sénégal. SunuKeur agit en qualité d'intermédiaire technique et n'est pas partie directe aux baux de location conclus entre les utilisateurs.
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
                <UserCheck size={20} color="#2563eb" />
              </div>
              2. Inscription et Déclaration sur l'Honneur
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
              La publication d'une annonce requiert la création d'un compte propriétaire. Le publicateur certifie son statut (propriétaire direct, mandataire ou membre de la famille autorisé) et signe une déclaration sur l'honneur certifiant détenir les droits requis. Toute fausse déclaration entraîne la suspension immédiate du compte.
            </p>
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
                <ShieldCheck size={20} color="#2563eb" />
              </div>
              3. Procédure de Modération & Vérification
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
              Chaque annonce fait l'objet d'un examen attentif avant sa mise en ligne. SunuKeur se réserve le droit de solliciter des justificatifs complémentaires en cas de doute, d'ajuster ou de refuser toute annonce ne satisfaisant pas aux critères de qualité et de sécurité de la plateforme.
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
                <CheckCircle2 size={20} color="#2563eb" />
              </div>
              4. Engagement et Règles de Conduite
            </h2>
            <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, margin: 0, paddingLeft: '1.25rem', fontSize: '0.95rem' }}>
              <li>Fournir des données exactes, sincères et actualisées.</li>
              <li>Ne publier que des logements réels et réellement disponibles à la location.</li>
              <li>S'interdire tout comportement frauduleux ou tentative de tromperie.</li>
              <li>Traiter l'ensemble des interlocuteurs avec courtoisie et respect.</li>
            </ul>
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
                <AlertTriangle size={20} color="#2563eb" />
              </div>
              5. Limitation de Responsabilité
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
              Bien que SunuKeur mette en œuvre des procédures rigoureuses de contrôle des annonces, les utilisateurs demeurent seuls responsables des accords, baux et transactions financières qu'ils concluent. SunuKeur ne saurait être tenu responsable des différends ultérieurs entre bailleurs et locataires.
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
                <Trash2 size={20} color="#2563eb" />
              </div>
              6. Clôture de Compte
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
              Tout utilisateur a la faculté d'effectuer à tout moment la fermeture de son compte depuis son espace personnel. La clôture du compte entraîne la suppression irréversible de ses données et des annonces associées.
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
                <RefreshCw size={20} color="#2563eb" />
              </div>
              7. Évolution des Conditions
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
              SunuKeur se réserve le droit d'actualiser les présentes conditions d'utilisation afin de les adapter aux évolutions légales ou techniques. La date de dernière mise à jour est systématiquement mentionnée en haut de la présente page.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ConditionsUtilisation;