import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Check, X, ArrowRight } from 'lucide-react';
import { useProprietaire } from '../context/ProprietaireContext';
import ChampMotDePasse from '../components/ChampMotDePasse';
import ChampTelephone from '../components/ChampTelephone';

function InscriptionProprietaire() {
  const { inscrire } = useProprietaire();
  const navigate = useNavigate();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [memeWhatsapp, setMemeWhatsapp] = useState(true);
  const [whatsapp, setWhatsapp] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmMotDePasse, setConfirmMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');

  const mdpEgaux = Boolean(motDePasse && confirmMotDePasse && motDePasse === confirmMotDePasse);
  const mdpDifferents = Boolean(motDePasse && confirmMotDePasse && motDePasse !== confirmMotDePasse);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');

    if (telephone.length !== 9) {
      setErreur('Le numéro de téléphone doit contenir exactement 9 chiffres.');
      return;
    }

    if (!memeWhatsapp && whatsapp.length !== 9) {
      setErreur('Le numéro WhatsApp doit contenir exactement 9 chiffres.');
      return;
    }

    if (motDePasse.length < 8) {
      setErreur('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (motDePasse !== confirmMotDePasse) {
      setErreur('Le mot de passe et sa confirmation ne correspondent pas.');
      return;
    }

    try {
      await inscrire(prenom, nom, telephone, memeWhatsapp ? telephone : whatsapp, motDePasse);
      navigate('/mon-espace');
    } catch (err) {
      setErreur(err.message);
    }
  }

  return (
    <div className="auth-card-modern">
      <div className="auth-header">
        <div className="auth-icon-badge">
          <UserPlus size={22} />
        </div>
        <h2>Créer un compte propriétaire</h2>
        <p className="auth-subtitle">Publiez vos annonces et gérez vos logements sur DëkuWaay.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form-body">
        <div className="form-row-2">
          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Ex: Seydou"
              required
            />
          </div>
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex: Diop"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Numéro de téléphone principal (9 chiffres)</label>
          <ChampTelephone value={telephone} onChange={setTelephone} required />
        </div>

        <label className="checkbox-row-modern">
          <input
            type="checkbox"
            checked={memeWhatsapp}
            onChange={(e) => setMemeWhatsapp(e.target.checked)}
          />
          <span>Mon numéro WhatsApp est identique au numéro principal</span>
        </label>

        {!memeWhatsapp && (
          <div className="form-group" style={{ marginTop: '10px' }}>
            <label>Numéro WhatsApp (9 chiffres)</label>
            <ChampTelephone value={whatsapp} onChange={setWhatsapp} required />
          </div>
        )}

        <div className="form-group" style={{ marginTop: '12px' }}>
          <label>Mot de passe (8 caractères minimum)</label>
          <ChampMotDePasse
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <div className="form-group">
          <label>Confirmer le mot de passe</label>
          <ChampMotDePasse
            value={confirmMotDePasse}
            onChange={(e) => setConfirmMotDePasse(e.target.value)}
            required
            minLength={8}
          />
          {mdpEgaux && (
            <span className="password-match-badge match">
              <Check size={13} /> Les mots de passe correspondent
            </span>
          )}
          {mdpDifferents && (
            <span className="password-match-badge mismatch">
              <X size={13} /> Les mots de passe ne correspondent pas
            </span>
          )}
        </div>

        {erreur && <p className="alert-error-msg">{erreur}</p>}

        <button type="submit" className="btn-primary auth-submit-btn">
          <span>Créer mon compte</span>
          <ArrowRight size={16} />
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Déjà un compte ?{' '}
          <Link to="/connexion" className="auth-link-bold">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}

export default InscriptionProprietaire;