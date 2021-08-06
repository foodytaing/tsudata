const router = require("express").Router();
const techniqueController = require("../controllers/technique.controller");

// player
router.post("/", techniqueController.createTechnique);
router.get("/", techniqueController.getAllTechniques);
router.get("/:id", techniqueController.getTechnique);
router.put("/:id", techniqueController.updateTechnique);
router.delete("/:id", techniqueController.deleteTechnique);

module.exports = router;