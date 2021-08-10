const TechniqueModel = require("../models/technique.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.createTechnique = async(req, res) => {
    console.log(req.body);

    const newTechnique = new TechniqueModel({
        ...req.body,
    });

    try {
        const technique = await newTechnique.save();
        return res.status(201).json(technique);
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.getAllTechniques = async(req, res) => {
    const techniques = await TechniqueModel.find(req.query).select();
    res.status(200).json(techniques);
};

module.exports.getTechnique = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    TechniqueModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log("ID unknown : " + req.params.id);
    }).select();
};

module.exports.updateTechnique = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        await TechniqueModel.findOneAndUpdate({ _id: req.params.id }, {
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

module.exports.deleteTechnique = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        await TechniqueModel.remove({ _id: req.params.id }).exec();
        res
            .status(200)
            .json({ message: req.params.id + "was successfully deleted." });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

module.exports.getSearchTechniques = async(req, res) => {
    console.log({[req.query.key]: new RegExp(req.query.val, 'i'), type_skill: req.query.type})

    const techniques = await TechniqueModel.find({[req.query.key]: new RegExp(req.query.val, 'i'), type_skill: req.query.type})
        .select(["-effect_value", "-effect_type"]);
    res.status(200).json(techniques);
};