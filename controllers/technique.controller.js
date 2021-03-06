const TechniqueModel = require("../models/technique.model");
const ObjectID = require("mongoose").Types.ObjectId;

/*
  {
    "rank" : "",
    "type" : "",
    "name" : "",
    "stamina" : ,
    "intensity" : ,
  }
*/

module.exports.createTechnique = async (req, res) => {
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

module.exports.updateTechnique = async (req, res) => {
  // check if id user exist
  console.log(req.body);

  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  try {
    await TechniqueModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        if (err) return res.status(500).send({ message: err });
      }
    );
  } catch {
    return res.status(500).json({ message: err });
  }
};

module.exports.deleteTechnique = async (req, res) => {
  // check if id user exist
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  try {
    await TechniqueModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted." });
  } catch {
    return res.status(500).json({ message: err });
  }
};

module.exports.getTechnique = async (req, res) => {
  // check if id user exist
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  TechniqueModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknown : " + err);
  });
};

module.exports.getAllTechniques = async (req, res) => {
  const techniques = await TechniqueModel.find(req.query);

  res.status(201).json(techniques);
};
