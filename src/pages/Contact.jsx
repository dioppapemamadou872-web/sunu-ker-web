import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
      <div className="card">
        <h2>Contact</h2>

        {envoye ? (
          <p>Merci, votre message a bien été envoyé. Nous vous répondrons rapidement.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom</label>
              <input type="text" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea required />
            </div>
            <button type="submit" className="btn-primary">Envoyer</button>
          </form>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Questions fréquentes</h3>
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