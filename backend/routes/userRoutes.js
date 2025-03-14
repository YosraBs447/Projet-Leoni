// userRoutes.js
import express from 'express';
import { 
    registerUser, 
    loginUser}from '../controllers/userController.js';
import { verifyToken, checkAdmin } from '../middleware/auth.js';
import { getAllUsers, deleteUser } from '../controllers/gestionTechController.js';

const router = express.Router();

// Routes publiques
router.post('/register', registerUser);
router.post('/login', loginUser);

// Routes protégées admin
router.get('/', verifyToken, checkAdmin, getAllUsers); // GET /api/users
router.delete('/:id', verifyToken, checkAdmin, deleteUser); // DELETE /api/users/:id
//router.get('/invitations', verifyToken, checkAdmin, getPendingInvitations); // GET /api/users/invitations
//router.put('/invitations/:id', verifyToken, checkAdmin, acceptOrRejectInvitation); // PUT /api/users/invitations/:id

export default router;