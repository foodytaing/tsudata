const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  labelId: {
    type: String,
  },
  rank: {
    type: String,
  },
  name: {
    type: String,
  },
  desc: {
    type: String,
  },
  effect: {
    type: { Object },
  },
});

const SkillModel = mongoose.model("skill", SkillSchema);

module.exports = SkillModel;
