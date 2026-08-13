import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Accueil from './pages/Accueil';
import Logements from './pages/Logements';
import LogementDetail from './pages/LogementDetail';
import Publier from './pages/Publier';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import APropos from './pages/APropos';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import ConditionsUtilisation from './pages/ConditionsUtilisation';
import InscriptionProprietaire from './pages/InscriptionProprietaire';
import ConnexionProprietaire from './pages/ConnexionProprietaire';
import MonEspace from './pages/MonEspace';
import CreerAlerte from './pages/CreerAlerte';

function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/logements" element={<Logements />} />
          <Route path="/logements/:id" element={<LogementDetail />} />
          <Route path="/publier" element={<Publier />} />
          <Route path="/creer-alerte" element={<CreerAlerte />} />
          <Route path="/alerte" element={<CreerAlerte />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/contact/admin" element={<Navigate to="/admin" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/conditions-utilisation" element={<ConditionsUtilisation />} />
          <Route path="/inscription" element={<InscriptionProprietaire />} />
          <Route path="/connexion" element={<ConnexionProprietaire />} />
          <Route path="/mon-espace" element={<MonEspace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;