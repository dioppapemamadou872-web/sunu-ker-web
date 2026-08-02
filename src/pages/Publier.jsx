import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus, Lock, PlusCircle, CheckCircle2 } from 'lucide-react';
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
    <div className="publier-page-modern">
      {/* HEADER BANNER */}
      <div className="publier-page-header text-center">
        <div className="publier-badge-top">
          <PlusCircle size={15} /> Déposer une annonce
        </div>
        <h1>Publier un logement</h1>
        <p>Votre annonce sera visible publiquement uniquement après validation par notre équipe.</p>
      </div>

      <div className="card publier-card-main">
        {confirme ? (
          <div className="publier-success-banner">
            <CheckCircle2 size={42} style={{ color: 'var(--color-secondary)' }} />
            <h3>Annonce soumise avec succès !</h3>
            <p>Votre annonce a bien été soumise et est actuellement en attente de validation par notre équipe.</p>
            <button className="btn-primary" onClick={() => navigate('/mon-espace')} style={{ marginTop: '14px' }}>
              Voir mes annonces
            </button>
          </div>
        ) : (
          <div className="publier-wrapper">
            {!estConnecte && (
              <div className="publier-verrou">
                <div className="publier-verrou-card">
                  <Lock size={32} style={{ color: 'var(--color-primary)' }} />
                  <h3>Connectez-vous pour publier</h3>
                  <p>Créez un compte propriétaire ou connectez-vous pour pouvoir remplir et soumettre votre annonce.</p>
                  <div className="verrou-btns-group">
                    <Link to="/connexion" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                      <LogIn size={16} /> Se connecter
                    </Link>
                    <Link to="/inscription" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
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
    </div>
  );
}

export default Publier;