const PlayerModel = require("../models/player.model");
const ObjectID = require("mongoose").Types.ObjectId;

/*
  {
    "klabId" : "",
    "rarity" : "ur",
    "gachaCollection" : "",
    "type" : "",
    "firstName" : "",
    "lastName" : "",
    "subName" : "",
    "country" : "",
    "team" : "",
    "series" : "",
    "position" : [],
    "collection" : "",
    "stats" : {
      "stamina" : ,
      "dribble" : , "shot" : , "pass" : ,
      "tackle" : , "" : , "intercept" : ,
      "speed" : , "power" : , "technique" : ,
      "highBall" : 1,
      "lowBall" : 1
    },
    "leaderSkill" : ,
    "passiveSkill" : ,
    "hiddenAbilities" : [],
    "techniques" : []
  }
*/

module.exports.createPlayer = async (req, res) => {
  const newPlayer = new PlayerModel({
    ...req.body,
  });

  try {
    const player = await newPlayer.save();

    return res.status(201).json(player);
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.updatePlayer = async (req, res) => {
  // check if id user exist
  console.log(req.body);

  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  try {
    await PlayerModel.findOneAndUpdate(
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

module.exports.deletePlayer = async (req, res) => {
  // check if id user exist
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  try {
    await PlayerModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted." });
  } catch {
    return res.status(500).json({ message: err });
  }
};

module.exports.getPlayer = async (req, res) => {
  // check if id user exist
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  PlayerModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknown : " + err);
  });
};

module.exports.getAllPlayers = async (req, res) => {
  const players = await PlayerModel.find();

  const allPlayer = players.map((player) => {
    return {
      _id: player._id,
      type: player.type,
      picture: player.picture,
      firstName: player.firstName,
      lastName: player.lastName,
    };
  });
  res.status(201).json(allPlayer);
};
