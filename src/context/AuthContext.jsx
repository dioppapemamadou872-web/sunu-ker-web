import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
import { API_URL } from '../config';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('sunuker_token'));

  async function connecter(motDePasse) {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ motDePasse }),
    });

    if (!res.ok) {
      throw new Error('Mot de passe incorrect');
    }

    const data = await res.json();
    localStorage.setItem('sunuker_token', data.token);
    setToken(data.token);
  }

  function deconnecter() {
    localStorage.removeItem('sunuker_token');
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, connecter, deconnecter, estConnecte: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}