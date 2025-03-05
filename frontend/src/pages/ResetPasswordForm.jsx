import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./ResetPasswordForm.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";







function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Empêche le rechargement de la page
  
    console.log("🔍 Données envoyées :", { email, newPassword: password });
  
    axios
      .post("http://localhost:3000/api/password/reset-password", {
        email,
        newPassword: password,
      })
      .then((response) => {
        console.log("✅ Mot de passe réinitialisé :", response.data);
  
        // 📌 1. Afficher le message de succès
        setSuccessMessage("Mot de passe réinitialisé avec succès ! Redirection...");
  
        // 📌 2. Attendre 2 secondes avant de rediriger vers la page de connexion
        setTimeout(() => {
          navigate("/");
        }, 2000); // 2000ms = 2 secondes
      })
      .catch((error) => {
        console.error("❌ Erreur :", error);
        setErrorMessage("Échec de la réinitialisation du mot de passe");
      });
  };
  
  

  return (
    <div className="reset-container">
      <h2>Réinitialisation du mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
       
    <div className="input-wrapper">
      <input
        type={showPassword ? "text" : "password"} // Cache ou affiche le mot de passe
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={8} // Longueur minimale
        maxLength={8}// Longueur maximale
        required
      />
      <span
        className="eye-icon"
        onClick={() => setShowPassword(!showPassword)} // Inverse l'état
        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
      >
        {showPassword ? <FaEye /> : <FaEyeSlash />}
      </span>
    </div>
  
          
        </div>

        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8} // Longueur minimale
            maxLength={8}// Longueur maximale
            required
          />
          <span
        className="eye-icon"
        onClick={() => setShowPassword(!showPassword)} // Inverse l'état
        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
      >
        {showPassword ? <FaEye /> : <FaEyeSlash />}
      </span>
        </div>

        <button type="submit">Confirmer</button>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </form>
    </div>
  );
}

export default ResetPasswordForm;
