// invitationRoutes.js
import express from 'express';
import { getPendingInvitations, acceptOrRejectInvitation } from '../controllers/gestionTechController.js';
import { verifyToken, checkAdmin } from '../middleware/auth.js';
import Invitation from '../models/invitationModel.js';

const router = express.Router();

// Routes d'invitation
router.get('/', verifyToken, checkAdmin, getPendingInvitations);

// Utilisation de PATCH au lieu de PUT
router.patch('/:id/status', verifyToken, checkAdmin, acceptOrRejectInvitation);



// OU si tu veux garder PUT, tu peux également ajouter PATCH :
// router.put('/:id', verifyToken, checkAdmin, acceptOrRejectInvitation);

export default router;