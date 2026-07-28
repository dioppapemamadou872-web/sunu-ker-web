import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProprietaire } from '../context/ProprietaireContext';
import ChampMotDePasse from '../components/ChampMotDePasse';
import ChampTelephone from '../components/ChampTelephone';

function ConnexionProprietaire() {
  const { connecter } = useProprietaire();
  const navigate = useNavigate();
  const [telephone, setTelephone] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');
    try {
      await connecter(telephone, motDePasse);
      navigate('/mon-espace');
    } catch (err) {
      setErreur(err.message);
    }
  }

  return (
    <div className="card" style={{ maxWidth: '440px' }}>
      <h2>Connexion propriétaire</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Numéro de téléphone</label>
          <ChampTelephone value={telephone} onChange={setTelephone} required />
        </div>
        <div className="form-group">
          <label>Mot de passe</label>
          <ChampMotDePasse value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required />
        </div>
        {erreur && <p style={{ color: 'var(--color-error)' }}>{erreur}</p>}
        <button type="submit" className="btn-primary">Se connecter</button>
      </form>
      <p style={{ marginTop: '16px', fontSize: '0.9rem' }}>
        Pas encore de compte ? <Link to="/inscription" style={{ color: 'var(--color-primary)' }}>Inscrivez-vous</Link>
      </p>
    </div>
  );
}

export default ConnexionProprietaire;