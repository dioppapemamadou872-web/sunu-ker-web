import { useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { secteurs, typesLogement } from '../data/logements';

function FormulaireLogement({ onPublier }) {
  const [titre, setTitre] = useState('');
  const [secteur, setSecteur] = useState(secteurs[0]);
  const [type, setType] = useState(typesLogement[0]);
  const [prix, setPrix] = useState('');
  const [chambres, setChambres] = useState(1);
  const [salons, setSalons] = useState(1);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);

  function gererSelectionPhotos(e) {
    const fichiers = Array.from(e.target.files).slice(0, 8);
    setPhotos(fichiers);
    setPreviews(fichiers.map((f) => URL.createObjectURL(f)));
  }

  function retirerPhoto(index) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
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

    onPublier(formData);

    setTitre('');
    setPrix('');
    setDescription('');
    setPhotos([]);
    setPreviews([]);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Titre de l'annonce</label>
        <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} required />
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
        <input type="number" value={prix} onChange={(e) => setPrix(e.target.value)} required />
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Chambres</label>
          <input type="number" min="0" value={chambres} onChange={(e) => setChambres(e.target.value)} />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Salons</label>
          <input type="number" min="0" value={salons} onChange={(e) => setSalons(e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Photos (8 maximum)</label>
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

      <button type="submit" className="btn-primary">Soumettre l'annonce</button>
    </form>
  );
}

export default FormulaireLogement;