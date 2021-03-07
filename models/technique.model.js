const mongoose = require("mongoose");

const TechniqueSchema = new mongoose.Schema({
  rank: {
    type: String,
  },
  type: {
    type: String,
  },
  name: {
    type: String,
  },
  stamina: {
    type: Number,
  },
  intensity: {
    type: Number,
  },
});

const TechniqueModel = mongoose.model("technique", TechniqueSchema);

module.exports = TechniqueModel;
