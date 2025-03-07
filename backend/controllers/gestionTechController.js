import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Invitation from '../models/invitationModel.js';

// Chargez les variables d'environnement
dotenv.config();


// invitationModel.js
export const getPendingInvitations = async (req, res) => {
    try {
        const invitations = await Invitation.find({ status: 'pending' }).populate('userId');
        console.log('Invitations récupérées avec succès !', invitations);
        res.status(200).json(invitations);
    } catch (error) {
        console.error('Erreur lors de la récupération des invitations :', error.message);
        res.status(500).json({ message: 'Erreur lors de la récupération des invitations.' });
    }
};


// ======================================================
//                Contrôleur de Suppression
// ======================================================
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Vérifie si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé !' });
        }

        // Supprime l'utilisateur
        await user.deleteOne(); // Utilisez deleteOne() au lieu de remove()
        console.log(`✅ Utilisateur avec ID ${userId} supprimé avec succès !`);
        res.status(200).json({ message: 'Utilisateur supprimé avec succès !' });
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'utilisateur :', err.message);
        res.status(500).json({ message: 'Erreur interne du serveur. Veuillez réessayer plus tard.' });
    }
};

// ======================================================
//                Contrôleur pour obtenir tous les utilisateurs
// ======================================================
export const getAllUsers = async (req, res) => {
    try {
        // Pagination (optionnelle)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Récupère les utilisateurs avec pagination
        const users = await User.find().skip(skip).limit(limit);

        // Vérifie s'il y a des utilisateurs
        if (users.length === 0) {
            return res.status(404).json({ message: 'Aucun utilisateur trouvé !' });
        }

        console.log("✅ Liste des utilisateurs récupérée avec succès !");
        res.status(200).json(users);
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs :', err.message);
        res.status(500).json({ message: 'Erreur interne du serveur. Veuillez réessayer plus tard.' });
    }
};

// ======================================================
//                Contrôleur pour mettre à jour un utilisateur
// ======================================================
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params; // ID de l'utilisateur
        const { nomPrenom, site, matricule, email, password } = req.body;

        // Vérifie si l'utilisateur existe
        const findUser = await User.findById(id);
        if (!findUser) {
            return res.status(404).json({ message: 'Utilisateur non trouvé !' });
        }

        // Met à jour les champs uniquement si fournis
        findUser.nomPrenom = nomPrenom || findUser.nomPrenom;
        findUser.site = site || findUser.site;
        findUser.matricule = matricule || findUser.matricule;
        findUser.email = email || findUser.email;

        // Si un mot de passe est fourni, hachez-le
        if (password) {
            findUser.password = await bcrypt.hash(password, 10);
        }

        // Sauvegarde les modifications
        await findUser.save();
        console.log("✅ Utilisateur mis à jour avec succès !");
        res.status(200).json({ message: 'Utilisateur mis à jour avec succès !', user: findUser });
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', err.message);
        res.status(500).json({ message: 'Erreur interne du serveur. Veuillez réessayer plus tard.' });
    }
};

// ======================================================
//                Contrôleur pour envoyer une invitation à l'administrateur
// ======================================================
export const sendInvitationToAdmin = async (user) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'admin-email@example.com', // L'adresse email de l'administrateur
        subject: 'Nouvelle demande d\'inscription d\'un technicien',
        text: `Un technicien souhaite s'inscrire avec les détails suivants : \n\n
               Nom d'utilisateur: ${user.username} \n
               Email: ${user.email} \n\n
               Veuillez valider ou refuser cette demande d'inscription.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('📧 Email envoyé à l\'administrateur pour validation.');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error.message);
    }
};

// ======================================================
//                Contrôleur pour accepter ou refuser une invitation
// ======================================================
export const acceptOrRejectInvitation = async (req, res) => {
    try {
        const { userId, action } = req.query;

        // Vérifie si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Accepte ou refuse l'invitation
        if (action === 'accept') {
            await User.findByIdAndUpdate(userId, { status: 'validé' });

            // Envoie un email au technicien
            await sendEmailToTechnician(
                user.email,
                'Votre compte a été validé',
                'Votre inscription a été validée par l\'administrateur. Vous pouvez maintenant vous connecter.'
            );

            return res.json({ message: 'Invitation acceptée. Le technicien peut se connecter.' });
        } else if (action === 'reject') {
            await User.findByIdAndUpdate(userId, { status: 'refusé' });

            // Envoie un email au technicien
            await sendEmailToTechnician(
                user.email,
                'Votre compte a été refusé',
                'Votre inscription a été refusée par l\'administrateur.'
            );

            return res.json({ message: 'Invitation refusée.' });
        } else {
            return res.status(400).json({ message: 'Action invalide.' });
        }
    } catch (error) {
        console.error('Erreur lors de l\'acceptation/refus de l\'invitation :', error.message);
        res.status(500).json({ message: 'Erreur serveur.', error: error.message });
    }
};

// ======================================================
//                Contrôleur pour envoyer un email au technicien
// ======================================================
export const sendEmailToTechnician = async (email, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text,
        });
        console.log(`📧 Email envoyé à ${email}`);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error.message);
    }
};