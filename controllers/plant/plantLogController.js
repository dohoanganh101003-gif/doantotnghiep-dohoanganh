const LogModel = require("../../models/plant/plantLogModel");
const PlantModel = require("../../models/plant/plantCrudModel");

module.exports = {
  // =============================================
  // API: lấy log theo nhà máy (dùng cho popup bản đồ)
  // =============================================
  getLogs: async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.session.user;

      if (!user || (user.role !== "admin" && user.role !== "owner")) {
        return res.status(403).json([]);
      }

      if (user.role === "owner") {
        const plant = await PlantModel.getById(id);
        if (!plant || plant.owner_id !== user.id) {
          return res.status(403).json([]);
        }
      }

      const logs = await LogModel.getByPlantId(id);
      res.json(logs);
    } catch (err) {
      console.error("Lỗi lấy log:", err);
      res.status(500).json([]);
    }
  },

  // =============================================
  // PAGE: trang lịch sử — hiển thị danh sách nhà máy
  // =============================================
  pageList: async (req, res) => {
    try {
      const user = req.session.user;
      if (!user) return res.redirect("/dangnhap");

      const plants = await LogModel.getPlantList(user.role, user.id);

      res.render("nhamay/lichsu", {
        plants,
        user,
      });
    } catch (err) {
      console.error("Lỗi trang lịch sử:", err);
      res.status(500).send("Lỗi tải lịch sử");
    }
  },

  // =============================================
  // API: lazy load log khi bấm mở nhà máy
  // GET /api/plants/:id/logs?tu_ngay=...&den_ngay=...
  // =============================================
  getLogsLazy: async (req, res) => {
    try {
      const user = req.session.user;
      if (!user) return res.status(401).json([]);

      const plantId = req.params.id;
      const { tu_ngay, den_ngay } = req.query;

      const logs = await LogModel.getLogsByPlantAndTime({
        plantId,
        tu_ngay: tu_ngay || null,
        den_ngay: den_ngay || null,
        role: user.role,
        owner_id: user.id,
      });

      res.json(logs);
    } catch (err) {
      console.error("Lỗi lazy load log:", err);
      res.status(500).json([]);
    }
  },
};
