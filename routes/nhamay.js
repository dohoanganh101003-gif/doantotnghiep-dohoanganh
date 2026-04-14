const express = require("express");
const router = express.Router();
const PlantController = require("../controllers/plantController");

router.get("/", PlantController.pageList);
router.get("/them", PlantController.pageAdd);
router.get("/sua/:id", PlantController.pageEdit);

module.exports = router;
