import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useProprietaire } from './ProprietaireContext';
import { API_URL } from '../config';

const FavorisContext = createContext();

export function FavorisProvider({ children }) {
  const { token, estConnecte } = useProprietaire();
  const [favoris, setFavoris] = useState([]);

  const chargerFavoris = useCallback(async () => {
    if (!token) {
      setFavoris([]);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/favoris`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFavoris(Array.isArray(data) ? data : []);
      } else {
        setFavoris([]);
      }
    } catch {
      setFavoris([]);
    }
  }, [token]);

  useEffect(() => {
    chargerFavoris();
  }, [chargerFavoris]);

  function estFavori(id) {
    return favoris.includes(id);
  }

  async function basculerFavori(id) {
    if (!token) return false;

    try {
      const res = await fetch(`${API_URL}/favoris/${id}/basculer`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFavoris(Array.isArray(data.favoris) ? data.favoris : []);
        return true;
      }
    } catch {
      // Ignoré
    }
    return false;
  }

  return (
    <FavorisContext.Provider value={{ favoris, estFavori, basculerFavori, estConnecte }}>
      {children}
    </FavorisContext.Provider>
  );
}

export function useFavoris() {
  return useContext(FavorisContext);
}