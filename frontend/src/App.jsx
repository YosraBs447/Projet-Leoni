import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
// Interface de connexion
import RegistrationForm from "./pages/RegistrationForm";// Interface d'inscription
import VerificationCodeForm from "./pages/VerificationCodeForm"; // Interface de vérification du code
import ResetPasswordForm from "./pages/ResetPasswordForm"; // Interface de réinitialisation du mot de passe

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Page de connexion par défaut */}
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
