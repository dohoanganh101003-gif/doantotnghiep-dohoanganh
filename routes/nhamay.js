const express = require("express");
const router = express.Router();

const view = require("../controllers/plant/plantViewController");
const stats = require("../controllers/plant/plantStatsController");
const log = require("../controllers/plant/plantLogController");

router.get("/", view.pageList); // trang danh sách nhà máy
router.get("/them", view.pageAdd); // trang thêm nhà máy
router.get("/sua/:id", view.pageEdit); // trang sửa nhà máy
router.get("/thongke", stats.pageStats); // trang thống kê
router.get("/lichsu", log.pageList); // trang lịch sử

module.exports = router;
