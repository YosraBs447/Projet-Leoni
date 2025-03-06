// middleware/auth.js
import jwt from 'jsonwebtoken'; // Importer le module jsonwebtoken
import User from '../models/userModel.js'; // Importer le modèle utilisateur

// Vérification du token JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization'); // On récupère le token du header
  if (!token) return res.status(401).json({ message: "Accès refusé, token manquant" });

  try {
    // On décode le token et on ajoute l'utilisateur à la requête
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Le secret pour vérifier le JWT
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Token invalide" });
  }
};

// Vérification si l'utilisateur est un admin
const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id); // L'ID de l'utilisateur vient du token
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
