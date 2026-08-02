import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SearchX, ArrowUpDown, Building2, SlidersHorizontal, X } from 'lucide-react';
import { useLogements } from '../context/LogementsContext';
import SearchBar from '../components/SearchBar';
import LogementCard from '../components/LogementCard';

function Logements() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { logements, chargement, rafraichir } = useLogements();
  const [tri, setTri] = useState('recent');

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  const secteur = searchParams.get('secteur');
  const type = searchParams.get('type');
  const budgetMax = searchParams.get('budgetMax');

  const filtresActifs = [
    secteur && { cle: 'secteur', label: secteur },
    type && { cle: 'type', label: type },
    budgetMax && { cle: 'budgetMax', label: `≤ ${Number(budgetMax).toLocaleString()} FCFA` },
  ].filter(Boolean);

  function retirerFiltre(cle) {
    const params = new URLSearchParams(searchParams);
    params.delete(cle);
    setSearchParams(params);
  }

  function reinitialiserFiltres() {
    setSearchParams({});
  }

  let resultats = logements.filter((l) => {
    if (l.statut !== 'validee') return false;
    if (secteur && l.secteur !== secteur) return false;
    if (type && l.type !== type) return false;
    if (budgetMax && l.prix > Number(budgetMax)) return false;
    return true;
  });

  if (tri === 'prix_asc') {
    resultats = [...resultats].sort((a, b) => a.prix - b.prix);
  } else if (tri === 'prix_desc') {
    resultats = [...resultats].sort((a, b) => b.prix - a.prix);
  } else {
    resultats = [...resultats].sort((a, b) => new Date(b.datePublication || 0) - new Date(a.datePublication || 0));
  }

  return (
    <div className="logements-page-modern">
      {/* SEARCH HEADER SECTION */}
      <div className="logements-search-section">
        <div className="logements-search-container">
          <SearchBar />
        </div>
      </div>

      {/* TOOLBAR (COUNT, ACTIVE CHIPS & SORT) */}
      <div className="logements-toolbar-v2">
        <div className="logements-toolbar-left">
          {!chargement && (
            <span className="results-count-v2">
              <Building2 size={16} style={{ color: 'var(--color-primary)' }} />
              <strong>{resultats.length}</strong> logement{resultats.length !== 1 ? 's' : ''} disponible{resultats.length !== 1 ? 's' : ''}
            </span>
          )}

          {filtresActifs.length > 0 && (
            <div className="filter-chips-v2">
              {filtresActifs.map(({ cle, label }) => (
                <button key={cle} className="filter-chip-v2" onClick={() => retirerFiltre(cle)} title="Retirer ce filtre">
                  <span>{label}</span>
                  <X size={13} />
                </button>
              ))}
              <button className="filter-chip-reset-v2" onClick={reinitialiserFiltres}>
                Réinitialiser
              </button>
            </div>
          )}
        </div>

        <div className="sort-select-v2">
          <ArrowUpDown size={15} style={{ color: 'var(--color-text-muted)' }} />
          <select value={tri} onChange={(e) => setTri(e.target.value)}>
            <option value="recent">Plus récents</option>
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      {/* LOGEMENT GRID / SKELETON / EMPTY STATE */}
      <div className="logement-grid">
        {chargement ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton-card" />)
        ) : resultats.length > 0 ? (
          resultats.map((l) => (
            <Link key={l.id} to={`/logements/${l.id}`} style={{ textDecoration: 'none' }}>
              <LogementCard
                id={l.id}
                titre={l.titre}
                prix={l.prix}
                type={l.type}
                secteur={l.secteur}
                statut={l.statut}
                photos={l.photos}
                disponibilite={l.disponibilite}
                datePublication={l.datePublication}
              />
            </Link>
          ))
        ) : (
          <div className="empty-state" style={{ padding: '60px 20px', gridColumn: '1 / -1' }}>
            <SearchX size={44} style={{ color: 'var(--color-text-muted)' }} />
            <h3>Aucun logement ne correspond à votre recherche</h3>
            <p>Essayez d'élargir vos critères ou de réinitialiser les filtres.</p>
            {filtresActifs.length > 0 && (
              <button className="btn-primary" onClick={reinitialiserFiltres} style={{ marginTop: '12px' }}>
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Logements;