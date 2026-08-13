import { useState } from 'react';
import { Bell, CheckCircle2, AlertCircle, Sparkles, Send, MapPin, Building2, Wallet, ShieldCheck } from 'lucide-react';
import { API_BASE, secteurs, typesLogement } from '../data/logements';
import ChampTelephone from '../components/ChampTelephone';

export default function CreerAlerte() {
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
    } catch (err) {
      setErreur(err.message || 'Une erreur est survenue.');
    } finally {
      setChargement(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 0.9rem',
    borderRadius: '12px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--color-text)',
    marginBottom: '0.4rem'
  };

  return (
    <div style={{
      maxWidth: '720px',
      margin: '2rem auto 4rem auto',
      padding: '0 1rem',
    }}>
      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: '24px',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}>
        {/* Header Hero Clean */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          color: '#ffffff',
          padding: '2.5rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1rem'
          }}>
            <Bell size={16} /> Service gratuit & sans engagement
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
            Créer une Alerte Recherche
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
            Recevez une notification instantanée sur WhatsApp dès qu'un bien correspondant à vos critères est publié sur Sunu Ker.
          </p>
        </div>

        {/* Form Container */}
        <div style={{ padding: '2rem' }}>
          {succes ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--color-secondary, #10b981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <CheckCircle2 size={44} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                Votre alerte est activée !
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
                Merci {prenom} ! Nous vous contacterons directement par WhatsApp dès qu'un logement à <strong>{secteur === 'Tous' ? 'Dakar et environs' : secteur}</strong> sera disponible.
              </p>
              <button
                onClick={() => {
                  setSucces(false);
                  setPrenom('');
                  setNom('');
                  setTelephone('');
                  setWhatsapp('');
                  setEmail('');
                  setSecteur('Tous');
                  setTypeLogement('Tous');
                  setBudgetMax('');
                }}
                className="btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Créer une autre alerte
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {erreur && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid var(--color-error)',
                  color: 'var(--color-error)',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.925rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={20} />
                  <span>{erreur}</span>
                </div>
              )}

              {/* SECTION 1: CRITÈRES */}
              <div style={{
                backgroundColor: 'var(--color-bg)',
                padding: '1.25rem',
                borderRadius: '16px',
                border: '1px solid var(--color-border)'
              }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', color: 'var(--color-text)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} color="#2563eb" /> 1. Critères du logement
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>
                      <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> Secteur / Quartier
                    </label>
                    <select
                      value={secteur}
                      onChange={(e) => setSecteur(e.target.value)}
                      style={inputStyle}
                    >
                      <option value="Tous">Tous les secteurs</option>
                      {secteurs.map((sec) => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>
                      <Building2 size={14} style={{ display: 'inline', marginRight: '4px' }} /> Type de bien
                    </label>
                    <select
                      value={typeLogement}
                      onChange={(e) => setTypeLogement(e.target.value)}
                      style={inputStyle}
                    >
                      <option value="Tous">Tous les types</option>
                      {typesLogement.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    <Wallet size={14} style={{ display: 'inline', marginRight: '4px' }} /> Loyer Maximum Mensuel (FCFA)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 150000"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* SECTION 2: COORDONNÉES */}
              <div style={{
                backgroundColor: 'var(--color-bg)',
                padding: '1.25rem',
                borderRadius: '16px',
                border: '1px solid var(--color-border)'
              }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', color: 'var(--color-text)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} color="#2563eb" /> 2. Vos Coordonnées
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Prénom</label>
                    <input
                      type="text"
                      placeholder="Mamadou"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Nom *</label>
                    <input
                      type="text"
                      placeholder="Diallo"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>Téléphone (Sénégal - 9 chiffres) *</label>
                  <ChampTelephone
                    value={telephone}
                    valeur={telephone}
                    onChange={setTelephone}
                    placeholder="77 000 00 00"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={memeWhatsapp}
                      onChange={(e) => setMemeWhatsapp(e.target.checked)}
                      style={{ accentColor: '#2563eb', width: '16px', height: '16px' }}
                    />
                    Numéro WhatsApp identique au téléphone
                  </label>
                </div>

                {!memeWhatsapp && (
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Numéro WhatsApp</label>
                    <ChampTelephone
                      value={whatsapp}
                      valeur={whatsapp}
                      onChange={setWhatsapp}
                      placeholder="77 000 00 00"
                    />
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Adresse Email (Optionnel)</label>
                  <input
                    type="email"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={chargement}
                style={{
                  backgroundColor: 'var(--color-primary, #2563eb)',
                  color: '#ffffff',
                  padding: '1rem 1.5rem',
                  borderRadius: '14px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: chargement ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {chargement ? (
                  <span>Enregistrement...</span>
                ) : (
                  <>
                    <Send size={20} /> Activer mon alerte gratuitement
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
