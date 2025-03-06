import express from "express";
import { auth } from "express-oauth2-jwt-bearer"; // Importation du middleware
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import jwt from "jsonwebtoken";

dotenv.config({ path: "./.env" }); // Charger les variables d'environnement

connectDB(); // Connexion à la base de données

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(helmet());
app.use(express.json());

app.use("/api/users", userRoutes); // Utiliser les routes utilisateur
app.use("/api/password", passwordRoutes); // Utiliser les routes de réinitialisation du mot de passe

console.log("📩 EMAIL_USER :", process.env.EMAIL_USER);
console.log("🔑 EMAIL_PASS :", process.env.EMAIL_PASS ? "OK" : "NON DÉFINI");

// Vérification du JWT et de la clé secrète
const checkJwt = auth({
  audience: "https://dev-l6ahn3xj3jdh0ku4.us.auth0.com/api/v2/", // Remplace par ton API Identifier
  issuerBaseURL: "https://dev-l6ahn3xj3jdh0ku4.us.auth0.com/", // Remplace par ton domaine Auth0
});

app.get("/api/private", checkJwt, (req, res) => {
  // Route protégée
  res.json({ message: "Bienvenue dans la zone protégée!" });
});

// Si vous voulez signer un JWT vous-même (pour un autre usage)
const generateJwt = () => {
  const payload = { userId: 123 }; // Exemple de charge utile
  const secret = process.env.JWT_SECRET; // Utilisation de la clé secrète
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in .env");
  }
  return jwt.sign(payload, secret, { expiresIn: "1h" }); // Créer un JWT signé
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
