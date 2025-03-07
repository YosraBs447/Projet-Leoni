import express from 'express';
import { getAllUsers, updateUser, deleteUser } from '../controllers/gestionTechController.js'; // Import des contrôleurs
import { verifyToken, checkAdmin } from '../middleware/auth.js'; // Import des middlewares
import { getPendingInvitations } from '../controllers/gestionTechController.js';

const router = express.Router();

// Récupérer tous les utilisateurs (admin seulement)
router.get('/users', verifyToken, checkAdmin, getAllUsers);

// Modifier un utilisateur (admin seulement)
router.put('/users/:id', verifyToken, checkAdmin, updateUser); // Correction : ajout du '/' avant ':id'

// Supprimer un utilisateur (admin seulement)
router.delete('/users/:id', verifyToken, checkAdmin, deleteUser); // Correction : ajout du '/' avant ':id'

// Exemple : route protégée par middleware admin
router.get('/isAdmin', checkAdmin, (req, res) => {
    res.send('Page réservée aux administrateurs');
});

// Route pour récupérer les invitations en attente
router.get('/invitations', verifyToken, checkAdmin, getPendingInvitations);

export default router;