import express from 'express';
import { verifyToken, checkAdmin } from '../middleware/auth.js'; // Import des middlewares
import { registerUser, loginUser } from '../controllers/userController.js';
const router = express.Router();

// Routes pour l'enregistrement et la connexion
router.post('/register', registerUser);
router.post('/login', loginUser);

// Route protégée /private
router.get('/private', verifyToken, (req, res) => {
    res.json({ message: 'Bienvenue dans la zone privée, vous êtes authentifié!' });
  });

// Routes protégées : ces routes nécessitent que l'utilisateur soit authentifié (JWT) et admin (checkAdmin)





export default router;
