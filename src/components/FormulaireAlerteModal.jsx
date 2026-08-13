import { useState } from 'react';
import { X, Bell, CheckCircle2, AlertCircle, Sparkles, Send, MapPin, Building2, Wallet } from 'lucide-react';
import { API_BASE, secteurs, typesLogement } from '../data/logements';
import ChampTelephone from './ChampTelephone';

export default function FormulaireAlerteModal({ isOpen, onClose }) {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [memeWhatsapp, setMemeWhatsapp] = useState(true);
  const [email, setEmail] = useState('');
  const [secteur, setSecteur] = useState('Tous');
  const [typeLogement, setTypeLogement] = useState('Tous');
  const [budgetMax, setBudgetMax] = useState('');
  
  const [chargement, setChargement] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    
    if (!nom.trim()) {
      setErreur('Veuillez indiquer votre nom.');
      return;
    }
    if (!telephone || telephone.length !== 9) {
      setErreur('Veuillez entrer un numéro de téléphone valide à 9 chiffres.');
      return;
    }

    setChargement(true);
    try {
      const res = await fetch(`${API_BASE}/api/alertes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom,
          nom,
          telephone,
          whatsapp: memeWhatsapp ? telephone : whatsapp,
          email,
          secteur,
          typeLogement,
          budgetMax: budgetMax ? Number(budgetMax) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.erreur || 'Erreur lors de la création de l\'alerte.');
      }

      setSucces(true);
      setTimeout(() => {
        setSucces(false);
        onClose();
        // Reset form
        setPrenom('');
        setNom('');
        setTelephone('');
        setWhatsapp('');
        setEmail('');
        setSecteur('Tous');
        setTypeLogement('Tous');
        setBudgetMax('');
      }, 2500);
    } catch (err) {
      setErreur(err.message || 'Une erreur est survenue.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div 
        className="modal-content-alerte" 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          maxWidth: '540px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          animation: 'fadeInScale 0.25s ease-out'
        }}
      >
        {/* Header Modal */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          color: '#ffffff',
          padding: '1.5rem 1.75rem',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          position: 'relative'
        }}>
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            <X size={18} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '0.5rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bell size={24} color="#ffffff" />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.9 }}>
              Service Gratuit
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
            Créer une Alerte Recherche
          </h2>
          <p style={{ fontSize: '0.9rem', margin: '0.35rem 0 0 0', opacity: 0.9, lineHeight: 1.4 }}>
            Soyez notifié en priorité sur WhatsApp dès qu'un bien correspondant à vos critères est publié !
          </p>
        </div>

        {/* Body Modal */}
        <div style={{ padding: '1.75rem' }}>
          {succes ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              animation: 'fadeIn 0.3s ease-in-out'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                Alerte enregistrée avec succès !
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Nous vous contacterons immédiatement par WhatsApp dès qu'un bien correspondant à vos critères sera disponible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {erreur && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={18} style={{ shrink: 0 }} />
                  <span>{erreur}</span>
                </div>
              )}

              {/* Critères de recherche */}
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '0.95rem', color: '#1e293b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={16} color="#2563eb" /> Vos critères de logement
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                      <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} /> Secteur
                    </label>
                    <select
                      value={secteur}
                      onChange={(e) => setSecteur(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        backgroundColor: '#ffffff',
                        outline: 'none'
                      }}
                    >
                      <option value="Tous">Tous les secteurs</option>
                      {secteurs.map((sec) => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                      <Building2 size={13} style={{ display: 'inline', marginRight: '4px' }} /> Type de bien
                    </label>
                    <select
                      value={typeLogement}
                      onChange={(e) => setTypeLogement(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        backgroundColor: '#ffffff',
                        outline: 'none'
                      }}
                    >
                      <option value="Tous">Tous les types</option>
                      {typesLogement.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                    <Wallet size={13} style={{ display: 'inline', marginRight: '4px' }} /> Budget Maximum (FCFA)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 150000"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Coordonnées */}
              <div>
                <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '0.95rem', color: '#1e293b', fontWeight: 600 }}>
                  Vos Coordonnées
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                      Prénom
                    </label>
                    <input
                      type="text"
                      placeholder="Mamadou"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                      Nom *
                    </label>
                    <input
                      type="text"
                      placeholder="Diallo"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                    Téléphone (Sénégal - 9 chiffres) *
                  </label>
                  <ChampTelephone
                    value={telephone}
                    valeur={telephone}
                    onChange={setTelephone}
                    placeholder="77 000 00 00"
                  />
                </div>

                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#475569', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={memeWhatsapp}
                      onChange={(e) => setMemeWhatsapp(e.target.checked)}
                      style={{ accentColor: '#2563eb' }}
                    />
                    Numéro WhatsApp identique au téléphone
                  </label>
                </div>

                {!memeWhatsapp && (
                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                      Numéro WhatsApp
                    </label>
                    <ChampTelephone
                      value={whatsapp}
                      valeur={whatsapp}
                      onChange={setWhatsapp}
                      placeholder="77 000 00 00"
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                    Email (Optionnel)
                  </label>
                  <input
                    type="email"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Bouton Submit */}
              <button
                type="submit"
                disabled={chargement}
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: chargement ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                  transition: 'all 0.2s ease-in-out',
                  marginTop: '0.5rem'
                }}
                onMouseOver={(e) => { if (!chargement) e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
                onMouseOut={(e) => { if (!chargement) e.currentTarget.style.backgroundColor = '#2563eb'; }}
              >
                {chargement ? (
                  <span>Enregistrement en cours...</span>
                ) : (
                  <>
                    <Send size={18} /> Activer mon alerte gratuitement
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
