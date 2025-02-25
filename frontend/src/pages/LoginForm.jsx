import React, { useState } from "react";
import "./LoginForm.css";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Pour afficher un message d'erreur

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Envoi des données au backend
    axios
      .post("http://localhost:3000/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        // Si le login est réussi, par exemple si le backend renvoie un token
        console.log("Login success:", response.data);
        alert("Connexion réussie !");
        
        // Stocker le token dans le localStorage (ou autre méthode de stockage)
        localStorage.setItem("token", response.data.token);

        // Redirection après connexion réussie
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Login error:", error);
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Erreur de connexion avec le serveur");
        }
      });
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
        
        {errorMessage && (
          <div className="error-message">{errorMessage}</div>
        )}

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
