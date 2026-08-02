import { useState } from 'react';
import { ChevronDown, Phone, MessageCircle, Mail, Clock, Headset, Send, HelpCircle, CheckCircle2, PhoneCall } from 'lucide-react';

const questions = [
  {
    q: 'Comment publier une annonce sur SunuKeur ?',
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
    q: 'Est-ce que l\'utilisation de SunuKeur est payante ?',
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
      <div className="contact-page-header text-center">
        <div className="contact-badge-top">
          <Headset size={15} /> Support SunuKeur
        </div>
        <h1>Nous contacter</h1>
        <p>Une question, un problème avec une annonce ou votre compte ? Notre équipe est là pour vous aider.</p>
      </div>

      {/* GRID CONTACT & FORM */}
      <div className="contact-grid-v2">
        {/* INFOS CARDS */}
        <div className="card contact-card-left">
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

            <a href="mailto:contact@sunukeur.com" className="channel-item">
              <div className="channel-icon-bg info">
                <Mail size={18} />
              </div>
              <div>
                <span className="channel-title">Email</span>
                <strong className="channel-detail">contact@sunukeur.com</strong>
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
        </div>

        {/* FORM CARD */}
        <div className="card contact-card-right">
          <h3>
            <Send size={19} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)' }} />
            Envoyez-nous un message
          </h3>
          <p className="card-subtext">Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.</p>

          {envoye ? (
            <div className="contact-success-banner">
              <CheckCircle2 size={36} style={{ color: 'var(--color-secondary)' }} />
              <h4>Message envoyé avec succès !</h4>
              <p>Votre message a bien été envoyé. Nous vous répondrons rapidement.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form-v2">
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <Send size={16} /> Envoyer
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ ACCORDION */}
      <div className="card contact-faq-card">
        <h3>
          <HelpCircle size={19} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)' }} />
          Questions fréquentes
        </h3>
        <p className="card-subtext" style={{ marginBottom: '20px' }}>
          Retrouvez les réponses aux questions les plus posées sur l'utilisation de SunuKeur.
        </p>

        <div className="faq-list-v2">
          {questions.map((item, i) => (
            <div key={i} className={`faq-item-v2 ${ouverte === i ? 'open' : ''}`}>
              <button className="faq-toggle-btn" onClick={() => setOuverte(ouverte === i ? null : i)}>
                <span>{item.q}</span>
                <ChevronDown size={18} className="faq-chevron" />
              </button>
              {ouverte === i && (
                <div className="faq-answer-body">
                  <p>{item.r}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Contact;