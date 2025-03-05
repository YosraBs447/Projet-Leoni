import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du fichier actuel et le convertir en chemin de répertoire
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Erreur: EMAIL_USER ou EMAIL_PASS n'est pas défini dans le fichier .env");
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Utilisation du mot de passe d’application généré
    },
});

// Tester la connexion au serveur SMTP
transporter.verify((error, success) => {
    if (error) {
        console.error("Erreur de connexion à Gmail:", error);
    } else {
        console.log("Connexion réussie à Gmail, prêt à envoyer des emails !");
    }
});

export default transporter;
