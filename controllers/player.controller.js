const PlayerModel = require("../models/player.model");
const ObjectID = require("mongoose").Types.ObjectId;

function tri(a, b) {
    if (a.collection_card.toLowerCase() < b.collection_card.toLowerCase()) return -1;
    if (a.collection_card.toLowerCase() > b.collection_card.toLowerCase()) return 1;
    if (a.collection_card.toLowerCase() === b.collection_card.toLowerCase()) {
        if (a.position_in_collection > b.position_in_collection) return -1;
        if (a.position_in_collection < b.position_in_collection) return 1;
        if (a.position_in_collection === b.position_in_collection) return 0;
    }
}

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

module.exports.getAllPlayers = async (req, res) => {
    if (req.query.last_name || req.query.first_name) {
        const players = await PlayerModel.find(req.query)
            .select(["-leader_skill", "-passive_skill", "-hidden_abilities", "-stats", "-positions", "-rarity", "-position_in_collection"]);
        res.status(200).json(players);
    } else {
        const players = await PlayerModel.find(req.query)
            .select(["-leader_skill", "-passive_skill", "-hidden_abilities", "-stats", "-techniques"]);
        res.status(200).json(players.sort(tri));
    }
};

module.exports.getPlayer = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    PlayerModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log("ID unknown : " + req.params.id);
    }).select();
};

module.exports.updatePlayer = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        await PlayerModel.findOneAndUpdate({ _id: req.params.id }, {
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

module.exports.deletePlayer = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        await PlayerModel.remove({ _id: req.params.id }).exec();
        res
            .status(200)
            .json({ message: req.params.id + "was successfully deleted." });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};