const SkillModel = require("../models/skill.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.createSkill = async(req, res) => {
    const newSkill = new SkillModel({
        ...req.body,
    });

    try {
        const skill = await newSkill.save();
        return res.status(201).json(skill);
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.getAllSkills = async(req, res) => {
    const skills = await SkillModel.find(req.query).select();
    res.status(200).json(skills);
};

module.exports.getSkill = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    SkillModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log("ID unknown : " + req.params.id);
    }).select();
};

module.exports.updateSkill = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        await SkillModel.findOneAndUpdate({ _id: req.params.id }, {
                $set: {
                    ...req.body,
                },
            }, { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                if (err) return res.status(500).send({ message: err });
            }
        );
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

module.exports.deleteSkill = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        await SkillModel.remove({ _id: req.params.id }).exec();
        res
            .status(200)
            .json({ message: req.params.id + "was successfully deleted." });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};