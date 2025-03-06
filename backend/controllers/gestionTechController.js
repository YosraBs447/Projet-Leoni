import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';


// ======================================================
//                Contrôleur de Suppression
// ======================================================
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;  // On récupère l'ID de l'utilisateur à supprimer

        // Recherche de l'utilisateur dans la base de données
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé !' });
        }

        // Suppression de l'utilisateur
        await user.remove();
        
        console.log(`✅ Utilisateur avec ID ${userId} supprimé avec succès !`);
        res.status(200).json({ message: 'Utilisateur supprimé avec succès !' });
    } catch (err) {
        console.error(err);  // Log l'erreur côté serveur pour le débogage
        res.status(500).json({ message: 'Erreur interne du serveur. Veuillez réessayer plus tard.' });
    }
};




// ======================================================
//                Contrôleur pour obtenir tous les utilisateurs
// ======================================================
export const getAllUsers = async (req, res) => {
    try {
        // Récupération de tous les utilisateurs dans la base de données
        const users = await User.find();

        // Vérification s'il y a des utilisateurs dans la base de données
        if (users.length === 0) {
            return res.status(404).json({ message: 'Aucun utilisateur trouvé !' });
        }

        console.log("✅ Liste des utilisateurs récupérée avec succès !");
        res.status(200).json(users);  // Renvoi des utilisateurs au client
    } catch (err) {
        console.error(err);  // Log l'erreur côté serveur pour le débogage
        res.status(500).json({ message: 'Erreur interne du serveur. Veuillez réessayer plus tard.' });
    }
};



// ======================================================
//                Contrôleur pour mettre à jour un utilisateur
// ======================================================
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;  // On récupère l'ID de l'utilisateur depuis les paramètres de la requête
        const { nomPrenom, site, matricule, email, password } = req.body;

        // Vérification si l'utilisateur existe
        const findUser = await User.findById(id);
        if (!findUser) {
            return res.status(404).send({ message: 'Utilisateur non trouvé !' });
        }

        // Mise à jour des informations de l'utilisateur
        findUser.nomPrenom = nomPrenom || findUser.nomPrenom;
        findUser.site = site || findUser.site;
        findUser.matricule = matricule || findUser.matricule;
        findUser.email = email || findUser.email;

        // Si un nouveau mot de passe est fourni, on le hache avant de le sauvegarder
        if (password) {
            findUser.password = await bcrypt.hash(password, 10);
        }

        // Sauvegarde des modifications
        await findUser.save();

        console.log("✅ Utilisateur mis à jour avec succès !");
        res.status(200).send({ message: 'Utilisateur mis à jour avec succès !', user: findUser });
    } catch (err) {
        console.error(err);  // Log l'erreur côté serveur pour le débogage
        res.status(500).send({ message: 'Erreur interne du serveur. Veuillez réessayer plus tard.' });
    }
};

// ======================================================
//               // Fonction pour envoyer une invitation à l'administrateur pour valider un technicient
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
        console.log('Email envoyé à l\'administrateur pour validation.');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
    }
}



// ======================================================
//                Contrôleur pour accepter ou refuser une invitation    
// ======================================================

export const acceptOrRejectInvitation = async (req, res) => {
    try {
        const { userId, action } = req.query;

        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        if (action === 'accept') {
            await User.findByIdAndUpdate(userId, { status: 'validé' });

            // Envoyer un email au technicien
            await sendEmailToTechnician(
                user.email,
                'Votre compte a été validé',
                'Votre inscription a été validée par l\'administrateur. Vous pouvez maintenant vous connecter.'
            );

            return res.json({ message: 'Invitation acceptée. Le technicien peut se connecter.' });
        } else if (action === 'reject') {
            await User.findByIdAndUpdate(userId, { status: 'refusé' });

            // Envoyer un email au technicien
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
        res.status(500).json({ message: 'Erreur serveur.', error });
    }
};

// ======================================================
//                Contrôleur pour envoyer un email au technicient
// ======================================================
export const sendEmailToTechnician = async (email, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text,
        });
        console.log(`📩 Email envoyé à ${email}`);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error);
    }
};


