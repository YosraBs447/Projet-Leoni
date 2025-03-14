// Importation des modules nécessaires
import jwt from 'jsonwebtoken';  // Pour la création du JWT
import bcrypt from 'bcrypt';  // Pour le hachage de mot de passe
import User from '../models/userModel.js';  // Le modèle utilisateur pour interagir avec MongoDB
import Invitation from '../models/invitationModel.js';  // Le modèle invitation pour interagir avec MongoDB
import nodemailer from 'nodemailer';  // Pour l'envoi d'email
import transporter from '../config/emailTransporter.js';


// ======================================================
//                Contrôleur d'Inscription
// ======================================================
export const registerUser = async (req, res) => {
    try {
        // Récupération des données envoyées dans le corps de la requête
        const { nomPrenom, site, matricule, email, password } = req.body;

        // Vérification si l'email est déjà utilisé
        const findUser = await User.findOne({ email });
        if (findUser) {
            return res.status(400).send({ message: 'Cet email est déjà utilisé !' });
        }

        // Vérification si le matricule est déjà utilisé
        const findMatricule = await User.findOne({ matricule });
        if (findMatricule) {
            return res.status(400).send({ message: 'Ce matricule est déjà utilisé !' });
        }

        // Hachage du mot de passe avant de le stocker dans la base de données
        const hashedPassword = await bcrypt.hash(password, 10);

        // Détermination du rôle de l'utilisateur :
        // Si c'est le premier utilisateur créé, il devient 'admin', sinon 'technicien'
        const userCount = await User.countDocuments();
        const role = userCount === 0 ? 'admin' : 'technicien';

        // Création d'un nouvel utilisateur avec les informations fournies
        const newUser = new User({
            nomPrenom,
            site,
            matricule,
            email,
            password: hashedPassword, // On stocke le mot de passe haché pour plus de sécurité
            role,
        });

        // Sauvegarde du nouvel utilisateur dans la base de données
        await newUser.save();

        // Si l'utilisateur est un technicien, créez une invitation pour l'administrateur
        if (role === 'technicien') {
            // Créez une nouvelle invitation
            const invitation = new Invitation({
                userId: newUser._id, // Référence à l'utilisateur créé
                status: 'pending', // Statut initial : en attente
                
            });

            await invitation.save();

            // Envoyez un email à l'administrateur
            const mailOptions = {
                from: process.env.EMAIL_USER, // Adresse email de l'expéditeur
                to: 'eyaaaboughzelaa27@gmail.com', // Remplacez par l'email de l'admin
                subject: 'Nouvelle demande d\'inscription',
                text: `Un nouvel utilisateur souhaite s'inscrire :\n\nNom: ${nomPrenom}\nEmail: ${email}`,
            };

            await transporter.sendMail(mailOptions);
            console.log('📧 Invitation envoyée à l\'administrateur.');
        }

        console.log("✅ Utilisateur créé avec succès !");
        res.status(201).send({ message: "Utilisateur créé avec succès !" });
    } catch (err) {
        // En cas d'erreur, renvoyer une réponse avec le message de l'erreur
        console.error(err);
        res.status(500).send({ message: err.message });
    }
};

// ======================================================
//                Contrôleur de Connexion
// ======================================================
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérification si l'utilisateur existe dans la base de données
        const findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(400).send({ message: 'Email ou mot de passe incorrect !' });
        }

        // Comparaison du mot de passe fourni avec celui dans la base de données
        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
            return res.status(400).send({ message: 'Email ou mot de passe incorrect !' });
        }

        // Génération du JWT après validation de la connexion
        const token = jwt.sign(
            { id: findUser._id, role: findUser.role },  // Payload (id et role)
            process.env.JWT_SECRET, // Clé secrète pour signer le token
            { expiresIn: '1h' }  // Durée de validité du token (1 heure ici)
        );
        
        console.log("✅ Connexion réussie !");

        // Renvoi du token au client
        res.status(200).send({ message: "Connexion réussie !", token });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};




