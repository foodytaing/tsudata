const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    klab_id: {
        type: Number,
        required: true,
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
        required: true,
        lowercase: true,
        trim: true,
    },
    rarity: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    collection_card: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    first_name: {
        type: String,
        required: true,
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
        required: true,
        lowercase: true,
        trim: true,
    },
    country: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    team: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    series: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    positions: {
        type: [String],
        required: true,
    },
    stats: {
        type: Object,
        required: true,
    },
    techniques: {
        type: [String],
        required: true,
    },
    leader_skill: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    passive_skill: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    hidden_abilities: {
        type: [String],
        required: true,
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