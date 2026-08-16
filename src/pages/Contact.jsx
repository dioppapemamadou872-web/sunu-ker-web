import { useState } from 'react';
import { ChevronDown, Phone, MessageCircle, Mail, Clock, Headset, Send, HelpCircle, CheckCircle2, PhoneCall } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const questions = [
  {
    q: 'Comment publier une annonce sur DëkuWaay ?',
    r: 'Créez un compte propriétaire, puis rendez-vous sur "Publier une annonce". Remplissez les informations de votre logement (photos, prix, description...) et soumettez. Votre annonce sera vérifiée par notre équipe avant d\'être publiée.',
  },
  {
    q: 'Pourquoi mon annonce est en attente ?',
    r: 'Chaque annonce est vérifiée manuellement par notre équipe avant publication, pour garantir la fiabilité des informations affichées sur la plateforme. Ce délai est généralement court.',
  },
  {
    q: 'Comment contacter un propriétaire ?',
    r: 'Sur la fiche d\'un logement, cliquez sur "Je suis intéressé" et laissez vos coordonnées. Notre équipe se charge de vous mettre en relation avec le propriétaire rapidement.',
  },
  {
    q: 'Comment supprimer mon annonce ?',
    r: 'Rendez-vous dans "Mon espace", puis cliquez sur l\'icône de suppression à côté de l\'annonce concernée.',
  },
  {
    q: 'Est-ce que l\'utilisation de DëkuWaay est payante ?',
    r: 'Non, la publication d\'annonces et la recherche de logements sont actuellement entièrement gratuites.',
  },
];

function Contact() {
  const [envoye, setEnvoye] = useState(false);
  const [ouverte, setOuverte] = useState(null);
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setEnvoye(true);
  }

  return (
    <div className="contact-page-modern">
      {/* HEADER BANNER */}
      <ScrollReveal animation="slide-up">
        <div className="contact-page-header text-center">
          <div className="contact-badge-top">
            <Headset size={15} /> Support DëkuWaay
          </div>
          <h1>Nous contacter</h1>
          <p>Une question, un problème avec une annonce ou votre compte ? Notre équipe est là pour vous aider.</p>
        </div>
      </ScrollReveal>

      {/* GRID CONTACT & FORM */}
      <div className="contact-grid-v2">
        {/* INFOS CARDS */}
        <ScrollReveal animation="slide-up" delay={0} className="card contact-card-left">
          <h3>
            <PhoneCall size={20} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)' }} />
            Contact direct
          </h3>
          <p className="card-subtext">Contactez-nous directement par téléphone, WhatsApp ou email.</p>

          <div className="contact-channels-grid">
            <a href="tel:+221775350229" className="channel-item">
              <div className="channel-icon-bg primary">
                <Phone size={18} />
              </div>
              <div>
                <span className="channel-title">Téléphone</span>
                <strong className="channel-detail">+221 77 535 02 29</strong>
              </div>
            </a>

            <a href="https://wa.me/221775350229" target="_blank" rel="noreferrer" className="channel-item whatsapp">
              <div className="channel-icon-bg whatsapp">
                <MessageCircle size={18} />
              </div>
              <div>
                <span className="channel-title">WhatsApp</span>
                <strong className="channel-detail">+221 77 535 02 29</strong>
              </div>
            </a>

            <a href="mailto:contact@dekuwaay.com" className="channel-item">
              <div className="channel-icon-bg info">
                <Mail size={18} />
              </div>
              <div>
                <span className="channel-title">Email</span>
                <strong className="channel-detail">contact@dekuwaay.com</strong>
              </div>
            </a>

            <div className="channel-item">
              <div className="channel-icon-bg muted">
                <Clock size={18} />
              </div>
              <div>
                <span className="channel-title">Horaires</span>
                <strong className="channel-detail">24h/24, 7j/7</strong>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* FORM CARD (STATIC FOR ZERO SCROLL FLICKER/JUMP) */}
        <div className="card contact-card-right">
          <h3>Formulaire de message</h3>
          <p className="card-subtext">Remplissez ce formulaire, nous vous répondrons sous 24 heures.</p>

          {envoye ? (
            <div className="alert-success-box text-center" style={{ padding: '32px 20px' }}>
              <CheckCircle2 size={40} style={{ color: 'var(--color-secondary)', marginBottom: '12px' }} />
              <h4>Message envoyé avec succès !</h4>
              <p>Merci pour votre message. Notre équipe va le traiter et vous recontacter au plus vite.</p>
              <button
                className="btn-secondary"
                style={{ marginTop: '16px' }}
                onClick={() => {
                  setEnvoye(false);
                  setNom('');
                  setEmail('');
                  setMessage('');
                }}
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="nom">Nom complet</label>
                <input
                  id="nom"
                  type="text"
                  placeholder="Ex : Ousmane Diallo"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Adresse email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Ex : ousmane@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Précisez votre demande..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary btn-block btn-lg" style={{ marginTop: '12px' }}>
                <Send size={16} /> Envoyer le message
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ EXPRESS ACCORDEON */}
      <ScrollReveal animation="slide-up" className="card faq-section-card" style={{ marginTop: '32px' }}>
        <div className="section-title-header">
          <h3>
            <HelpCircle size={20} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)' }} />
            Questions fréquentes
          </h3>
          <p className="card-subtext">Retrouvez les réponses aux questions les plus posées par nos utilisateurs.</p>
        </div>

        <div className="faq-list">
          {questions.map(({ q, r }, i) => (
            <div key={q} className={`faq-item ${ouverte === i ? 'ouverte' : ''}`}>
              <button
                className="faq-question"
                onClick={() => setOuverte(ouverte === i ? null : i)}
                aria-expanded={ouverte === i}
              >
                <span>{q}</span>
                <ChevronDown size={18} className="faq-chevron" />
              </button>
              {ouverte === i && (
                <div className="faq-reponse">
                  <p>{r}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}

export default Contact;