import express from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import passwordRoutes from './routes/passwordRoutes.js';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import invitationRoutes from './routes/invitationRoutes.js'; // Importation de la route principale
import User from './models/userModel.js';

// 📌 1. CHARGEMENT DES VARIABLES D’ENVIRONNEMENT
dotenv.config({ path: './.env' });

// Vérification des variables obligatoires
const requiredEnvVars = ['JWT_SECRET', 'PORT', 'MONGO_URI', 'AUDIENCE', 'ISSUER'];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`❌ Erreur: La variable d'environnement ${envVar} est manquante`);
        process.exit(1);
    }
});

// 📌 2. CONNEXION À LA BASE DE DONNÉES
connectDB();

// 📌 3. CRÉATION DU SERVEUR
const app = express();

// ✅ Middleware CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// ✅ Sécurisation avec Helmet
app.use(helmet());

// ✅ Parsing JSON
app.use(express.json());
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// ✅ Logger Morgan en mode développement
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Middleware pour désactiver la mise en cache sur toutes les routes
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// 📌 4. ROUTES PUBLIQUES
app.get('/generate-token', (req, res) => {
    const user = { _id: '12345', username: 'admin', role: 'admin' };
    const token = jwt.sign({ 
        userId: user._id, 
        role: user.role 
    }, process.env.JWT_SECRET, { 
        expiresIn: '1h',
        issuer: process.env.ISSUER,
        audience: process.env.AUDIENCE
    });
    res.json({ token });
});

// 📌 5. ROUTES API
app.use('/api/users', userRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/invitations', invitationRoutes);



// Middleware d'authentification JWT
const checkJwt = auth({
    audience: process.env.AUDIENCE,
    issuer: process.env.ISSUER,
    algorithms: ['HS256'],
    secret: process.env.JWT_SECRET,
    tokenSigningAlg: 'HS256',
});

// Route protégée exemple
app.get('/api/admin', checkJwt, (req, res) => {
    res.json({ 
        message: 'Bienvenue dans la zone admin!',
        user: req.auth
    });
});

// 📌 6. GESTION DES ERREURS
app.use((req, res, next) => {
    res.status(404).json({ error: "Ressource non trouvée" });
});

app.use((err, req, res, next) => {
    console.error('❌ Erreur serveur:', err.stack);
    res.status(500).json({ error: "Erreur interne du serveur" });
});

// 📌 7. DÉMARRAGE DU SERVEUR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`🌍 Environnement: ${process.env.NODE_ENV}`);
});
