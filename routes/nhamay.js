const express = require("express");
const router = express.Router();

const view = require("../controllers/plant/plantViewController");
const stats = require("../controllers/plant/plantStatsController");
const log = require("../controllers/plant/plantLogController");

router.get("/", view.pageList);
router.get("/them", view.pageAdd);
router.get("/sua/:id", view.pageEdit);

router.get("/thongke", stats.pageStats);
router.get("/lichsu", log.pageList);

module.exports = router;
