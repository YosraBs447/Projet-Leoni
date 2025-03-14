import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import {
  sendInvitationToAdmin,
  sendEmailToTechnician,
} from "./controllers/gestionTechController.js";
import User from "./models/userModel.js";
import jwt from "jsonwebtoken";
import gestionTechRoutes from "./routes/gestionTechRoutes.js";
import Checklist from "./models/Checklist.js"; // Import du modèle Checklist

dotenv.config({ path: "./.env" }); // Charger les variables d'environnement

connectDB(); // Connexion à la base de données

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(helmet());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/admin", gestionTechRoutes); // Préfixe '/api' pour toutes les routes de gestion des techniciens

console.log("📩 EMAIL_USER :", process.env.EMAIL_USER);
console.log("🔑 EMAIL_PASS :", process.env.EMAIL_PASS ? "OK" : "NON DÉFINI");

// Vérification du JWT et de la clé secrète
const checkJwt = auth({
  audience: "https://dev-l6ahn3xj3jdh0ku4.us.auth0.com/api/v2/",
  issuerBaseURL: "https://dev-l6ahn3xj3jdh0ku4.us.auth0.com/",
});

// Route protégée pour l'admin
app.get("/api/admin", checkJwt, (req, res) => {
  res.json({ message: "Bienvenue dans la zone admin!" });
});

// Route pour l'inscription du technicien
app.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const user = new User({
      email,
      username,
      password,
      role: "technicien",
      status: "en attente",
    });

    await user.save();

    // Envoi d'un email à l'admin pour valider le technicien
    await sendInvitationToAdmin(user);

    res.status(201).send({
      message: "Technicien inscrit avec succès. En attente de validation.",
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).send({ message: "Erreur lors de l'inscription." });
  }
});

// Route pour accepter ou refuser un technicien
app.put("/accept-invitation/:userId/:action", async (req, res) => {
  try {
    const { userId, action } = req.params;

    // Validation des entrées
    if (!["accept", "reject"].includes(action)) {
      return res.status(400).send("Action invalide.");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé.");
    }

    // Mise à jour du statut de l'utilisateur
    const newStatus = action === "accept" ? "validé" : "refusé";
    await User.findByIdAndUpdate(userId, { status: newStatus });

    // Message à envoyer par email
    const emailSubject =
      action === "accept"
        ? "Votre compte a été validé"
        : "Votre compte a été refusé";
    const emailBody =
      action === "accept"
        ? "Votre inscription a été validée par l'administrateur. Vous pouvez maintenant vous connecter."
        : "Votre inscription a été refusée par l'administrateur.";

    try {
      await sendEmailToTechnician(user.email, emailSubject, emailBody);
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email :", emailError);
      return res
        .status(500)
        .send("Mise à jour effectuée, mais échec de l'envoi de l'email.");
    }

    res.send(
      action === "accept"
        ? "Invitation acceptée, le technicien peut maintenant accéder à l'interface."
        : "Invitation refusée."
    );
  } catch (error) {
    console.error("Erreur dans l'acceptation de l'invitation :", error);
    res.status(500).send("Erreur serveur.");
  }
});

// Génération d'un JWT signé
const generateJwt = (userId) => {
  if (!userId) {
    throw new Error("userId is required to generate a JWT."); // Vérification de l'ID de l'utilisateur
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in .env"); // Vérification de la clé secrète
  }

  const payload = { userId };

  return jwt.sign(payload, secret, { expiresIn: "1h", algorithm: "HS256" }); // Génération du JWT
};

// Route pour créer une checklist
app.post("/api/admin/checklist", checkJwt, async (req, res) => {
  try {
    const { title, assigned_to } = req.body;

    // Vérifier si les informations nécessaires sont présentes
    if (!title || !assigned_to) {
      return res.status(400).send("Le titre et l'assignation sont requis.");
    }

    // Créer une nouvelle checklist
    const checklist = new Checklist({
      title,
      assigned_to,
    });

    // Sauvegarder la checklist dans la base de données
    await checklist.save();

    res.status(201).send({ message: "Checklist créée avec succès", checklist });
  } catch (error) {
    console.error("Erreur lors de la création de la checklist :", error);
    res
      .status(500)
      .send({ message: "Erreur serveur lors de la création de la checklist." });
  }
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
