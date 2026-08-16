import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, Wallet, ChevronDown } from 'lucide-react';
import { secteurs, typesLogement } from '../data/logements';

function SearchBar() {
  const navigate = useNavigate();
  const [secteur, setSecteur] = useState('');
  const [type, setType] = useState('');
  const [budgetMax, setBudgetMax] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (secteur) params.set('secteur', secteur);
    if (type) params.set('type', type);
    if (budgetMax) params.set('budgetMax', budgetMax);
    navigate(`/logements?${params.toString()}`);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      {/* FIELD 1: QUARTIER */}
      <div className="search-field">
        <div className="search-field-icon-box">
          <MapPin size={17} />
        </div>
        <div className="search-input-wrapper">
          <span className="search-field-mini-label">QUARTIER</span>
          <select value={secteur} onChange={(e) => setSecteur(e.target.value)}>
            <option value="">Tous les quartiers</option>
            {secteurs.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={14} className="select-chevron" />
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
          <ChevronDown size={14} className="select-chevron" />
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