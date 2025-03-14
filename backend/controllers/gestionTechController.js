import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Invitation from '../models/invitationModel.js';
import transporter from '../config/emailTransporter.js';
import mongoose from 'mongoose';  // Ajoute ceci

dotenv.config();

// Récupérer les invitations en attente
export const getPendingInvitations = async (req, res) => {
    try {
        const invitations = await Invitation.find({ status: 'pending' })
            .populate('userId', 'nomPrenom email site') // Sélection des champs nécessaires
            .exec();
        
        res.status(200).json(invitations);
    } catch (error) {
        console.error('Erreur lors de la récupération des invitations :', error.message);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des invitations' });
    }
};

// Suppression d'un utilisateur
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Suppression des invitations associées
        await Invitation.deleteMany({ userId: id });
        
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (err) {
        console.error('Erreur lors de la suppression :', err.message);
        res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
    }
};

// Obtenir tous les utilisateurs avec pagination
export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .skip(skip)
            .limit(limit)
            .select('nomPrenom email role status') // Sécurité : ne pas exposer le mot de passe
            .exec();

        res.status(200).json({
            page,
            total: await User.countDocuments(),
            users
        });
    } catch (err) {
        console.error('Erreur lors de la récupération :', err.message);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération' });
    }
};

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Gestion sécurisée du mot de passe
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error('Erreur lors de la mise à jour :', err.message);
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
    }
};

// Accepter ou refuser une invitation
export const acceptOrRejectInvitation = async (req, res) => {
    const invitationId = req.params.id; // Extraction de l'ID de l'invitation
    const { action, rejectionReason } = req.body; // Extraction de l'action et du motif de rejet

    // Vérification des paramètres
    if (!invitationId || !action) {
        return res.status(400).json({ message: 'Paramètres manquants' });
    }

    

    try {
        // Recherche de l'invitation par ID
        const invitation = await Invitation.findById(invitationId); // Assurez-vous de récupérer l'invitation ici

        // Vérification si l'invitation existe
        if (!invitation) {
            return res.status(404).json({ message: 'Invitation non trouvée' });
        }

        // Si l'invitation a déjà un statut différent de 'pending'
        if (invitation.status !== 'pending') {
            return res.status(400).json({ message: 'Invitation déjà traitée' });
        }

        // Mise à jour du statut de l'invitation
        invitation.status = action === 'accept' ? 'accepted' : 'rejected';

        // Si rejeté, on peut éventuellement ajouter une raison de rejet
        if (action === 'reject') {
            invitation.rejectionReason = rejectionReason || '' ;  // Ajout du motif de rejet
        }

        await invitation.save(); // Sauvegarde de l'invitation mise à jour

        //Récupération de l'email de l'utilisateur (technicien)
        // Met à jour le statut de l'utilisateur si l'invitation est acceptée ou rejetée
        await User.findByIdAndUpdate(invitation.userId, { status: action === 'accept' ? 'accepted' : 'rejected' });


         // Envoi de l'email à l'utilisateur
         const user = await User.findById(invitation.userId);

        if (user) {
            const subject = `Statut de votre invitation : ${action === 'accept' ? 'Acceptée' : 'Refusée'}`;
            const message = `Votre invitation a été ${action === 'accept' ? 'acceptée' : 'refusée'} par l'administrateur.`;
            
            // Envoi de l'email au technicien
            await sendEmailToTechnician(user.email, subject, message, action);
        }

        res.status(200).json({ message: `Invitation ${action} avec succès`, invitation });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'invitation:', error.message);
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
    }
};

// Envoyer un email au technicien
const sendEmailToTechnician = async (email, subject, message, action) => {
    try {
        console.log("Envoi de l'email à :", email); // Affiche l'email du destinataire
        console.log("Sujet de l'email :", subject); // Affiche le sujet
        console.log("Contenu de l'email :", message); // Affiche le texte du message

        const htmlMessage = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            color: #333;
                            background-color: #f4f4f9;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #fff;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #4CAF50;
                            text-align: center;
                        }
                        p {
                            font-size: 16px;
                            line-height: 1.5;
                        }
                        .status {
                            font-weight: bold;
                            color: #fff;
                            padding: 10px;
                            border-radius: 5px;
                            text-align: center;
                        }
                        .accepted {
                            background-color: #4CAF50;
                        }
                        .rejected {
                            background-color: #F44336;
                        }
                        .footer {
                            margin-top: 20px;
                            text-align: center;
                            font-size: 14px;
                            color: #aaa;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Statut de votre invitation</h1>
                        <p>Bonjour,</p>
                        <p>Votre invitation a été ${action === 'accept' ? 'acceptée' : 'refusée'} par l'administrateur.</p>
                        <div class="status ${action === 'accept' ? 'accepted' : 'rejected'}">
                            <p>${action === 'accept' ? 'Acceptée' : 'Refusée'}</p>
                        </div>
                        <p>Nous vous remercions pour votre patience et restons à votre disposition pour toute information supplémentaire.</p>
                        <div class="footer">
                            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
                        </div>
                    </div>
                </body>
            </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            html: htmlMessage, // Utilisez 'html' au lieu de 'message'
        };

        await transporter.sendMail(mailOptions);

        console.log("Email envoyé avec succès à :", email); // Confirmation d'envoi
    } catch (error) {
        console.error("Erreur d'envoi d'email :", error.message); // Affiche l'erreur exacte si échec
        throw new Error('Erreur lors de l\'envoi de l\'email');
    }
};
