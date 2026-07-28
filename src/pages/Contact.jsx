import { useState } from 'react';

function Contact() {
  const [envoye, setEnvoye] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setEnvoye(true);
  }

  return (
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
  );
}

export default Contact;