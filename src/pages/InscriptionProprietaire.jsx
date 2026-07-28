import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProprietaire } from '../context/ProprietaireContext';
import ChampMotDePasse from '../components/ChampMotDePasse';
import ChampTelephone from '../components/ChampTelephone';

function InscriptionProprietaire() {
  const { inscrire } = useProprietaire();
  const navigate = useNavigate();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');

    if (telephone.length !== 9) {
      setErreur('Le numéro de téléphone doit contenir exactement 9 chiffres.');
      return;
    }

    if (motDePasse.length < 8) {
      setErreur('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    try {
      await inscrire(prenom, nom, telephone, motDePasse);
      navigate('/mon-espace');
    } catch (err) {
      setErreur(err.message);
    }
  }

  return (
    <div className="card" style={{ maxWidth: '440px' }}>
      <h2>Créer un compte propriétaire</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Prénom</label>
            <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Nom</label>
            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
          </div>
        </div>
        <div className="form-group">
          <label>Numéro de téléphone (9 chiffres)</label>
          <ChampTelephone value={telephone} onChange={setTelephone} required />
        </div>
        <div className="form-group">
          <label>Mot de passe (8 caractères minimum)</label>
          <ChampMotDePasse value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required minLength={8} />
        </div>
        {erreur && <p style={{ color: 'var(--color-error)' }}>{erreur}</p>}
        <button type="submit" className="btn-primary">Créer mon compte</button>
      </form>
      <p style={{ marginTop: '16px', fontSize: '0.9rem' }}>
        Déjà un compte ? <Link to="/connexion" style={{ color: 'var(--color-primary)' }}>Connectez-vous</Link>
      </p>
    </div>
  );
}

export default InscriptionProprietaire;