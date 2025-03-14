import jwt from 'jsonwebtoken'; // Importer le module jsonwebtoken
import User from '../models/userModel.js'; // Importer le modèle utilisateur

// Vérification du token JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;  // 'verified' contient le payload du token (ex: { id, role, etc. })
    
    // Vérifiez si 'id' est présent dans le token
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "ID de l'utilisateur manquant dans le token" });
    }

    next();
  } catch (err) {
    return res.status(400).json({ message: "Token invalide ou expiré", error: err.message });
  }
};

// Vérification si l'utilisateur est un admin
const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id); // Utilisez req.user.id ici

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Accès refusé, vous devez être admin" });
    }

    next(); // L'utilisateur est admin, donc on passe à la suite
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de la vérification du rôle" });
  }
};


// Utilisation de export pour les middlewares
export { verifyToken, checkAdmin };
