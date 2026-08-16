import { createContext, useContext, useState, useCallback } from 'react';
import { API_URL } from '../config';
import { logementsInitiaux } from '../data/logements';

const LogementsContext = createContext();

export function LogementsProvider({ children }) {
  const [logements, setLogements] = useState([]);
  const [chargement, setChargement] = useState(true);

  const rafraichir = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/logements`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setLogements(data);
        } else {
          setLogements(logementsInitiaux);
        }
      } else {
        setLogements(logementsInitiaux);
      }
    } catch (e) {
      console.error('Erreur lors du chargement des logements :', e);
      setLogements(logementsInitiaux);
    } finally {
      setChargement(false);
    }
  }, []);

  async function ajouterLogement(formData, token) {
    const res = await fetch(`${API_URL}/logements`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.erreur || 'Erreur lors de l\'ajout du logement');
    }
    setLogements((precedents) => [...precedents, data]);
    return data;
  }

  async function ajouterDemande(nouvelleDemande) {
    const res = await fetch(`${API_URL}/demandes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nouvelleDemande),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.erreur || 'Erreur lors de l\'envoi de la demande');
    }
    return data;
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