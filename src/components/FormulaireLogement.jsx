import { useState } from 'react';
import { ImagePlus, X, Check, ChevronRight, ChevronLeft, ClipboardList, FileEdit, Camera, ShieldCheck } from 'lucide-react';
import { secteurs, typesLogement } from '../data/logements';

const etapes = [
  { id: 1, label: 'Informations', icon: ClipboardList },
  { id: 2, label: 'Description', icon: FileEdit },
  { id: 3, label: 'Photos', icon: Camera },
  { id: 4, label: 'Validation', icon: ShieldCheck },
];

const statutsDeclarant = [
  { value: 'proprietaire', label: 'Propriétaire' },
  { value: 'mandataire', label: 'Mandataire' },
  { value: 'famille', label: 'Membre de la famille autorisé' },
];

function bloquerScroll(e) {
  e.target.blur();
}

function FormulaireLogement({ onPublier }) {
  const [etapeActuelle, setEtapeActuelle] = useState(1);
  const [erreurEtape, setErreurEtape] = useState('');

  const [titre, setTitre] = useState('');
  const [secteur, setSecteur] = useState(secteurs[0]);
  const [type, setType] = useState(typesLogement[0]);
  const [prix, setPrix] = useState('');
  const [chambres, setChambres] = useState(1);
  const [salons, setSalons] = useState(1);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [statutDeclarant, setStatutDeclarant] = useState('proprietaire');
  const [declarationHonneur, setDeclarationHonneur] = useState(false);

  function gererSelectionPhotos(e) {
    const fichiers = Array.from(e.target.files).slice(0, 8);
    setPhotos(fichiers);
    setPreviews(fichiers.map((f) => URL.createObjectURL(f)));
  }

  function retirerPhoto(index) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function allerEtapeSuivante() {
    setErreurEtape('');

    if (etapeActuelle === 1) {
      if (!titre.trim() || !prix || Number(prix) <= 0) {
        setErreurEtape('Merci de renseigner au moins le titre et un prix valide.');
        return;
      }
    }

    if (etapeActuelle === 3) {
      if (!declarationHonneur) {
        setErreurEtape('Merci de cocher la déclaration sur l\'honneur pour continuer.');
        return;
      }
    }

    setEtapeActuelle((e) => Math.min(e + 1, 4));
  }

  function allerEtapePrecedente() {
    setErreurEtape('');
    setEtapeActuelle((e) => Math.max(e - 1, 1));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('secteur', secteur);
    formData.append('type', type);
    formData.append('prix', prix);
    formData.append('chambres', chambres);
    formData.append('salons', salons);
    formData.append('description', description);
    photos.forEach((photo) => formData.append('photos', photo));
    formData.append('statutDeclarant', statutDeclarant);
    formData.append('declarationHonneur', declarationHonneur ? 'true' : 'false');

    onPublier(formData);
  }

  return (
    <div>
      <div className="stepper">
        {etapes.map(({ id, label, icon: Icon }, index) => (
          <div key={id} className="stepper-item">
            <div className={`stepper-circle ${etapeActuelle === id ? 'active' : ''} ${etapeActuelle > id ? 'done' : ''}`}>
              {etapeActuelle > id ? <Check size={16} /> : <Icon size={16} />}
            </div>
            <span className={`stepper-label ${etapeActuelle === id ? 'active' : ''}`}>{label}</span>
            {index < etapes.length - 1 && <div className={`stepper-line ${etapeActuelle > id ? 'done' : ''}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {etapeActuelle === 1 && (
          <div className="etape-contenu">
            <div className="form-group">
              <label>Titre de l'annonce</label>
              <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex : Studio meublé proche mer" required />
            </div>

            <div className="form-group">
              <label>Secteur</label>
              <select value={secteur} onChange={(e) => setSecteur(e.target.value)}>
                {secteurs.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>

            <div className="form-group">
              <label>Type de logement</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                {typesLogement.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>

            <div className="form-group">
              <label>Prix mensuel (FCFA)</label>
              <input type="number" value={prix} onChange={(e) => setPrix(e.target.value)} onWheel={bloquerScroll} required />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Chambres</label>
                <input type="number" min="0" value={chambres} onChange={(e) => setChambres(e.target.value)} onWheel={bloquerScroll} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Salons</label>
                <input type="number" min="0" value={salons} onChange={(e) => setSalons(e.target.value)} onWheel={bloquerScroll} />
              </div>
            </div>
          </div>
        )}

        {etapeActuelle === 2 && (
          <div className="etape-contenu">
            <div className="form-group">
              <label>Description du logement</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez le logement : équipements, disponibilité, accès, ambiance du quartier..."
                style={{ minHeight: '160px' }}
              />
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              Une description détaillée et honnête inspire davantage confiance aux locataires potentiels.
            </p>
          </div>
        )}

        {etapeActuelle === 3 && (
          <div className="etape-contenu">
            <div className="form-group">
              <label>Photos du logement (8 maximum)</label>
              <label className="photo-upload-zone">
                <ImagePlus size={20} />
                <span>Cliquez pour ajouter des photos</span>
                <input type="file" accept="image/*" multiple onChange={gererSelectionPhotos} hidden />
              </label>

              {previews.length > 0 && (
                <div className="photo-preview-grid">
                  {previews.map((url, i) => (
                    <div key={i} className="photo-preview-item">
                      <img src={url} alt={`Aperçu ${i + 1}`} />
                      <button type="button" onClick={() => retirerPhoto(i)} className="photo-remove-btn">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="verification-box">
              <div className="form-group">
                <label>Vous êtes :</label>
                <select value={statutDeclarant} onChange={(e) => setStatutDeclarant(e.target.value)}>
                  {statutsDeclarant.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                </select>
              </div>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={declarationHonneur}
                  onChange={(e) => setDeclarationHonneur(e.target.checked)}
                  style={{ marginTop: '2px' }}
                />
                <span>
                  Je certifie être le propriétaire du logement ou être autorisé à publier cette annonce.
                </span>
              </label>
            </div>
          </div>
        )}

        {etapeActuelle === 4 && (
          <div className="etape-contenu">
            <div className="recap-box">
              <div className="recap-ligne"><span>Titre</span><strong>{titre || '—'}</strong></div>
              <div className="recap-ligne"><span>Secteur</span><strong>{secteur}</strong></div>
              <div className="recap-ligne"><span>Type</span><strong>{type}</strong></div>
              <div className="recap-ligne"><span>Prix</span><strong>{prix ? `${Number(prix).toLocaleString()} FCFA` : '—'}</strong></div>
              <div className="recap-ligne"><span>Chambres / Salons</span><strong>{chambres} / {salons}</strong></div>
              <div className="recap-ligne"><span>Photos</span><strong>{photos.length} photo{photos.length > 1 ? 's' : ''}</strong></div>
              <div className="recap-ligne">
                <span>Statut</span>
                <strong>{statutsDeclarant.find((s) => s.value === statutDeclarant)?.label}</strong>
              </div>
              {description && (
                <div className="recap-description">
                  <span>Description</span>
                  <p>{description}</p>
                </div>
              )}
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Votre annonce sera visible publiquement uniquement après validation par notre équipe.
            </p>
          </div>
        )}

        {erreurEtape && <p style={{ color: 'var(--color-error)', fontSize: '0.85rem' }}>{erreurEtape}</p>}

        <div className="etape-navigation">
          {etapeActuelle > 1 && (
            <button type="button" className="btn-secondary" onClick={allerEtapePrecedente} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ChevronLeft size={16} /> Précédent
            </button>
          )}

          <div style={{ flex: 1 }} />

          {etapeActuelle < 4 ? (
            <button type="button" className="btn-primary" onClick={allerEtapeSuivante} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              Suivant <ChevronRight size={16} />
            </button>
          ) : (
            <button type="submit" className="btn-primary">Soumettre l'annonce</button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FormulaireLogement;