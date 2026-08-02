import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus, Lock } from 'lucide-react';
import { useLogements } from '../context/LogementsContext';
import { useProprietaire } from '../context/ProprietaireContext';
import FormulaireLogement from '../components/FormulaireLogement';

function Publier() {
  const { ajouterLogement } = useLogements();
  const { token, estConnecte } = useProprietaire();
  const [confirme, setConfirme] = useState(false);
  const navigate = useNavigate();

  async function handlePublier(formData) {
    await ajouterLogement(formData, token);
    setConfirme(true);
  }

  return (
    <div className="card">
      <h2>Publier un logement</h2>
      <p>Votre annonce sera visible publiquement uniquement après validation par notre équipe.</p>

      {confirme ? (
        <div className="alert-success">
          <p>Votre annonce a bien été soumise et est en attente de validation.</p>
          <button className="btn-primary" onClick={() => navigate('/mon-espace')}>
            Voir mes annonces
          </button>
        </div>
      ) : (
        <div className="publier-wrapper">
          {!estConnecte && (
            <div className="publier-verrou">
              <div className="publier-verrou-card">
                <Lock size={26} style={{ color: 'var(--color-primary)' }} />
                <h3>Connectez-vous pour publier</h3>
                <p>Créez un compte propriétaire ou connectez-vous pour pouvoir remplir et soumettre votre annonce.</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Link to="/connexion" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                    <LogIn size={16} /> Se connecter
                  </Link>
                  <Link to="/inscription" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                    <UserPlus size={16} /> Créer un compte
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className={!estConnecte ? 'publier-form-verrouille' : ''}>
            <FormulaireLogement onPublier={handlePublier} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Publier;