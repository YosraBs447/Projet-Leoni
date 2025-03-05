import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    nomPrenom: {
        type: String,
        required: true
    },
    site: {
        type: String,
        required: true
    },
    matricule: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'technicien'],
        default: 'technicien'
    },
    verificationCode: {
        type: String,
        required: false
    },
    codeExpiration: { type: Date },      // Date d'expiration du code de vérification

    
}, {
    timestamps: true//Ajoute automatiquement les champs createdAt et updatedAt à la base de données
});

// Méthode pour comparer le code entré avec le hash stocké
userSchema.methods.compareVerificationCode = async function (code) {
    return await bcrypt.compare(code, this.verificationCode);
}; 

const User = mongoose.model('User', userSchema);

export default User;
