const express = require("express");
const router = express.Router();
const axios = require("axios");
const upload = require("../middleware/upload");

const crud = require("../controllers/plant/plantCrudController");
const stats = require("../controllers/plant/plantStatsController");
const log = require("../controllers/plant/plantLogController");

// Quản lý nhà máy
router.get("/plants", crud.getAll);
router.get("/plants/search", crud.search);
router.post("/plants", upload.single("image"), crud.create);
router.put("/plants/:id", upload.single("image"), crud.update);
router.delete("/plants/:id", crud.delete);

// Lịch sử log
router.get("/plants/:id/logs", log.getLogs);
router.get("/plants/:id/logs/lazy", log.getLogsLazy);

// Thống kê
router.get("/stats", stats.apiStats);

// Proxy Geoserver
router.get("/geoserver", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:8080/geoserver/nhamay/wms",
      { params: req.query },
    );

    res.json(response.data);
  } catch (err) {
    console.error("Proxy GeoServer lỗi:", err.message);
    res.status(500).send("Lỗi gọi GeoServer");
  }
});

module.exports = router;
