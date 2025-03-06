// Importation des modules nécessaires
import jwt from 'jsonwebtoken';  // Pour la création du JWT
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
