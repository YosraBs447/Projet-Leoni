import React, { useState } from "react";
import "./LoginForm.css";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

function LoginForm() {
  const [email, setEmail] = useState("");//usesate pour initialiser la valeur de l'input
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();//useNavigate pour naviguer entre les pages

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:3000/api/users/login", { email, password })
      .then((response) => {
        console.log("✅ Connexion réussie :", response.data);
        localStorage.setItem("token", response.data.token);//stocker le token dans le localstorage
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("❌ Erreur de connexion :", error);
        setErrorMessage(error.response?.data?.message || "Erreur de connexion avec le serveur.");
      });
  };

  const handleForgotPassword = (event) => {
    event.preventDefault(); // Empêcher la navigation par défaut du lien
  
    if (!email) {
      console.error("❌ Veuillez entrer votre adresse email avant de continuer.");
      return;
    }
  
    axios
      .post("http://localhost:3000/api/password/forgot-password", { email })
      .then((response) => {
        console.log("✅ Email de récupération envoyé :", response.data);
        
        // Rediriger vers VerificationCodeForm avec l'email
        navigate("/verification-code", { state: { email } });
      })
      .catch((error) => {
        console.error("❌ Erreur lors de l'envoi du code :", error);
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
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <Eye /> : <EyeOff />}
          </span>
        </div>
        <button type="submit">SE CONNECTER</button>
        
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="forgot-password">
          <Link
            to="/verification-code" // Vous définissez la route ici
            onClick={handleForgotPassword} // Appel de la fonction avant la navigation
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
