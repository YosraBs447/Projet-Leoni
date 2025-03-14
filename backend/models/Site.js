const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema({
  name: String,
  location: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Site", siteSchema);
