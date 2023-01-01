const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

const playerSchema = new mongoose.Schema({
    image_url: {
        type: Object,
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
        lowercase: true,
        trim: true,
    },
    collection_card: {
        type: String,
    },
    position_in_collection: {
        type: Number,
    },
    rating: {
        type: Number,
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
        lowercase: true,
        trim: true,
    },
    series: {
        type: String,
        trim: true,
    },
    positions: {
        type: [String],
        lowercase: true,
    },
    stats: {
        type: Object,
    },
    techniques: {
        type: [{ type: ObjectId, ref: 'technique' }],
    },
    leader_skill: {
        type: [{ type: ObjectId, ref: 'skill' }],
        trim: true,
    },
    passive_skill: {
        type: [{ type: ObjectId, ref: 'skill' }],
        trim: true,
    },
    hidden_abilities: {
        type: [{ type: ObjectId, ref: 'skill' }],
    },
    chest: {
        type: String,
    },
}, {
    timestamps: true,
});

// mongoDB always put s on table name
const PlayerModel = mongoose.model("player", playerSchema);

module.exports = PlayerModel;