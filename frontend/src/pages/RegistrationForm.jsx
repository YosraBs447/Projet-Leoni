import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./RegistrationForm.css";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

function RegistrationForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [matricule, setMatricule] = useState("");
  const [site, setSite] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
 
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const userData = {
      nom: name,
      prenom: site, // Tu peux utiliser site comme prénom ou changer selon ta logique
      matricule: matricule,
      email: email,
      password: password,
      
    };

    axios
      .post("http://localhost:3000/register", userData)
      .then((response) => {
        console.log(response.data);
        alert(response.data.message);
        navigate("/"); // Redirection vers la page de connexion après inscription réussie
      })
      .catch((error) => {
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Erreur de connexion avec le serveur");
        }
      });
  };

  return (
    <div className="registration-container">
      <h2>S'INSCRIRE</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Nom et Prenom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ color: "black" }}
          />
        </div>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Matricule (5 Chiffres)"
            value={matricule}
            onChange={(e) => {
              if (e.target.value.length <= 5) {
                setMatricule(e.target.value);
              }
            }}
            maxLength="5"
            style={{ color: "black" }}
          />
        </div>
        <div className="input-wrapper">
          <select value={site} onChange={(e) => setSite(e.target.value)}>
            <option value="">Selectionner un site</option>
            <option value="TN4">TN4</option>
            <option value="TN3">TN3</option>
            <option value="TNS">TNS</option>
            <option value="TNM">TNM</option>
            <option value="TNMAC">TNMAC</option>
            <option value="TNMAE">TNMAE</option>
          </select>
        </div>
        <div className="input-wrapper">
          <input
            type="email"
            placeholder="Adresse Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ color: "black" }}
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
       
        <button type="submit">S'INSCRIRE</button>
        {errorMessage && (
          <div className="error-message">{errorMessage}</div>
        )}
        <div className="login-link">
          Vous avez déjà un compte?{" "}
          <Link to="/" className="underline">
            Connectez-vous
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegistrationForm;
