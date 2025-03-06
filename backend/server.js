// server.js
import express from 'express';
import { auth } from 'express-oauth2-jwt-bearer';  // Importation du middleware
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import passwordRoutes from './routes/passwordRoutes.js';
import { sendInvitationToAdmin } from './controllers/gestionTechController.js'; // Importer la fonction d'envoi d'email
import { sendEmailToTechnician } from './controllers/gestionTechController.js'; // Import de la fonction d'envoi d'email


dotenv.config({ path: './.env' }); // Forcer le chemin de .env // Charger les variables d'environnement

connectDB(); // Connexion à la base de données

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(helmet());
app.use(express.json());

app.use('/api/users', userRoutes); // Utiliser les routes utilisateur
// Routes
app.use('/api/password', passwordRoutes);// Utiliser les routes de réinitialisation du mot de passe

console.log("📩 EMAIL_USER :", process.env.EMAIL_USER);
console.log("🔑 EMAIL_PASS :", process.env.EMAIL_PASS ? "OK" : "NON DÉFINI");

// Middleware pour vérifier le JWT
const checkJwt = auth({
    audience: 'https://dev-l6ahn3xj3jdh0ku4.us.auth0.com/api/v2/',   // Remplace par ton API Identifier
    issuerBaseURL: 'https://dev-l6ahn3xj3jdh0ku4.us.auth0.com/',  // Remplace par ton domaine Auth0
  });

  // Exemple d'une route protégée par rôle (admin)
  app.get('/api/admin', checkJwt, (req, res) => { // Route protégée
    res.json({ message: 'Bienvenue dans la zone admin!' });
  });
  
  app.get('/api/private', checkJwt, (req, res) => { // Route protégée
    res.json({ message: 'Bienvenue dans la zone protégée!' });
  });


// Route pour l'inscription du technicien
app.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Créer un utilisateur avec le statut 'en attente'
        const user = new User({
            email,
            username,
            password,
            role: 'technicien',
            status: 'en attente',
        });

        await user.save();

        // Envoie d'un email à l'admin pour l'inviter à valider le technicien
        sendInvitationToAdmin(user); // Une fonction qui envoie un email à l'administrateur

        res.status(201).send({ message: 'Technicien inscrit avec succès. En attente de validation.' });
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de l\'inscription.' });
    }
});



app.get('/accept-invitation', async (req, res) => {
    const { userId, action } = req.query;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send('Utilisateur non trouvé.');
    }

    if (action === 'accept') {
        await User.findByIdAndUpdate(userId, { status: 'validé' });
        
        // Envoyer un email au technicien pour l'informer que son compte est validé
        await sendEmailToTechnician(user.email, 'Votre compte a été validé', 'Votre inscription a été validée par l\'administrateur. Vous pouvez maintenant vous connecter.');

        res.send('Invitation acceptée, le technicien peut maintenant accéder à l\'interface.');
    } else if (action === 'reject') {
        await User.findByIdAndUpdate(userId, { status: 'refusé' });
        
        // Envoyer un email au technicien pour l'informer que son compte a été refusé
        await sendEmailToTechnician(user.email, 'Votre compte a été refusé', 'Votre inscription a été refusée par l\'administrateur.');

        res.send('Invitation refusée.');
    } else {
        res.status(400).send('Action invalide.');
    }
});
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
