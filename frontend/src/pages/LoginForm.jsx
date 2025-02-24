import React, { useState } from "react";
import "./LoginForm.css";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Par défaut, le mot de passe est masqué

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Login submitted:", { email, password });
  };

  return (
    <div className="login-container">
      <h2>SE CONNECTER</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="email"
            placeholder="Adresse Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-wrapper password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={
              showPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </span>
        </div>
        <button type="submit">SE CONNECTER</button>
        <div className="forgot-password">
          Mot de passe oublié ?{" "}
          <Link to="/forgot-password" className="underline text-blue-500">
            Cliquez ici!
          </Link>
        </div>
        <div className="signup-link">
          Vous n'avez pas de compte ?{" "}
          <Link to="/register" className="underline text-blue-500">
            Inscrivez-vous
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
