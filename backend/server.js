// server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import passwordRoutes from './routes/passwordRoutes.js';

dotenv.config({ path: './.env' }); // Forcer le chemin de .env // Charger les variables d'environnement

connectDB(); // Connexion à la base de données

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(helmet());
app.use(express.json());

app.use('/api/users', userRoutes); // Utiliser les routes utilisateur
// Routes
app.use('/api/password', passwordRoutes);// Utiliser les routes de réinitialisation du mot de passe

console.log("📩 EMAIL_USER :", process.env.EMAIL_USER);
console.log("🔑 EMAIL_PASS :", process.env.EMAIL_PASS ? "OK" : "NON DÉFINI");


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
