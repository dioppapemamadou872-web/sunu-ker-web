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
    const res = await fetch(`${API_URL}/favoris`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      setFavoris([]);
      return;
    }
    setFavoris(await res.json());
  }, [token]);

  useEffect(() => {
    chargerFavoris();
  }, [chargerFavoris]);

  function estFavori(id) {
    return favoris.includes(id);
  }

  async function basculerFavori(id) {
    if (!token) return false; // pas connecté, on signale à l'appelant

    const res = await fetch(`${API_URL}/favoris/${id}/basculer`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setFavoris(data.favoris);
    return true;
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