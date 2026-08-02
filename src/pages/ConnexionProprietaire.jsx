import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, ArrowRight, ShieldCheck } from 'lucide-react';
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
    <div className="auth-card-modern">
      <div className="auth-header">
        <div className="auth-icon-badge">
          <LogIn size={22} />
        </div>
        <h2>Connexion Propriétaire</h2>
        <p className="auth-subtitle">Accédez à votre espace bailleur SunuKeur.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form-body">
        <div className="form-group">
          <label>Numéro de téléphone</label>
          <ChampTelephone value={telephone} onChange={setTelephone} required />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <ChampMotDePasse value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required />
        </div>

        {erreur && <p className="alert-error-msg">{erreur}</p>}

        <button type="submit" className="btn-primary auth-submit-btn">
          <span>Se connecter</span>
          <ArrowRight size={16} />
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="auth-link-bold">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ConnexionProprietaire;