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

<<<<<<< HEAD
  const navigate = useNavigate();
=======
  const navigate = useNavigate(); // Utilisation de navigate pour rediriger
>>>>>>> a18b53d3524d96b0c576eb7ed2f2975730888dda

  // Fonction de connexion
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true); // Afficher l'indicateur de chargement

    axios
      .post("http://localhost:3000/api/users/login", { email, password })
      .then((response) => {
        console.log("✅ Connexion réussie :", response.data);
<<<<<<< HEAD
        localStorage.setItem("token", response.data.token); // Stocker le token
        navigate("/dashboard");
=======
        localStorage.setItem("token", response.data.token); // Stockage du token
        navigate("/dashboard"); // Redirection vers l'admin panel après connexion
>>>>>>> a18b53d3524d96b0c576eb7ed2f2975730888dda
      })
      .catch((error) => {
        setLoading(false); // Arrêter l'indicateur de chargement
        console.error("❌ Erreur de connexion :", error);
        setErrorMessage(
          error.response?.data?.message ||
            "Erreur de connexion avec le serveur."
        );
      });
  };

  // Fonction mot de passe oublié
  const handleForgotPassword = (event) => {
    event.preventDefault();
<<<<<<< HEAD
    setLoading(true); // Afficher le message "Chargement..."

    if (!email) {
      setLoading(false); // Arrêter le chargement si l'email est vide
      setErrorMessage("❌ Veuillez entrer votre adresse email.");
=======

    if (!email) {
      console.error(
        "❌ Veuillez entrer votre adresse email avant de continuer."
      );
>>>>>>> a18b53d3524d96b0c576eb7ed2f2975730888dda
      return;
    }

    axios
      .post("http://localhost:3000/api/password/forgot-password", { email })
      .then((response) => {
        console.log("✅ Email de récupération envoyé :", response.data);
<<<<<<< HEAD
        navigate("/verification-code", { state: { email } });
=======
        navigate("/verification-code", { state: { email } }); // Navigation vers la page de vérification du code
>>>>>>> a18b53d3524d96b0c576eb7ed2f2975730888dda
      })
      .catch((error) => {
        setLoading(false); // Arrêter le chargement
        console.error("❌ Erreur lors de l'envoi du code :", error);
        setErrorMessage("❌ Erreur lors de l'envoi de l'email de récupération.");
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
<<<<<<< HEAD

        <button type="submit" disabled={loading}>
          {loading ? "Chargement..." : "SE CONNECTER"}
        </button>
=======
        <button type="submit">SE CONNECTER</button>
>>>>>>> a18b53d3524d96b0c576eb7ed2f2975730888dda

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="forgot-password">
          <Link
            to="/verification-code"
            onClick={handleForgotPassword}
            className="underline text-blue-500"
          >
            Mot de passe oublié ?
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
