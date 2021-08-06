const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
    rank: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    name_helper: {
        type: String,
    },
    description: {
        type: String,
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