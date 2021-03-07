const SkillModel = require("../models/skill.model");
const ObjectID = require("mongoose").Types.ObjectId;

/*
  {
    "labelId" : "",
    "rank" : "",
    "name" : "",
    "desc" : ,
    "effect" : { "value" : , "stats": [] },
  }
*/

module.exports.createSkill = async (req, res) => {
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

module.exports.updateSkill = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  try {
    await SkillModel.findOneAndUpdate(
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

module.exports.deleteSkill = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  try {
    await SkillModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted." });
  } catch {
    return res.status(500).json({ message: err });
  }
};

module.exports.getSkill = async (req, res) => {
  // check if id user exist
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  SkillModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknown : " + err);
  });
};

module.exports.getAllSkills = async (req, res) => {
  const skills = await SkillModel.find(req.query);

  res.status(201).json(skills);
};
