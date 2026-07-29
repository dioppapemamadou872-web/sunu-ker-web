import { useState } from 'react';
import { ImagePlus, X, IdCard, FileText } from 'lucide-react';
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

  const [pieceIdentiteRecto, setPieceIdentiteRecto] = useState(null);
  const [pieceIdentiteVerso, setPieceIdentiteVerso] = useState(null);
  const [justificatifPropriete, setJustificatifPropriete] = useState(null);

  function bloquerScroll(e) {
    e.target.blur();
  }

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

    if (!pieceIdentiteRecto || !pieceIdentiteVerso || !justificatifPropriete) {
      alert('Merci de fournir votre pièce d\'identité (recto/verso) et un justificatif de propriété — obligatoires pour la vérification de votre annonce.');
      return;
    }

    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('secteur', secteur);
    formData.append('type', type);
    formData.append('prix', prix);
    formData.append('chambres', chambres);
    formData.append('salons', salons);
    formData.append('description', description);
    photos.forEach((photo) => formData.append('photos', photo));
    formData.append('pieceIdentiteRecto', pieceIdentiteRecto);
    formData.append('pieceIdentiteVerso', pieceIdentiteVerso);
    formData.append('justificatifPropriete', justificatifPropriete);

    onPublier(formData);

    setTitre('');
    setPrix('');
    setDescription('');
    setPhotos([]);
    setPreviews([]);
    setPieceIdentiteRecto(null);
    setPieceIdentiteVerso(null);
    setJustificatifPropriete(null);
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

      <div className="form-group">
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

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
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', marginTop: 0 }}>
          <IdCard size={18} /> Vérification d'identité (obligatoire)
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '-6px' }}>
          Ces documents sont confidentiels et ne sont visibles que par notre équipe, jamais publiés publiquement. Ils servent uniquement à vérifier votre identité et votre droit de propriété.
        </p>

        <div className="form-group">
          <label>Pièce d'identité — recto</label>
          <label className="photo-upload-zone">
            <IdCard size={18} />
            <span>{pieceIdentiteRecto ? pieceIdentiteRecto.name : 'Cliquez pour ajouter une photo'}</span>
            <input type="file" accept="image/*" onChange={(e) => setPieceIdentiteRecto(e.target.files[0])} hidden required />
          </label>
        </div>

        <div className="form-group">
          <label>Pièce d'identité — verso</label>
          <label className="photo-upload-zone">
            <IdCard size={18} />
            <span>{pieceIdentiteVerso ? pieceIdentiteVerso.name : 'Cliquez pour ajouter une photo'}</span>
            <input type="file" accept="image/*" onChange={(e) => setPieceIdentiteVerso(e.target.files[0])} hidden required />
          </label>
        </div>

        <div className="form-group">
          <label>Justificatif de propriété (titre foncier, contrat, facture...)</label>
          <label className="photo-upload-zone">
            <FileText size={18} />
            <span>{justificatifPropriete ? justificatifPropriete.name : 'Cliquez pour ajouter un document'}</span>
            <input type="file" accept="image/*,.pdf" onChange={(e) => setJustificatifPropriete(e.target.files[0])} hidden required />
          </label>
        </div>
      </div>

      <button type="submit" className="btn-primary">Soumettre l'annonce</button>
    </form>
  );
}

export default FormulaireLogement;