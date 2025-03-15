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
            .populate('userId', 'nomPrenom email site role dateInscription') // Sélection des champs nécessaires
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

        // URL de redirection vers votre plateforme
        const platformUrl = "http://localhost:5173/"; // Remplacez par l'URL réelle de votre plateforme

        const htmlMessage = `
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f9f9f9;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #ffffff;
                            border-radius: 12px; /* Coins légèrement arrondis */
                            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Ombre subtile */
                            overflow: hidden;
                            padding: 30px;
                        }
                        h1 {
                            color: ${action === 'accept' ? '#007BFF' : '#DC3545'}; /* Bleu pour accepté, rouge pour refusé */
                            text-align: center;
                            font-size: 24px;
                            font-weight: bold;
                            letter-spacing: 1px;
                        }
                        p {
                            font-size: 16px;
                            line-height: 1.6;
                            color: #333;
                            text-align: left;
                        }
                        .status-box {
                            background-color: ${action === 'accept' ? '#e7f3ff' : '#ffebee'}; /* Fond clair pour le statut */
                            color: ${action === 'accept' ? '#004085' : '#c62828'}; /* Texte bleu ou rouge */
                            padding: 15px;
                            border-radius: 8px; /* Coins arrondis doux */
                            text-align: center;
                            font-size: 18px;
                            font-weight: bold;
                            margin: 20px 0;
                        }
                        .footer {
                            text-align: left;
                            font-size: 14px;
                            color: #777;
                            margin-top: 20px;
                            border-top: 1px solid #ddd;
                            padding-top: 15px;
                        }
                        .button {
                            display: inline-block;
                            background: linear-gradient(135deg, #007BFF, #0056b3); /* Dégradé bleu pour accepté */
                            color: #fff;
                            text-decoration: none;
                            padding: 10px 20px;
                            border-radius: 6px; /* Coins arrondis discrets */
                            font-size: 16px;
                            font-weight: bold;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                            transition: all 0.3s ease;
                            text-transform: uppercase;
                            margin-top: 20px;
                        }
                        .button.rejected {
                            background: linear-gradient(135deg, #DC3545, #a71d2a); /* Dégradé rouge pour refusé */
                        }
                        .button:hover {
                            opacity: 0.9; /* Légère opacité au survol */
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Statut de votre inscription</h1>
                        <p>Bonjour,</p>
                        <p>Votre demande d'inscription a été ${action === 'accept' ? 'approuvée' : 'refusée'} par l'administrateur.</p>
                        <div class="status-box">
                            Statut : ${action === 'accept' ? 'Approuvé' : 'Refusé'}
                        </div>
                        <p>Nous vous remercions pour votre patience et restons à votre disposition pour toute information supplémentaire.</p>
                        ${
                            action === 'accept'
                                ? `<a href="${platformUrl}" class="button">Accéder à la plateforme</a>`
                                : `<a href="mailto:support@votreentreprise.com" class="button rejected">Contactez-nous</a>`
                        }
                        <div class="footer">
                            Ce message a été envoyé automatiquement. Veuillez ne pas y répondre directement.
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