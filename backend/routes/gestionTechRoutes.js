import express from 'express';
import { registerUser, loginUser, getAllUsers, updateUser, deleteUser } from '../controllers/userController.js';
import { verifyToken, checkAdmin } from '../middleware/auth.js'; // Import des middlewares


// Récupérer tous les utilisateurs (admin seulement)
router.get('/', verifyToken, checkAdmin, getAllUsers);

// Modifier un utilisateur (admin seulement)
router.put('/:id', verifyToken, checkAdmin, updateUser);

// Supprimer un utilisateur (admin seulement)
router.delete('/:id', verifyToken, checkAdmin, deleteUser);

// ✅ Ajouter la route pour accepter ou refuser l'invitation
router.get('/accept-invitation', verifyToken, checkAdmin, acceptOrRejectInvitation);


// Cette route sera protégée par le middleware checkAdmin
router.get('/admin', checkAdmin, (req, res) => {
    res.send('Page réservée aux administrateurs');
});


export default router;