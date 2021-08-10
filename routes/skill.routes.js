const router = require("express").Router();
const skillController = require("../controllers/skill.controller");

// player
router.post("/", skillController.createSkill);
router.get("/", skillController.getAllSkills);
router.get("/search", skillController.getSearchSkills);
router.get("/:id", skillController.getSkill);
router.put("/:id", skillController.updateSkill);
router.delete("/:id", skillController.deleteSkill);

module.exports = router;