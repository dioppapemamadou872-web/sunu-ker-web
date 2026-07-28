import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useLogements } from '../context/LogementsContext';
import { useProprietaire } from '../context/ProprietaireContext';
import FormulaireLogement from '../components/FormulaireLogement';

function Publier() {
  const { ajouterLogement } = useLogements();
  const { token, estConnecte } = useProprietaire();
  const [confirme, setConfirme] = useState(false);
  const navigate = useNavigate();

  if (!estConnecte) {
    return <Navigate to="/connexion" replace />;
  }

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
        <FormulaireLogement onPublier={handlePublier} />
      )}
    </div>
  );
}

export default Publier;