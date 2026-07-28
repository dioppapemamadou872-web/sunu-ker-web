import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, Wallet } from 'lucide-react';
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
      <div className="search-field">
        <MapPin size={18} className="search-icon" />
        <select value={secteur} onChange={(e) => setSecteur(e.target.value)}>
          <option value="">Quartier</option>
          {secteurs.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="search-field">
        <Home size={18} className="search-icon" />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Type de logement</option>
          {typesLogement.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="search-field">
        <Wallet size={18} className="search-icon" />
        <input
          type="number"
          placeholder="Budget max (FCFA)"
          value={budgetMax}
          onChange={(e) => setBudgetMax(e.target.value)}
        />
      </div>

      <button type="submit" className="btn-search">
        <Search size={18} /> Rechercher
      </button>
    </form>
  );
}

export default SearchBar;