import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { LogementsProvider } from './context/LogementsContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ProprietaireProvider } from './context/ProprietaireContext.jsx';
import { FavorisProvider } from './context/FavorisContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ProprietaireProvider>
            <FavorisProvider>
              <LogementsProvider>
                <App />
              </LogementsProvider>
            </FavorisProvider>
          </ProprietaireProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);