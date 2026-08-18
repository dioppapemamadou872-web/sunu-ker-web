import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, Wallet, X } from 'lucide-react';
import { secteurs, typesLogement } from '../data/logements';

function SearchBar() {
  const navigate = useNavigate();
  const [rechercheSecteur, setRechercheSecteur] = useState('');
  const [secteurChoisi, setSecteurChoisi] = useState('');
  const [type, setType] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [menuOuvert, setMenuOuvert] = useState(false);
  
  const wrapperRef = useRef(null);

  // Suggestions filtrées selon la saisie utilisateur
  const suggestions = secteurs.filter((s) =>
    s.toLowerCase().includes(rechercheSecteur.toLowerCase())
  );

  // Fermeture du menu si clic en dehors du composant
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMenuOuvert(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectionnerSecteur(s) {
    setSecteurChoisi(s);
    setRechercheSecteur(s);
    setMenuOuvert(false);
  }

  function effacerSecteur() {
    setRechercheSecteur('');
    setSecteurChoisi('');
    setMenuOuvert(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    const secFinal = secteurChoisi || rechercheSecteur;
    if (secFinal) params.set('secteur', secFinal);
    if (type) params.set('type', type);
    if (budgetMax) params.set('budgetMax', budgetMax);
    navigate(`/logements?${params.toString()}`);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      {/* FIELD 1: QUARTIER AUTOCOMPLETE */}
      <div className="search-field" ref={wrapperRef} style={{ position: 'relative' }}>
        <div className="search-field-icon-box">
          <MapPin size={17} />
        </div>
        <div className="search-input-wrapper">
          <span className="search-field-mini-label">QUARTIER</span>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <input
              type="text"
              placeholder="Rechercher un quartier..."
              value={rechercheSecteur}
              onFocus={() => setMenuOuvert(true)}
              onChange={(e) => {
                setRechercheSecteur(e.target.value);
                setSecteurChoisi('');
                setMenuOuvert(true);
              }}
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none' }}
            />
            {rechercheSecteur && (
              <button
                type="button"
                onClick={effacerSecteur}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* MENUS SUGGESTIONS AUTOCOMPLÉTION */}
          {menuOuvert && (
            <div className="search-autocomplete-dropdown">
              <div
                className={`autocomplete-item ${!rechercheSecteur ? 'selected' : ''}`}
                onClick={() => selectionnerSecteur('')}
              >
                <MapPin size={14} color="var(--color-primary)" />
                <span>Tous les quartiers</span>
              </div>
              {suggestions.length > 0 ? (
                suggestions.map((s) => (
                  <div
                    key={s}
                    className={`autocomplete-item ${s === secteurChoisi ? 'selected' : ''}`}
                    onClick={() => selectionnerSecteur(s)}
                  >
                    <MapPin size={14} color="var(--color-text-muted)" />
                    <span>{s}</span>
                  </div>
                ))
              ) : (
                <div className="autocomplete-item-empty">
                  Aucun quartier correspondant
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="search-divider" />

      {/* FIELD 2: TYPE DE LOGEMENT */}
      <div className="search-field">
        <div className="search-field-icon-box">
          <Home size={17} />
        </div>
        <div className="search-input-wrapper">
          <span className="search-field-mini-label">TYPE DE LOGEMENT</span>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Tous types de biens</option>
            {typesLogement.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="search-divider" />

      {/* FIELD 3: BUDGET MAX */}
      <div className="search-field">
        <div className="search-field-icon-box">
          <Wallet size={17} />
        </div>
        <div className="search-input-wrapper">
          <span className="search-field-mini-label">BUDGET MAX (FCFA)</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Ex : 150 000"
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value.replace(/\D/g, ''))}
          />
        </div>
      </div>

      {/* SUBMIT CTA BUTTON */}
      <button type="submit" className="btn-search">
        <Search size={18} />
        <span>Rechercher</span>
      </button>
    </form>
  );
}

export default SearchBar;