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
const [nameError, setNameError] = useState("");
const [siteError, setSiteError] = useState("");
const [matriculeError, setMatriculeError] = useState("");
const [emailError, setEmailError] = useState("");
const [passwordError, setPasswordError] = useState("");

const handleSubmit = (event) => {
event.preventDefault();
let isValid = true;

// Réinitialisation des messages d'erreur
setNameError("");
setSiteError("");
setMatriculeError("");
setEmailError("");
setPasswordError("");

// Validation des champs
if (!name.trim()) {//trim() supprime les espaces vides au début et à la fin de la chaîne
setNameError("Nom obligatoire!");
isValid = false;
}

if (!matricule.trim()) { //trime tverfi si la chaine est vide
setMatriculeError("Matricule obligatoire!");
isValid = false;
} else if (matricule.length < 5) {
setMatriculeError("Le matricule doit comporter exactement 5 chiffres!");
isValid = false;
}

if (!site.trim()) {
setSiteError("Veuillez choisir un site!");
isValid = false;
}

if (!email.trim()) {
setEmailError("Email obligatoire!");
isValid = false;
} if (!/^[^\s@]+@[^\s@]+\.[^\s@]+/.test(email)) {
setEmailError("L'email n'est pas valide !");
isValid = false;

}

if(!password.trim()) {
setPasswordError("Mot de passe obligatoire!");
isValid = false;
} else if (password.length < 8) {
setPasswordError("Le mot de passe doit comporter exactement 8 caracteres!");
isValid = false;
}

if (!isValid) {
return;
}

const userData = {
nomPrenom: name,
site: site,
matricule: matricule,
email: email,
password: password,
};

axios
.post("http://localhost:3000/api/users/register", userData)
.then((response) => {
console.log(response.data);
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
{nameError && <div className="error-message">{nameError}</div>}
</div>

<div className="input-wrapper">
<input
type="text"
inputMode="numeric" // Permet un clavier numérique sur mobile
pattern="[0-9]*" // Indique que seuls les chiffres sont autorisé
placeholder="Matricule (5 Chiffres)"
value={matricule}
onChange={(e) => {
if (/^\d*$/.test(e.target.value) && e.target.value.length <= 5) {
setMatricule(e.target.value);
}
}}
maxLength="5"
style={{ color: "black" }}
/>
{matriculeError && <div className="error-message">{matriculeError}</div>}
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
{siteError && <div className="error-message">{siteError}</div>}
</div>

<div className="input-wrapper">
<input
type="email"
placeholder="Adresse Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
style={{ color: "black" }}
/>
{emailError && <div className="error-message">{emailError}</div>}
</div>

<div className="input-wrapper password-wrapper">
<input
type={showPassword ? "text" : "password"}
placeholder="Mot de passe"
value={password}
onChange={(e) => setPassword(e.target.value)}
minLength="8"
maxLength="8"
style={{ color: "black" }}
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
{passwordError && <div className="error-message">{passwordError}</div>}
</div>

<button type="submit">S'INSCRIRE</button>
{errorMessage && <div className="error-message">{errorMessage}</div>}

<div className="login-link">
Vous avez déjà un compte?{" "}
<Link to="/" className="underline text-blue-500">
Connectez-vous
</Link>
</div>
</form>
</div>
);
}

export default RegistrationForm;