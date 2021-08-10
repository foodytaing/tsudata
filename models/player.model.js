const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    klab_id: {
        type: Number,
        unique: true,
        minlength: 6,
        maxlength: 6,
        trimp: true,
    },
    image_url: {
        type: String,
        lowercase: true,
        trim: true,
    },
    color: {
        type: String,
        lowercase: true,
        trim: true,
    },
    rarity: {
        type: String,
        trim: true,
    },
    collection_card: {
        type: String,
    },
    first_name: {
        type: String,
        lowercase: true,
        trim: true,
    },
    last_name: {
        type: String,
        lowercase: true,
        trim: true,
    },
    sub_name: {
        type: String,
        lowercase: true,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },
    team: {
        type: String,
        trim: true,
    },
    series: {
        type: String,
        trim: true,
    },
    positions: {
        type: [String],
    },
    stats: {
        type: Object,
    },
    techniques: {
        type: [String],
    },
    leader_skill: {
        type: [String],
        trim: true,
    },
    passive_skill: {
        type: [String],
        trim: true,
    },
    hidden_abilities: {
        type: [String],
    },
    chest: {
        type: Boolean,
    },
}, {
    timestamps: true,
});

// mongoDB always put s on table name
const PlayerModel = mongoose.model("player", playerSchema);

module.exports = PlayerModel;