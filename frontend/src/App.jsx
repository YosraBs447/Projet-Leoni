import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
// Interface de connexion
import RegistrationForm from "./pages/RegistrationForm"; // Interface d'inscription
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
      </Routes>
    </Router>
    
  );
}

export default App;
