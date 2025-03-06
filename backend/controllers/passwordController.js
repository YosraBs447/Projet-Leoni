import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer'; // Importation du module nodemailer
import transporter from '../config/emailTransporter.js'; // Importation du transporteur d'email

dotenv.config(); // Charger les variables d'environnement

// ✅ Envoi du code de vérification
export const sendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;

        // 📌 Vérification si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: 'Utilisateur non trouvé.' });
        }

        // 📌 Génération du code à 6 chiffres
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("🔹 Code généré et enregistré :", verificationCode); // Debug
        console.log("🔹 Code généré avant hachage :", verificationCode); // Debug
        


        // 📌 Expiration dans 10 minutes
        const expiration = new Date(Date.now() + 45 * 1000);

        // 📌 Hashage du code avant stockage
        const saltRounds = 10;
        const hashedCode = await bcrypt.hash(verificationCode, saltRounds);
        console.log("🔹 Code haché enregistré :", hashedCode); // Debug

        // 📌 Mise à jour des informations de l'utilisateur
        user.verificationCode = hashedCode;
        user.codeExpiration = expiration;
        await user.save();

        // 📩 LOGS POUR DEBUG 
        console.log("📩 Tentative d'envoi d'un email...");
        console.log("📩 Envoi d'un email à :", user.email);

        // 📌 Envoi de l'email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Code de vérification',
            html: `
            <div style="font-family: Arial, sans-serif; text-align: center; color: #112d6c;">
              <h2>Votre code de vérification</h2>
              <p>Utilisez le code ci-dessous pour compléter votre vérification :</p>
              <h1 style="font-size: 24px; letter-spacing: 3px;">${verificationCode}</h1>
              <p>Ce code expirera dans <b>45 secondes</b>.</p>
              <p>Email associé : <b>${user.email}</b></p>
              
            `
        };

        console.log("📩 Contenu du mailOptions :", mailOptions);

        try {
            let info = await transporter.sendMail(mailOptions);
            console.log("✅ Email envoyé ! ID :", info.messageId);
            res.send({ message: 'Code de vérification envoyé avec succès.' });
        } catch (error) {
            console.error("❌ ERREUR lors de l'envoi de l'email :", error);
            res.status(500).send({ message: "Erreur lors de l'envoi de l'email." });
        }

    } catch (err) {
        console.error("❌ Erreur lors de l'envoi du code :", err);
        res.status(500).send({ message: err.message });
    }
};


// ✅ Vérification du code entré par l'utilisateur
// ✅ Vérification du code entré par l'utilisateur
export const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;
         // 🔍 Ajoute ce log pour voir l'email reçu
         console.log(`🔍 Email reçu par l'API : ${email}`);

        console.log(`🔹 Demande de vérification pour : ${email}`); // Debug

          // 📌 Normalisation de l'email pour éviter les erreurs (supprime espaces + minuscule)
          const normalizedEmail = email.trim().toLowerCase();

          // 📌 Recherche de l'utilisateur
          const user = await User.findOne({ email: normalizedEmail });

       

        if (!user) {
            console.warn("❌ Utilisateur non trouvé.");
            return res.status(400).send({ message: 'Utilisateur non trouvé.' });
        }

        if (!user.verificationCode || !user.codeExpiration) {
            console.warn("❌ Aucun code enregistré.");
            return res.status(400).send({ message: 'Aucun code enregistré. Veuillez en demander un nouveau.' });
        }

        // 📌 Vérification et conversion de l'expiration du code
        const expirationDate = new Date(user.codeExpiration);
        const currentDate = new Date();

        console.log("🔹 Date actuelle :", currentDate);
        console.log("🔹 Expiration du code :", expirationDate);

        if (expirationDate < currentDate) {
            console.warn("❌ Code expiré.");
            return res.status(400).send({ message: 'Code expiré. Demandez un nouveau code.' });
        }

        console.log("🔹 Code entré :", code);
        console.log("🔹 Vérification du code...");

        // 📌 Vérification du code avec bcrypt
        const isCodeValid = await bcrypt.compare(code, user.verificationCode);
        
        if (!isCodeValid) {
            console.warn("❌ Code invalide.");
            return res.status(400).send({ message: 'Code invalide. Vérifiez votre saisie.' });
        }

        console.log("✅ Code valide. Suppression après validation.");

        // 📌 Suppression du code de vérification après validation
        user.verificationCode = null;
        user.codeExpiration = null;
        await user.save();

        res.status(200).send({ message: 'Code vérifié avec succès.' });
    } catch (err) {
        console.error("❌ Erreur lors de la vérification du code :", err);
        res.status(500).send({ message: "Une erreur interne s'est produite. Veuillez réessayer plus tard." });
    }


};

export const resetPassword = async (req, res) => {
    try {
        console.log("📩 Données reçues :", req.body); // Ajoute ce log

        const { email, newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: "Le mot de passe est requis." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        console.error("❌ Erreur lors de la réinitialisation du mot de passe :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};



