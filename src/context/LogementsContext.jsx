import { createContext, useContext, useState, useCallback } from 'react';
import { API_URL } from '../config';

const LogementsContext = createContext();

export function LogementsProvider({ children }) {
  const [logements, setLogements] = useState([]);
  const [chargement, setChargement] = useState(true);

  const rafraichir = useCallback(async () => {
    const res = await fetch(`${API_URL}/logements`);
    setLogements(await res.json());
    setChargement(false);
  }, []);

  async function ajouterLogement(formData, token) {
    const res = await fetch(`${API_URL}/logements`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const cree = await res.json();
    setLogements((precedents) => [...precedents, cree]);
  }

  async function ajouterDemande(nouvelleDemande) {
    await fetch(`${API_URL}/demandes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nouvelleDemande),
    });
  }

  return (
    <LogementsContext.Provider
      value={{ logements, chargement, rafraichir, ajouterLogement, ajouterDemande }}
    >
      {children}
    </LogementsContext.Provider>
  );
}

export function useLogements() {
  return useContext(LogementsContext);
}