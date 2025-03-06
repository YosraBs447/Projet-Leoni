import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import RegistrationForm from "./pages/RegistrationForm";
import VerificationCodeForm from "./pages/VerificationCodeForm";
import ResetPasswordForm from "./pages/ResetPasswordForm";
import AdminPanel from "./components/AdminPanel"; // Importation du composant AdminPanel

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route vers la page de connexion */}
        <Route
          path="/"
          element={
            <div className="app-container">
              <div className="form-section">
                <LoginForm />
              </div>
            </div>
          }
        />
        {/* Page d'inscription */}
        <Route
          path="/register"
          element={
            <div className="app-container">
              <div className="form-section">
                <RegistrationForm />
              </div>
            </div>
          }
        />
        {/* Page de vérification du code */}
        <Route
          path="/verification-code"
          element={
            <div className="app-container">
              <div className="form-section">
                <VerificationCodeForm />
              </div>
            </div>
          }
        />
        {/* Route vers le tableau de bord de l'administrateur */}
        <Route
          path="/dashboard"
          element={
            <div className="app-container">
              <div className="form-section">
                <AdminPanel />
              </div>
            </div>
          }
        />
        {/* Page de réinitialisation du mot de passe */}
        <Route
          path="/reset-password"
          element={
            <div className="app-container">
              <div className="form-section">
                <ResetPasswordForm />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
