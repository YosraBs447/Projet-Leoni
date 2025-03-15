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
            // Envoyez un email à l'administrateur
           // Envoyez un email à l'administrateur
           // Envoyez un email à l'administrateur
            const mailOptions = {
                from: process.env.EMAIL_USER, // Adresse email de l'expéditeur
                to: 'eyaaaboughzelaa27@gmail.com', // Remplacez par l'email de l'admin
                subject: 'Nouvelle demande d\'inscription',
                html: `
                    <!DOCTYPE html>
                    <html lang="fr">
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
                            .email-container {
                                max-width: 600px;
                                margin: 20px auto;
                                background-color: #ffffff;
                                border-radius: 30px; /* Coins très arrondis */
                                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); /* Ombre plus prononcée */
                                overflow: hidden;
                                padding: 25px;
                            }
                            .header {
                                background: linear-gradient(135deg, #6a11cb, #2575fc); /* Nouveau dégradé violet-bleu */
                                color: #ffffff;
                                text-align: center;
                                padding: 20px 0;
                                font-size: 24px;
                                font-weight: bold;
                                letter-spacing: 1px;
                                border-bottom: 2px solid #4e0cc4; /* Bordure fine en violet foncé */
                            }
                            .content {
                                padding: 20px;
                                font-size: 16px;
                                line-height: 1.6;
                                color: #333;
                            }
                            .content ul {
                                list-style: none;
                                padding: 0;
                            }
                            .content ul li {
                                margin-bottom: 10px;
                                font-weight: 500;
                            }
                            .footer {
                                text-align: center;
                                font-size: 14px;
                                color: #777;
                                padding: 15px;
                                border-top: 1px solid #ddd;
                            }
                            .button {
                                display: inline-block;
                                background: linear-gradient(135deg, #6a11cb, #2575fc); /* Dégradé violet-bleu */
                                color: #ffffff !important; /* Texte en blanc */
                                text-decoration: none;
                                padding: 10px 20px;
                                border-radius: 30px; /* Coins très arrondis pour le bouton */
                                font-size: 16px;
                                font-weight: bold;
                                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                                transition: all 0.3s ease;
                                text-transform: uppercase;
                                margin-top: 20px;
                            }
                            .button:hover {
                                background: linear-gradient(135deg, #2575fc, #6a11cb); /* Inversion du dégradé au survol */
                                box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="header">
                                Nouvelle Demande d'Inscription
                            </div>
                            <div class="content">
                                <p>Bonjour,</p>
                                <p>Un nouvel utilisateur souhaite s'inscrire sur la plateforme :</p>
                                <ul>
                                    <li><strong>NomPrenom : </strong> ${nomPrenom}</li>
                                    <li><strong>Email : </strong> ${email}</li>
                                    <li><strong>Site : </strong> ${site}</li>
                                    <li><strong>Matricule : </strong> ${matricule}</li>
                                </ul>
                                <p>Veuillez examiner cette demande dans votre tableau de bord administrateur.</p>
                                <a href="http://localhost:5173/" class="button">Voir la demande</a>
                            </div>
                            <div class="footer">
                                Ce message a été envoyé automatiquement. Veuillez ne pas répondre directement.
                            </div>
                        </div>
                    </body>
                    </html>
                `,
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




