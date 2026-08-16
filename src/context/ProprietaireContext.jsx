import { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

const ProprietaireContext = createContext();

export function ProprietaireProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('sunuker_proprio_token'));
  const [prenom, setPrenom] = useState(() => localStorage.getItem('sunuker_proprio_prenom'));
  const [nom, setNom] = useState(() => localStorage.getItem('sunuker_proprio_nom'));
  const [photoProfil, setPhotoProfil] = useState(null);

  function sauvegarderIdentite(data) {
    localStorage.setItem('sunuker_proprio_token', data.token);
    localStorage.setItem('sunuker_proprio_prenom', data.prenom);
    localStorage.setItem('sunuker_proprio_nom', data.nom);
    setToken(data.token);
    setPrenom(data.prenom);
    setNom(data.nom);
  }

  async function inscrire(prenomSaisi, nomSaisi, telephone, whatsapp, motDePasse) {
    const res = await fetch(`${API_URL}/proprietaires/inscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prenom: prenomSaisi, nom: nomSaisi, telephone, whatsapp, motDePasse }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.erreur || 'Erreur à l\'inscription');
    sauvegarderIdentite(data);
  }

  async function connecter(telephone, motDePasse) {
    const res = await fetch(`${API_URL}/proprietaires/connexion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telephone, motDePasse }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.erreur || 'Erreur à la connexion');
    sauvegarderIdentite(data);
  }

  function deconnecter() {
    localStorage.removeItem('sunuker_proprio_token');
    localStorage.removeItem('sunuker_proprio_prenom');
    localStorage.removeItem('sunuker_proprio_nom');
    setToken(null);
    setPrenom(null);
    setNom(null);
    setPhotoProfil(null);
  }

  async function recupererProfil() {
    const res = await fetch(`${API_URL}/proprietaires/moi`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Impossible de charger le profil');
    const data = await res.json();
    setPhotoProfil(data.photoProfil || null);
    return data;
  }

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/proprietaires/moi`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setPhotoProfil(data.photoProfil || null);
      })
      .catch(() => {});
  }, [token]);

  async function modifierProfil(champs) {
    const res = await fetch(`${API_URL}/proprietaires/moi`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(champs),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.erreur || 'Erreur lors de la modification');

    if (champs.prenom !== undefined) {
      localStorage.setItem('sunuker_proprio_prenom', data.prenom);
      setPrenom(data.prenom);
    }
    if (champs.nom !== undefined) {
      localStorage.setItem('sunuker_proprio_nom', data.nom);
      setNom(data.nom);
    }

    return data;
  }

  async function changerMotDePasse(ancienMotDePasse, nouveauMotDePasse) {
    const res = await fetch(`${API_URL}/proprietaires/changer-mot-de-passe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ancienMotDePasse, nouveauMotDePasse }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.erreur || 'Erreur lors du changement de mot de passe');
  }

  async function supprimerCompte(motDePasse) {
    const res = await fetch(`${API_URL}/proprietaires/moi`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ motDePasse }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.erreur || 'Erreur lors de la suppression du compte');
    }

    deconnecter();
  }

  async function uploaderPhoto(fichier) {
    const formData = new FormData();
    formData.append('photo', fichier);

    const res = await fetch(`${API_URL}/proprietaires/photo`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.erreur || 'Erreur lors de l\'envoi de la photo');
    setPhotoProfil(data.photoProfil);
    return data.photoProfil;
  }

  async function supprimerPhoto() {
    const res = await fetch(`${API_URL}/proprietaires/photo`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.erreur || 'Erreur lors de la suppression de la photo');
    setPhotoProfil(null);
    return null;
  }

  return (
    <ProprietaireContext.Provider
      value={{
        token, prenom, nom, photoProfil, estConnecte: !!token,
        inscrire, connecter, deconnecter,
        recupererProfil, modifierProfil, changerMotDePasse, uploaderPhoto, supprimerPhoto, supprimerCompte,
      }}
    >
      {children}
    </ProprietaireContext.Provider>
  );
}

export function useProprietaire() {
  return useContext(ProprietaireContext);
}