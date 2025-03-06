import express from 'express';
import { registerUser, loginUser, getAllUsers, updateUser, deleteUser } from '../controllers/userController.js';
import { verifyToken, checkAdmin } from '../middleware/auth.js'; // Import des middlewares

const router = express.Router();

// Routes pour l'enregistrement et la connexion
router.post('/register', registerUser);
router.post('/login', loginUser);

// Route protégée /private
router.get('/private', verifyToken, (req, res) => {
    res.json({ message: 'Bienvenue dans la zone privée, vous êtes authentifié!' });
  });

// Routes protégées : ces routes nécessitent que l'utilisateur soit authentifié (JWT) et admin (checkAdmin)

// Récupérer tous les utilisateurs (admin seulement)
router.get('/', verifyToken, checkAdmin, getAllUsers);

// Modifier un utilisateur (admin seulement)
router.put('/:id', verifyToken, checkAdmin, updateUser);

// Supprimer un utilisateur (admin seulement)
router.delete('/:id', verifyToken, checkAdmin, deleteUser);

export default router;
