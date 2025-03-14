import mongoose from 'mongoose';

// Définition du schéma pour l'invitation
const invitationSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Référence à l'utilisateur auquel l'invitation appartient
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected'], 
        default: 'pending' // Statut de l'invitation (par défaut "pending")
    },
    rejectionReason: {
        type: String,
        default: null // Garde la valeur par défaut, mais supprime la validation
    },
    invitationDate: { 
        type: Date, 
        default: Date.now // Date de l'invitation
    },
    message: {
        type: String, 
        default: '' // Message ou note pour l'invitation
    }
}, {
    timestamps: true // Ajoute les champs createdAt et updatedAt automatiquement
});

// Exportation du modèle Invitation basé sur le schéma
const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;
