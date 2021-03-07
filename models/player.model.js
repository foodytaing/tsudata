const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema(
  {
    klabId: {
      type: String,
    },
    rarity: {
      type: String,
    },
    gachaCollection: {
      type: String,
    },
    picture: {
      type: String,
      default: "random-player.png",
    },
    type: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    subName: {
      type: String,
    },
    country: {
      type: String,
    },
    team: {
      type: String,
    },
    series: {
      type: String,
    },
    position: {
      type: [String],
    },
    stats: {
      type: { Object },
    },
    techniques: {
      type: [String],
    },
    leaderSkill: {
      type: String,
    },
    passiveSkill: {
      type: String,
    },
    hiddenAbilities: {
      type: [String],
    },
    date: {},
  },
  {
    timestamps: true,
  }
);

const PlayerModel = mongoose.model("player", PlayerSchema);

module.exports = PlayerModel;
