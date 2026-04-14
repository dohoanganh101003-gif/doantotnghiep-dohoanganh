const express = require("express");
const router = express.Router();
const axios = require("axios");
const upload = require("../middleware/upload");

const PlantController = require("../controllers/plantController");

// ================= API DB =================
router.get("/all-db", PlantController.getAll);
router.get("/search", PlantController.search);
router.post("/solar", upload.single("image"), PlantController.create);
router.delete("/solar/:id", PlantController.delete);
router.put("/solar/:id", upload.single("image"), PlantController.update);
router.get("/api/stats", PlantController.apiStats);

router.get("/geoserver", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:8080/geoserver/nhamay/wms",
      {
        params: req.query,
      },
    );

    res.json(response.data);
  } catch (err) {
    console.error("Proxy GeoServer lỗi:", err.message);
    res.status(500).send("Lỗi gọi GeoServer");
  }
});

module.exports = router;
