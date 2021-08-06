const mongoose = require("mongoose");

const techniqueSchema = new mongoose.Schema({
    rank: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type_technique: {
        type: String,
        required: true,
        lowercase: true,
    },
    stamina: {
        type: Number,
        required: true,
    },
    intensity: {
        type: String,
        required: true,
        lowercase: true,
    },
    combination: {
        type: [String],
    },
    blow_off: {
        type: Number,
    },
    distance_decay: {
        type: Boolean,
    },
    angle_decay: {
        type: Boolean,
    },
}, {
    timestamps: true,
});

// mongoDB always put s on table name
const TechniqueModel = mongoose.model("technique", techniqueSchema);

module.exports = TechniqueModel;