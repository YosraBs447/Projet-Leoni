import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./VerificationCodeForm.css";
import axios from "axios";

function VerificationCodeForm() {
  const [code, setCode] = useState(new Array(6).fill(""));// Tableau de 6 éléments initialisé à vide
  const [errorMessage, setErrorMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(45); // Timer de 45 secondes
  const [canResend, setCanResend] = useState(false);// Autoriser le renvoi du code
  const navigate = useNavigate();
  const location = useLocation();// Obtenir les données de l'emplacement actuel
  const email = location.state?.email || "";

  console.log("📩 Email récupéré dans VerificationCodeForm:", email);

  // Décrémenter le timer chaque seconde
  useEffect(() => { 
    if (timeLeft > 0) {  // Vérifier si le timer n'est pas encore expiré
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);  // Décrémenter le timer de 1 seconde
      return () => clearTimeout(timer); // Nettoyer le timer
    } else {
      setCanResend(true); // Autoriser le renvoi du code après expiration
    }
  }, [timeLeft]);

  // Gérer la saisie des chiffres du code
  const handleChange = (element, index) => {
    const value = element.value;
    if (/^[0-9]$/.test(value) || value === "") { // /^[0-9]$/ s'assure que l'utilisateur n'entre qu'un seul chiffre (0-9).
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value !== "" && index < 5) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
      if (value === "" && index > 0) {
        document.getElementById(`code-input-${index - 1}`).focus();
      }
    }
  };

  // Vérification du code
  const handleSubmit = (event) => {
    event.preventDefault();
    const finalCode = code.join("");
    console.log("🔍 Email envoyé à l'API :", email);
    console.log("🔍 Code envoyé :", finalCode);

    axios
      .post("http://localhost:3000/api/password/verify-code", {
        email,
        code: finalCode,
      })
      .then((response) => {
        console.log("✅ Code vérifié :", response.data);
        navigate("/reset-password", { state: { email } });
      })
      .catch((error) => {
        console.error("❌ Erreur de vérification du code :", error);
        setErrorMessage("Code invalide ou expiré");
      });
  };

  // Renvoyer un nouveau code
  const handleResendCode = () => {
    setCanResend(false);
    setTimeLeft(45);
    setErrorMessage("");

    axios
      .post("http://localhost:3000/api/password/forgot-password", { email })
      .then((response) => {
        console.log("✅ Nouveau code envoyé :", response.data);
      })
      .catch((error) => {
        console.error("❌ Erreur lors du renvoi du code :", error);
        setErrorMessage("Erreur lors du renvoi du code.");
      });
  };

  return (
    <div className="verification-container">
      <h2>Vérification du Code</h2>
      <p>Verifiez votre email!</p>
      <form onSubmit={handleSubmit}>
        <div className="code-inputs">
          {code.map((value, index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              maxLength="1"
              value={value}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        <button type="submit">Vérifier le Code</button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {/* Affichage du timer et du lien pour renvoyer le code */}
        {timeLeft > 0 ? (
          <p className="timer">Renvoyer le code dans {timeLeft}s</p>
        ) : (
          <p className="resend-link">
            <a href="#" onClick={handleResendCode}>Renvoyer le Code</a>
          </p>
        )}
      </form>
    </div>
  );
}

export default VerificationCodeForm;
