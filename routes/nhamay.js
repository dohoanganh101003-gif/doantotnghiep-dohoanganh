const express = require("express");
const router = express.Router();

const view = require("../controllers/plant/plantViewController");
const stats = require("../controllers/plant/plantStatsController");

// ===== VIEW =====
router.get("/", view.pageList);
router.get("/them", view.pageAdd);
router.get("/sua/:id", view.pageEdit);

// ===== STATS PAGE =====
router.get("/thongke", stats.pageStats);

module.exports = router;
