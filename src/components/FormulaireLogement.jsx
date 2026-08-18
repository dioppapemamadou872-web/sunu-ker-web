import { useState } from 'react';
import { ImagePlus, Video, X, Check, ClipboardList, FileEdit, Camera, ShieldCheck, Send, ChevronRight, ChevronLeft, Loader2, Star } from 'lucide-react';
import { secteurs, typesLogement } from '../data/logements';

const etapes = [
  { id: 1, label: 'Informations', icon: ClipboardList },
  { id: 2, label: 'Description', icon: FileEdit },
  { id: 3, label: 'Photos & Vidéos', icon: Camera },
  { id: 4, label: 'Validation', icon: ShieldCheck },
];

const statutsDeclarant = [
  { value: 'proprietaire', label: 'Propriétaire du bien' },
  { value: 'mandataire', label: 'Gérant / Agent mandataire' },
  { value: 'famille', label: 'Membre de la famille' },
];

function bloquerScroll(e) {
  e.target.blur();
}

function FormulaireLogement({ onPublier }) {
  const [etapeActuelle, setEtapeActuelle] = useState(1);
  const [erreurEtape, setErreurEtape] = useState('');
  const [enEnvoi, setEnEnvoi] = useState(false);

  const [titre, setTitre] = useState('');
  const [secteur, setSecteur] = useState(secteurs[0]);
  const [type, setType] = useState(typesLogement[0]);
  const [prix, setPrix] = useState('');
  const [chambres, setChambres] = useState('');
  const [salons, setSalons] = useState('');
  const [sallesDeBain, setSallesDeBain] = useState('');
  const [salleDeBainPrivee, setSalleDeBainPrivee] = useState('oui');
  const [typeCuisine, setTypeCuisine] = useState('privee');

  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [photoCouvertureIndex, setPhotoCouvertureIndex] = useState(0);

  const [videos, setVideos] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [erreurVideo, setErreurVideo] = useState('');

  const [statutDeclarant, setStatutDeclarant] = useState('proprietaire');
  const [declarationHonneur, setDeclarationHonneur] = useState(false);

  function handleChangerType(nouveauType) {
    setType(nouveauType);
    setChambres('');
    setSalons('');
    setSallesDeBain('');
  }

  function gererSelectionPhotos(e) {
    const fichiers = Array.from(e.target.files).slice(0, 8);
    setPhotos(fichiers);
    setPreviews(fichiers.map((f) => URL.createObjectURL(f)));
    setPhotoCouvertureIndex(0);
  }

  function retirerPhoto(index) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    if (photoCouvertureIndex === index) {
      setPhotoCouvertureIndex(0);
    } else if (photoCouvertureIndex > index) {
      setPhotoCouvertureIndex((prev) => prev - 1);
    }
  }

  function deplacerPhoto(index, direction) {
    const cible = direction === 'gauche' ? index - 1 : index + 1;
    if (cible < 0 || cible >= photos.length) return;

    const nouvellesPhotos = [...photos];
    const nouveauxPreviews = [...previews];

    const tempPhoto = nouvellesPhotos[index];
    nouvellesPhotos[index] = nouvellesPhotos[cible];
    nouvellesPhotos[cible] = tempPhoto;

    const tempPrev = nouveauxPreviews[index];
    nouveauxPreviews[index] = nouveauxPreviews[cible];
    nouveauxPreviews[cible] = tempPrev;

    setPhotos(nouvellesPhotos);
    setPreviews(nouveauxPreviews);
    setPhotoCouvertureIndex(0);
  }

  function gererSelectionVideos(e) {
    setErreurVideo('');
    const fichiers = Array.from(e.target.files);
    if (!fichiers.length) return;

    if (videos.length + fichiers.length > 3) {
      setErreurVideo('Vous pouvez ajouter 3 vidéos maximum au total.');
    }

    const autorises = fichiers.slice(0, Math.max(0, 3 - videos.length));
    if (autorises.length > 0) {
      const nouveauxVideos = [...videos, ...autorises];
      setVideos(nouveauxVideos);
      setVideoPreviews(nouveauxVideos.map((f) => URL.createObjectURL(f)));
    }
    e.target.value = '';
  }

  function retirerVideo(index) {
    setErreurVideo('');
    setVideos((prev) => prev.filter((_, i) => i !== index));
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function allerEtapeSuivante() {
    setErreurEtape('');

    if (etapeActuelle === 1) {
      if (!titre.trim() || !prix || Number(prix) <= 0) {
        setErreurEtape('Merci d\'indiquer au moins le titre de l\'annonce et le prix du loyer.');
        return;
      }
    }

    if (etapeActuelle === 3) {
      if (!declarationHonneur) {
        setErreurEtape('Merci de cocher la case d\'engagement sur l\'honneur avant de continuer.');
        return;
      }
    }

    setEtapeActuelle((e) => Math.min(e + 1, 4));
  }

  function allerEtapePrecedente() {
    setErreurEtape('');
    setEtapeActuelle((e) => Math.max(e - 1, 1));
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    setErreurEtape('');

    if (!titre.trim() || !prix || Number(prix) <= 0) {
      setErreurEtape('Le titre et le loyer sont obligatoires.');
      setEtapeActuelle(1);
      return;
    }

    if (!declarationHonneur) {
      setErreurEtape('Veuillez valider la déclaration sur l\'honneur pour publier l\'annonce.');
      setEtapeActuelle(3);
      return;
    }

    setEnEnvoi(true);

    try {
      const lowerType = type.toLowerCase();
      const isStudioOrChambre = lowerType === 'studio' || lowerType === 'chambre';

      const fd = new FormData();
      fd.append('titre', titre.trim());
      fd.append('secteur', secteur);
      fd.append('type', type);
      fd.append('prix', String(Number(prix)));
      fd.append('chambres', String(isStudioOrChambre ? 1 : Number(chambres) || 1));
      fd.append('salons', String(isStudioOrChambre ? 0 : Number(salons) || 0));
      fd.append('sallesDeBain', String(Number(sallesDeBain) || 1));
      fd.append('salleDeBainPrivee', salleDeBainPrivee === 'oui' ? 'true' : 'false');
      fd.append('typeCuisine', typeCuisine);
      fd.append('description', description.trim());
      fd.append('statutDeclarant', statutDeclarant);
      fd.append('declarationHonneur', 'true');

      if (photos && photos.length > 0) {
        let photosOrdonnees = [...photos];
        if (photoCouvertureIndex > 0 && photoCouvertureIndex < photosOrdonnees.length) {
          const photoCouverture = photosOrdonnees[photoCouvertureIndex];
          photosOrdonnees.splice(photoCouvertureIndex, 1);
          photosOrdonnees.unshift(photoCouverture);
        }
        photosOrdonnees.forEach((f) => fd.append('photos', f));
      }

      if (videos && videos.length > 0) {
        videos.forEach((v) => fd.append('videos', v));
      }

      await onPublier(fd);
    } catch (err) {
      console.error('Erreur lors de la publication :', err);
      setErreurEtape(err.message || 'Une erreur est survenue lors de la publication. Veuillez réessayer.');
    } finally {
      setEnEnvoi(false);
    }
  }

  const typeLower = type.toLowerCase();

  let scoreQualite = 0;
  if (type) scoreQualite += 15;
  if (titre.trim().length >= 10) scoreQualite += 20;
  if (secteur) scoreQualite += 15;
  if (prix && Number(prix) > 0) scoreQualite += 15;
  if (description.trim().length >= 30) scoreQualite += 15;
  if (photos.length >= 1) scoreQualite += 10;
  if (photos.length >= 3) scoreQualite += 10;

  return (
    <div>
      {/* SCORE QUALITE WIDGET */}
      <div className="annonce-quality-widget">
        <div className="quality-header">
          <span className="quality-title">
            <Star size={16} fill="var(--color-primary)" color="var(--color-primary)" /> Qualité de votre annonce :
          </span>
          <span className="quality-percent">{scoreQualite}%</span>
        </div>
        <div className="quality-bar-track">
          <div
            className="quality-bar-fill"
            style={{
              width: `${scoreQualite}%`,
              backgroundColor: scoreQualite < 50 ? '#ef4444' : scoreQualite < 80 ? '#f59e0b' : '#10b981'
            }}
          />
        </div>
        <span className="quality-advice">
          {scoreQualite < 50 && "💡 Ajoutez au moins 3 photos et une description détaillée pour attirer plus de locataires."}
          {scoreQualite >= 50 && scoreQualite < 80 && "👍 Bonne annonce ! Remplissez tous les détails pour atteindre 100%."}
          {scoreQualite >= 80 && "🌟 Excellente annonce ! Votre logement est parfaitement optimisé pour capter les locataires."}
        </span>
      </div>

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
              <ClipboardList size={18} style={{ color: 'var(--color-primary)' }} /> Informations du bien
            </h4>

            {/* 1. SELECTION TYPE DE LOGEMENT EN PREMIER */}
            <div className="form-group" style={{ background: 'color-mix(in srgb, var(--color-primary) 6%, transparent)', padding: '1.25rem', borderRadius: '16px', border: '1px solid color-mix(in srgb, var(--color-primary) 22%, transparent)', marginBottom: '1.25rem' }}>
              <label style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)', display: 'block', marginBottom: '0.5rem' }}>
                Que louez-vous ? *
              </label>
              <select
                value={type}
                onChange={(e) => handleChangerType(e.target.value)}
                style={{ fontSize: '1rem', padding: '0.85rem 1rem', borderRadius: '12px', fontWeight: 600, width: '100%' }}
              >
                {typesLogement.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>

            {/* 2. TITRE & SECTEUR */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ margin: 0 }}>Titre de l'annonce *</label>
                <span style={{ fontSize: '0.8rem', color: titre.length >= 50 ? '#EF4444' : 'var(--color-text-muted)' }}>
                  {titre.length}/50 caractères max
                </span>
              </div>
              <input
                type="text"
                value={titre}
                maxLength={50}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="Ex : Bel appartement 2 chambres et salon"
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Quartier / Zone *</label>
                <select value={secteur} onChange={(e) => setSecteur(e.target.value)}>
                  {secteurs.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>

              <div className="form-group">
                <label>Loyer par mois (FCFA) *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={prix}
                  onChange={(e) => setPrix(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex : 150000"
                />
              </div>
            </div>

            {/* 3. CARACTÉRISTIQUES DYNAMIQUES */}
            <div style={{ marginTop: '1.25rem', padding: '1.25rem', borderRadius: '16px', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
              <h5 style={{ margin: '0 0 1rem 0', fontSize: '0.925rem', fontWeight: 700, color: 'var(--color-text)' }}>
                Détails du {type} :
              </h5>

              {/* APPARTEMENT OU MAISON */}
              {(typeLower === 'appartement' || typeLower === 'maison' || typeLower === 'villa') && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.85rem' }}>Combien de chambres ? *</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Ex: 2"
                      value={chambres}
                      onChange={(e) => setChambres(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.85rem' }}>Combien de salons ? *</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Ex: 1"
                      value={salons}
                      onChange={(e) => setSalons(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.85rem' }}>Combien de douches / WC ? *</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Ex: 1"
                      value={sallesDeBain}
                      onChange={(e) => setSallesDeBain(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>
              )}

              {/* STUDIO */}
              {typeLower === 'studio' && (
                <div className="form-row-2" style={{ margin: 0 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.85rem' }}>Douche / Toilette privée ?</label>
                    <select value={salleDeBainPrivee} onChange={(e) => setSalleDeBainPrivee(e.target.value)}>
                      <option value="oui">Oui, douche privée dans le studio</option>
                      <option value="non">Non, douche / toilette commune</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.85rem' }}>Cuisine ?</label>
                    <select value={typeCuisine} onChange={(e) => setTypeCuisine(e.target.value)}>
                      <option value="privee">Oui, cuisine privée</option>
                      <option value="kitchenette">Kitchenette intégrée</option>
                      <option value="partagee">Pas de cuisine / Commune</option>
                    </select>
                  </div>
                </div>
              )}

              {/* CHAMBRE */}
              {typeLower === 'chambre' && (
                <div className="form-row-2" style={{ margin: 0 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.85rem' }}>Douche / Toilette privée ?</label>
                    <select value={salleDeBainPrivee} onChange={(e) => setSalleDeBainPrivee(e.target.value)}>
                      <option value="oui">Oui, douche privée dans la chambre</option>
                      <option value="non">Non, douche / toilette commune</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.85rem' }}>Entrée & Accès</label>
                    <select value={typeCuisine} onChange={(e) => setTypeCuisine(e.target.value)}>
                      <option value="independant">Entrée indépendante (Chambre américaine)</option>
                      <option value="colocation">Chambre dans un appartement / maison</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {etapeActuelle === 2 && (
          <div className="etape-contenu">
            <h4 className="etape-title">
              <FileEdit size={18} style={{ color: 'var(--color-primary)' }} /> Description du bien
            </h4>

            <div className="form-group">
              <label>Expliquez simplement votre logement</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Exemple : Belle chambre propre et calme, bien éclairée, avec eau et électricité comprises..."
                style={{ minHeight: '160px' }}
              />
            </div>
          </div>
        )}

        {etapeActuelle === 3 && (
          <div className="etape-contenu">
            <h4 className="etape-title">
              <Camera size={18} style={{ color: 'var(--color-primary)' }} /> Photos & Vidéos
            </h4>

            <div className="form-group">
              <label>Photos du logement (8 photos maximum)</label>
              <label className="photo-upload-zone">
                <ImagePlus size={24} style={{ color: 'var(--color-primary)' }} />
                <span>Cliquez pour ajouter des photos</span>
                <input type="file" accept="image/*" multiple onChange={gererSelectionPhotos} hidden />
              </label>

              {previews.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                    💡 <strong>Photo de couverture :</strong> La photo avec le badge <Star size={12} style={{ display: 'inline', color: '#2563eb' }} /> <strong>Couverture</strong> sera l'image principale visible par les locataires. Cliquez sur une photo pour la désigner comme couverture.
                  </p>
                  <div className="photo-preview-grid">
                    {previews.map((url, i) => {
                      const estCouverture = i === photoCouvertureIndex;
                      return (
                        <div key={i} className={`photo-preview-item ${estCouverture ? 'is-cover' : ''}`}>
                          <img src={url} alt={`Photo ${i + 1}`} onClick={() => setPhotoCouvertureIndex(i)} style={{ cursor: 'pointer' }} />
                          <button type="button" onClick={() => retirerPhoto(i)}><X size={14} /></button>
                          
                          {previews.length > 1 && (
                            <div className="photo-reorder-nav" onClick={(e) => e.stopPropagation()}>
                              {i > 0 && (
                                <button type="button" className="btn-reorder-arrow" onClick={() => deplacerPhoto(i, 'gauche')} title="Déplacer vers la gauche">
                                  <ChevronLeft size={13} />
                                </button>
                              )}
                              {i < previews.length - 1 && (
                                <button type="button" className="btn-reorder-arrow" onClick={() => deplacerPhoto(i, 'droite')} title="Déplacer vers la droite">
                                  <ChevronRight size={13} />
                                </button>
                              )}
                            </div>
                          )}

                          <div
                            className={`cover-badge-tag ${estCouverture ? '' : 'set-cover'}`}
                            onClick={() => setPhotoCouvertureIndex(i)}
                          >
                            <Star size={11} fill={estCouverture ? '#ffffff' : 'none'} />
                            <span>{estCouverture ? 'Couverture' : 'Mettre en couverture'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label>Vidéos du logement (3 vidéos maximum)</label>
              <label className="photo-upload-zone">
                <Video size={24} style={{ color: 'var(--color-primary)' }} />
                <span>Cliquez pour ajouter des vidéos</span>
                <input type="file" accept="video/*" multiple onChange={gererSelectionVideos} hidden />
              </label>
              {erreurVideo && <p style={{ color: '#EF4444', fontSize: '0.82rem', marginTop: '6px' }}>{erreurVideo}</p>}

              {videoPreviews.length > 0 && (
                <div className="photo-preview-grid" style={{ marginTop: '10px' }}>
                  {videoPreviews.map((url, i) => (
                    <div key={i} className="photo-preview-item" style={{ width: '120px', height: '90px' }}>
                      <video src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" onClick={() => retirerVideo(i)}><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="declaration-honneur-box" style={{ marginTop: '24px' }}>
              <label className="form-group" style={{ marginBottom: '12px' }}>
                <span className="declaration-label-text">Vous êtes :</span>
                <select value={statutDeclarant} onChange={(e) => setStatutDeclarant(e.target.value)}>
                  {statutsDeclarant.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                </select>
              </label>

              <label className="checkbox-honneur">
                <input
                  type="checkbox"
                  checked={declarationHonneur}
                  onChange={(e) => setDeclarationHonneur(e.target.checked)}
                />
                <span>
                  Je confirme que les informations et les photos fournies sont exactes.
                </span>
              </label>
            </div>
          </div>
        )}

        {etapeActuelle === 4 && (
          <div className="etape-contenu">
            <h4 className="etape-title">
              <ShieldCheck size={18} style={{ color: 'var(--color-primary)' }} /> Vérification avant publication
            </h4>

            <div className="recap-box">
              <p><strong>Titre :</strong> {titre || 'Non renseigné'}</p>
              <p><strong>Quartier :</strong> {secteur}</p>
              <p><strong>Type de bien :</strong> {type}</p>
              <p><strong>Loyer :</strong> {prix ? `${Number(prix).toLocaleString()} FCFA / mois` : 'Non renseigné'}</p>
              
              {typeLower === 'studio' || typeLower === 'chambre' ? (
                <p>
                  <strong>Douche / Toilette :</strong> {salleDeBainPrivee === 'oui' ? 'Douche privée' : 'Douche commune'}
                </p>
              ) : (
                <p>
                  <strong>Composition :</strong> {chambres} chambre(s) · {salons} salon(s) · {sallesDeBain} douche(s)/WC
                </p>
              )}

              <p><strong>Description :</strong> {description || 'Aucune'}</p>
              <p><strong>Photos :</strong> {photos.length} photo(s)</p>
            </div>
          </div>
        )}

        {erreurEtape && <p className="form-error-msg">{erreurEtape}</p>}

        {/* NAVIGATION BUTTONS */}
        <div className="form-actions-v2">
          {etapeActuelle > 1 ? (
            <button type="button" onClick={allerEtapePrecedente} disabled={enEnvoi} className="btn-secondary-v2">
              <ChevronLeft size={18} />
              <span>Précédent</span>
            </button>
          ) : <div />}

          {etapeActuelle < 4 ? (
            <button type="button" onClick={allerEtapeSuivante} disabled={enEnvoi} className="btn-primary-v2">
              <span>Continuer</span>
              <ChevronRight size={18} />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={enEnvoi} className="btn-primary-v2">
              {enEnvoi ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Publication en cours...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Publier mon annonce</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FormulaireLogement;