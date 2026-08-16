import { useState } from 'react';
import { Lock, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoIcon from '../assets/logo-icon.png';

function AdminLogin() {
  const { connecter } = useAuth();
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      await connecter(motDePasse);
    } catch {
      setErreur('Mot de passe administrateur incorrect.');
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-logo">
            <img src={logoIcon} alt="DëkuWaay" className="logo-icon" />
            <span className="navbar-brand">
              <span className="logo-sunu">Dëku</span>
              <span className="logo-keur">Waay</span>
            </span>
          </div>
          <div className="admin-badge-security">
            <ShieldCheck size={14} /> Espace Administration SÉCURISÉ
          </div>
          <h2>Connexion Admin</h2>
          <p>Saisissez le mot de passe maître pour accéder au panneau de gestion.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label className="form-label">
              <KeyRound size={15} /> Mot de passe administrateur
            </label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="••••••••••••"
                required
                autoFocus
              />
            </div>
          </div>

          {erreur && (
            <div className="admin-login-error">
              <AlertCircle size={16} />
              <span>{erreur}</span>
            </div>
          )}

          <button type="submit" className="btn-primary admin-login-btn" disabled={chargement}>
            {chargement ? (
              <span>Vérification...</span>
            ) : (
              <>
                <span>Accéder au Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;