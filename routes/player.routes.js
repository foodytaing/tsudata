const router = require("express").Router();
const playerController = require("../controllers/player.controller");

router.get("", playerController.getAllPlayers);
router.get("/:id", playerController.getPlayer);
router.post("/", playerController.createPlayer);
router.put("/:id", playerController.updatePlayer);
router.delete("/:id", playerController.deletePlayer);

module.exports = router;
