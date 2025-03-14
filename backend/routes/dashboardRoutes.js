const express = require("express");
const router = express.Router();
const Checklist = require("../models/Checklist"); // Exemple d'import de modèle MongoDB

// Route pour récupérer les données du tableau de bord
router.get("/dashboard", async (req, res) => {
  try {
    const totalChecklists = await Checklist.countDocuments();
    const totalAnomalies = await Checklist.countDocuments({
      status: "Anomalie",
    });
    const totalValidated = await Checklist.countDocuments({
      status: "Validée",
    });

    res.json({
      totalChecklists,
      totalAnomalies,
      totalValidated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
