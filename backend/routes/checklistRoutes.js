const express = require("express");
const router = express.Router();
const Checklist = require("../models/Checklist"); // Import du modèle Checklist
const User = require("../models/User"); // Si tu veux vérifier si l'admin existe (optionnel)

// Route pour créer une checklist (admin)
router.post("/create-checklist", async (req, res) => {
  try {
    const { title, tasks, assigned_to, createdBy } = req.body;

    // Vérification que l'admin existe (optionnel)
    const admin = await User.findById(createdBy);
    if (!admin) {
      return res.status(400).json({ message: "Administrateur introuvable" });
    }

    // Créer une nouvelle checklist
    const newChecklist = new Checklist({
      title,
      tasks,
      assigned_to,
      createdBy, // ID de l'administrateur
    });

    // Sauvegarder la checklist dans la base de données
    await newChecklist.save();

    // Réponse en cas de succès
    res.status(201).json({
      message: "Checklist créée avec succès",
      checklist: newChecklist,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la checklist" });
  }
});

module.exports = router;
