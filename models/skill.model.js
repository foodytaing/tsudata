const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
    rank: {
        type: String,
        lowercase: true,
    },
    name: {
        type: String,
        required: true,
        lowercase: true,
    },
    description: {
        type: String,
        lowercase: true,
    },
    type_skill: {
        type: String,
        lowercase: true,
    },
    effect_value: {
        type: Number,
    },
    effect_type: {
        type: String,
        lowercase: true,
    },
    assignment_stats: {
        type: [String],
    },
}, {
    timestamps: true,
});

// mongoDB always put s on table name
const SkillModel = mongoose.model("skill", skillSchema);

module.exports = SkillModel;