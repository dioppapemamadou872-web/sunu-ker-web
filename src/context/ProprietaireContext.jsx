import { createContext, useContext, useState } from 'react';
import { API_URL } from '../config';

const ProprietaireContext = createContext();

export function ProprietaireProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('sunuker_proprio_token'));
  const [prenom, setPrenom] = useState(() => localStorage.getItem('sunuker_proprio_prenom'));
  const [nom, setNom] = useState(() => localStorage.getItem('sunuker_proprio_nom'));

  function sauvegarderIdentite(data) {
    localStorage.setItem('sunuker_proprio_token', data.token);
    localStorage.setItem('sunuker_proprio_prenom', data.prenom);
    localStorage.setItem('sunuker_proprio_nom', data.nom);
    setToken(data.token);
    setPrenom(data.prenom);
    setNom(data.nom);
  }

  async function inscrire(prenomSaisi, nomSaisi, telephone, motDePasse) {
    const res = await fetch(`${API_URL}/proprietaires/inscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prenom: prenomSaisi, nom: nomSaisi, telephone, motDePasse }),
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
  }

  async function recupererProfil() {
    const res = await fetch(`${API_URL}/proprietaires/moi`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Impossible de charger le profil');
    return res.json();
  }

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
    return data.photoProfil;
  }

  return (
    <ProprietaireContext.Provider
      value={{
        token, prenom, nom, estConnecte: !!token,
        inscrire, connecter, deconnecter,
        recupererProfil, modifierProfil, changerMotDePasse, uploaderPhoto,
      }}
    >
      {children}
    </ProprietaireContext.Provider>
  );
}

export function useProprietaire() {
  return useContext(ProprietaireContext);
}