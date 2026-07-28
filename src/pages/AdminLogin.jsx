import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AdminLogin() {
  const { connecter } = useAuth();
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');
    try {
      await connecter(motDePasse);
    } catch {
      setErreur('Mot de passe incorrect.');
    }
  }

  return (
    <div className="card">
      <h2>Connexion administrateur</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
        </div>
        {erreur && <p style={{ color: '#C9302C' }}>{erreur}</p>}
        <button type="submit" className="btn-primary">Se connecter</button>
      </form>
    </div>
  );
}

export default AdminLogin;