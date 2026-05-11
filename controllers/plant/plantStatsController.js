const PlantModel = require("../../models/plant/plantStatsModel");

module.exports = {
  pageStats: async (req, res) => {
    try {
      const user = req.session.user;

      if (!user) {
        return res.status(401).send("Chưa đăng nhập");
      }

      const stats = await PlantModel.getStats(user);
      const regionStats = await PlantModel.statsByRegion(user);

      res.render("nhamay/thongke", {
        stats,
        regionStats,
        user: user,
      });
    } catch (err) {
      console.error(err);
      res.send("Lỗi thống kê");
    }
  },

  apiStats: async (req, res) => {
    try {
      const user = req.session.user;
      if (!user) return res.status(401).json({ error: "Chưa đăng nhập" });

      let stats, regionStats;

      if (user.role === "admin") {
        stats = await PlantModel.getStats();
        regionStats = await PlantModel.statsByRegion();
      } else {
        stats = await PlantModel.getStatsByOwner(user.id);
        regionStats = await PlantModel.statsByRegionByOwner(user.id);
      }

      res.json({ stats, regionStats });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi thống kê" });
    }
  },
};
