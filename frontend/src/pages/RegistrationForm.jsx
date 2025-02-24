import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./RegistrationForm.css";

function RegistrationForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [matricule, setMatricule] = useState("");
  const [site, setSite] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Logique de soumission du formulaire
    console.log("Form submitted:", {
      name,
      matricule,
      site,
      email,
      password,
      role,
    });
    // Par exemple, après une inscription réussie, rediriger vers la page de connexion :
    navigate("/");
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
            maxLength="5" // Empêche d'écrire plus de 5 caractères
            style={{ color: "black" }}
          />
        </div>
        <div className="input-wrapper">
          <select value={site} onChange={(e) => setSite(e.target.value)}>
            <option value="">Selectionner un site</option>
            <option value="site1">TN4</option>
            <option value="site2">TN3</option>
            <option value="site3">TNS</option>
            <option value="site4">TNM</option>
            <option value="site5">TNMAC</option>
            <option value="site6">TNMAE</option>
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
        <div className="input-wrapper">
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ color: "black" }}
          />
        </div>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="Technicien"
              checked={role === "Technicien"}
              onChange={(e) => setRole(e.target.value)}
            />
            Technicien
          </label>
          <label>
            <input
              type="radio"
              value="Administrateur"
              checked={role === "Administrateur"}
              onChange={(e) => setRole(e.target.value)}
            />
            Administrateur
          </label>
        </div>
        <button type="submit">S'INSCRIRE</button>
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
