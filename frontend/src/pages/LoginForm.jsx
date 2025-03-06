import React, { useState } from "react";
import "./LoginForm.css";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Ajout du chargement

  const navigate = useNavigate();

  // Fonction de connexion
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true); // Afficher l'indicateur de chargement

    axios
      .post("http://localhost:3000/api/users/login", { email, password })
      .then((response) => {
        console.log("✅ Connexion réussie :", response.data);
        localStorage.setItem("token", response.data.token); // Stocker le token
        navigate("/admin-panel"); // Redirection vers le tableau de bord
      })
      .catch((error) => {
        setLoading(false); // Arrêter l'indicateur de chargement
        console.error("❌ Erreur de connexion :", error);
        setErrorMessage(
          error.response?.data?.message ||
            error.message ||
            "Une erreur s'est produite. Veuillez réessayer plus tard."
        );
      });
  };

  // Fonction mot de passe oublié
  const handleForgotPassword = (event) => {
    event.preventDefault();
    setLoading(true); // Afficher le message "Chargement..."

    if (!email) {
      setLoading(false); // Arrêter le chargement si l'email est vide
      setErrorMessage("❌ Veuillez entrer votre adresse email.");
      return;
    }

    axios
      .post("http://localhost:3000/api/password/forgot-password", { email })
      .then((response) => {
        console.log("✅ Email de récupération envoyé :", response.data);
        navigate("/verification-code", { state: { email } });
      })
      .catch((error) => {
        setLoading(false); // Arrêter le chargement
        console.error("❌ Erreur lors de l'envoi du code :", error);
        setErrorMessage(
          "❌ Erreur lors de l'envoi de l'email de récupération."
        );
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
            maxLength={8}
            minLength={8}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Chargement..." : "SE CONNECTER"}
        </button>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="forgot-password">
          <button
            onClick={handleForgotPassword}
            className="underline text-blue-500"
          >
            Mot de passe oublié ?
          </button>
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
