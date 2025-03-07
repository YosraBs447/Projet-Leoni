import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import RegistrationForm from "./pages/RegistrationForm";
import VerificationCodeForm from "./pages/VerificationCodeForm";
import ResetPasswordForm from "./pages/ResetPasswordForm";
import AdminPage from "./components/AdminPage"; // Importation du composant AdminPanel
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import Settings from "./components/Settings";

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
         {/* Route parent pour le panneau admin */}
         <Route path="/admin-panel" element={<AdminPage />}>
          {/* Routes enfants */}
          <Route index element={<Dashboard />} /> {/* Page par défaut */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>

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
