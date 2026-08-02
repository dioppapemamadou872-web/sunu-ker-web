import { useState } from 'react';
import { ChevronDown, Phone, MessageCircle, Mail, Clock, Headset, Send, HelpCircle } from 'lucide-react';

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

  function handleSubmit(e) {
    e.preventDefault();
    setEnvoye(true);
  }

  return (
    <div>
      <div className="contact-grid">
        <div className="card contact-infos">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Headset size={20} style={{ color: 'var(--color-primary)' }} />Nous contacter</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '-8px' }}>
            Une question, un problème avec une annonce ou votre compte ? Notre équipe est là pour vous aider.
          </p>

          <div className="contact-infos-list">
            <div className="contact-info-item">
              <div className="contact-info-icon"><Phone size={18} /></div>
              <div>
                <span>Téléphone</span>
                <strong>+221 77 535 02 29</strong>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon"><MessageCircle size={18} /></div>
              <div>
                <span>WhatsApp</span>
                <strong>+221 77 535 02 29</strong>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon"><Mail size={18} /></div>
              <div>
                <span>Email</span>
                <strong>contact@sunukeur.com</strong>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon"><Clock size={18} /></div>
              <div>
                <span>Horaires</span>
                <strong>24h/24, 7j/7</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="card contact-form-card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Send size={19} style={{ color: 'var(--color-primary)' }} />Envoyez-nous un message</h2>

          {envoye ? (
            <div className="alert-success">
              <p>Votre message a bien été envoyé. Nous vous répondrons rapidement.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Nom</label>
                <input type="text" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" required />
              </div>
              <div className="form-group contact-form-message">
                <label>Message</label>
                <textarea required />
              </div>
              <button type="submit" className="btn-primary">Envoyer</button>
            </form>
          )}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><HelpCircle size={19} style={{ color: 'var(--color-primary)' }} />Questions fréquentes</h3>
        {questions.map((item, i) => (
          <div key={i} className="faq-item">
            <button className="faq-question" onClick={() => setOuverte(ouverte === i ? null : i)}>
              <span>{item.q}</span>
              <ChevronDown size={18} style={{ transform: ouverte === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {ouverte === i && <p className="faq-reponse">{item.r}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Contact;