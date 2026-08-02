import { useState } from 'react';
import { ImagePlus, X, Check, ChevronRight, ChevronLeft, ClipboardList, FileEdit, Camera, ShieldCheck, Send } from 'lucide-react';
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
      {/* STEPPER BAR */}
      <div className="stepper-v2">
        {etapes.map(({ id, label, icon: Icon }, index) => (
          <div key={id} className="stepper-item-v2">
            <div className={`stepper-circle-v2 ${etapeActuelle === id ? 'active' : ''} ${etapeActuelle > id ? 'done' : ''}`}>
              {etapeActuelle > id ? <Check size={16} /> : <Icon size={16} />}
            </div>
            <span className={`stepper-label-v2 ${etapeActuelle === id ? 'active' : ''}`}>{label}</span>
            {index < etapes.length - 1 && <div className={`stepper-line-v2 ${etapeActuelle > id ? 'done' : ''}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="formulaire-logement-body">
        {etapeActuelle === 1 && (
          <div className="etape-contenu">
            <h4 className="etape-title">
              <ClipboardList size={18} style={{ color: 'var(--color-primary)' }} /> Informations principales
            </h4>

            <div className="form-group">
              <label>Titre de l'annonce</label>
              <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex : Studio meublé proche mer" required />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Secteur / Quartier</label>
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
            </div>

            <div className="form-group">
              <label>Prix mensuel (FCFA)</label>
              <input type="number" value={prix} onChange={(e) => setPrix(e.target.value)} onWheel={bloquerScroll} placeholder="Ex : 150000" required />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Nombre de chambres</label>
                <input type="number" min="0" value={chambres} onChange={(e) => setChambres(e.target.value)} onWheel={bloquerScroll} />
              </div>
              <div className="form-group">
                <label>Nombre de salons</label>
                <input type="number" min="0" value={salons} onChange={(e) => setSalons(e.target.value)} onWheel={bloquerScroll} />
              </div>
            </div>
          </div>
        )}

        {etapeActuelle === 2 && (
          <div className="etape-contenu">
            <h4 className="etape-title">
              <FileEdit size={18} style={{ color: 'var(--color-primary)' }} /> Description détaillée
            </h4>

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
            <h4 className="etape-title">
              <Camera size={18} style={{ color: 'var(--color-primary)' }} /> Photos & Déclaration
            </h4>

            <div className="form-group">
              <label>Photos du logement (8 maximum)</label>
              <label className="photo-upload-zone">
                <ImagePlus size={24} style={{ color: 'var(--color-primary)' }} />
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
            <h4 className="etape-title">
              <ShieldCheck size={18} style={{ color: 'var(--color-primary)' }} /> Récapitulatif de votre annonce
            </h4>

            <div className="recap-box">
              <div className="recap-ligne"><span>Titre</span><strong>{titre || '—'}</strong></div>
              <div className="recap-ligne"><span>Secteur</span><strong>{secteur}</strong></div>
              <div className="recap-ligne"><span>Type</span><strong>{type}</strong></div>
              <div className="recap-ligne"><span>Prix</span><strong>{prix ? `${Number(prix).toLocaleString()} FCFA / mois` : '—'}</strong></div>
              <div className="recap-ligne"><span>Chambres / Salons</span><strong>{chambres} chambre(s) / {salons} salon(s)</strong></div>
              <div className="recap-ligne"><span>Photos</span><strong>{photos.length} photo{photos.length > 1 ? 's' : ''} transférée(s)</strong></div>
              <div className="recap-ligne">
                <span>Statut déclarant</span>
                <strong>{statutsDeclarant.find((s) => s.value === statutDeclarant)?.label}</strong>
              </div>
              {description && (
                <div className="recap-description">
                  <span>Description</span>
                  <p>{description}</p>
                </div>
              )}
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '12px' }}>
              Votre annonce sera visible publiquement uniquement après validation par notre équipe.
            </p>
          </div>
        )}

        {erreurEtape && <p className="alert-error-msg">{erreurEtape}</p>}

        <div className="etape-navigation">
          {etapeActuelle > 1 && (
            <button type="button" className="btn-secondary" onClick={allerEtapePrecedente} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ChevronLeft size={16} /> Précédent
            </button>
          )}

          <div style={{ flex: 1 }} />

          {etapeActuelle < 4 ? (
            <button type="button" className="btn-primary" onClick={allerEtapeSuivante} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              Suivant <ChevronRight size={16} />
            </button>
          ) : (
            <button type="submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Send size={16} /> Soumettre l'annonce
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FormulaireLogement;