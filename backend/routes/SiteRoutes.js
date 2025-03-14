const express = require("express");
const router = express.Router();
const Site = require("../models/Site");

// Ajouter un site
router.post("/add", async (req, res) => {
  const { name, location } = req.body; // Informations sur le site

  try {
    const newSite = new Site({ name, location });
    await newSite.save();
    res.status(201).json(newSite);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout du site" });
  }
});

// Récupérer tous les sites
router.get("/", async (req, res) => {
  try {
    const sites = await Site.find();
    res.json(sites);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des sites" });
  }
});

module.exports = router;
