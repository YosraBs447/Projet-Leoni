// Importation des modules nécessaires
import bcrypt from 'bcrypt';  // Pour le hachage de mot de passe
import User from '../models/userModel.js';  // Le modèle utilisateur pour interagir avec MongoDB

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
            role 
        });

        // Sauvegarde du nouvel utilisateur dans la base de données
        await newUser.save();

        console.log("✅ Utilisateur créé avec succès !");
        res.status(201).send({ message: "Utilisateur créé avec succès !" });
    } catch (err) {
        // En cas d'erreur, renvoyer une réponse avec le message de l'erreur
        res.status(500).send({ message: err.message });
    }
};

// ======================================================
//                Contrôleur de Connexion
// ======================================================
export const loginUser = async (req, res) => {
    try {
        // Récupération des données envoyées dans le corps de la requête
        const { email, password } = req.body;

        // Vérification de l'existence de l'utilisateur avec cet email
        const findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(400).send({ message: 'Email ou mot de passe incorrect !' });
        }

        // Comparaison du mot de passe fourni avec le mot de passe haché stocké
        const isMatch = await bcrypt.compare(password, findUser.password);
        if (isMatch) {
            // Si les mots de passe correspondent, connexion réussie
            console.log("✅ Connexion réussie !");
            res.sendStatus(200);
        } else {
            // Si les mots de passe ne correspondent pas, renvoyer un message d'erreur
            res.status(400).send({ message: 'Email ou mot de passe incorrect !' });
        }
    } catch (err) {
        // En cas d'erreur, renvoyer une réponse avec le message de l'erreur
        res.status(500).send({ message: err.message });
    }
};
