import transporter from '../config/emailTransporter.js';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Obtenir le chemin du fichier actuel et le convertir en chemin de répertoire
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Chemin du fichier .env :', path.resolve(__dirname, '../.env'));

async function sendTestEmail() {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "eyaaaboughzelaa27@gmail.com",
            subject: "Test Nodemailer",
            text: "Ceci est un test d'envoi d'email avec Nodemailer.",
        });

        console.log("✅ Email envoyé avec succès :", info.response);
    } catch (error) {
        console.error("❌ Erreur d'envoi :", error);
    }
}

sendTestEmail();