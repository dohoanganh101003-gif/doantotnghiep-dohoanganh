const PlantModel = require("../models/plantModel");
const upload = require("../middleware/upload");

const PlantController = {
  getAll: async (req, res) => {
    const data = await PlantModel.getAll();
    res.json(data);
  },

  search: async (req, res) => {
    const keyword = req.query.keyword;
    const data = await PlantModel.search(keyword);
    res.json(data);
  },

  create: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).send("Chưa đăng nhập");
      }

      const imagePath = req.file ? "/uploads/" + req.file.filename : null;

      const data = {
        ...req.body,
        owner_id: req.session.user.id,
        image: imagePath,
      };

      await PlantModel.create(data);

      res.send("Thêm thành công");
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi thêm");
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const user = req.session.user;

      if (!user) return res.status(401).send("Chưa đăng nhập");

      const plant = await PlantModel.getById(id);
      if (!plant) return res.status(404).send("Không tồn tại");

      if (user.role !== "admin" && plant.owner_id !== user.id) {
        return res.status(403).send("Không có quyền xoá");
      }

      await PlantModel.delete(id);
      res.send("Xoá thành công");
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi xoá");
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;
      const user = req.session.user;

      if (!user) return res.status(401).send("Chưa đăng nhập");

      const plant = await PlantModel.getById(id);
      if (!plant) return res.status(404).send("Không tồn tại");

      if (user.role !== "admin" && plant.owner_id !== user.id) {
        return res.status(403).send("Không có quyền sửa");
      }

      const imagePath = req.file ? "/uploads/" + req.file.filename : null;

      const data = {
        ...req.body,
        image: imagePath,
      };

      await PlantModel.update(id, data);

      res.send("Cập nhật thành công");
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi cập nhật");
    }
  },

  pageList: async (req, res) => {
    try {
      const data = await PlantModel.getAll();

      res.render("nhamay/danhsach", {
        plants: data,
        user: req.session.user || null,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi load danh sách");
    }
  },

  pageAdd: (req, res) => {
    res.render("nhamay/themnhamay", {
      user: req.session.user || null,
    });
  },

  pageEdit: async (req, res) => {
    try {
      const id = req.params.id;
      const user = req.session.user;

      const data = await PlantModel.getById(id);
      if (!data) return res.send("Không tồn tại");

      if (user.role !== "admin" && data.owner_id !== user.id) {
        return res.status(403).send("Không có quyền");
      }

      res.render("nhamay/sua", {
        plant: data,
        user: user || null,
      });
    } catch (err) {
      console.error(err);
      res.send("Lỗi load dữ liệu");
    }
  },

  pageStats: async (req, res) => {
    try {
      const user = req.session.user;

      if (!user) {
        return res.status(401).send("Chưa đăng nhập");
      }

      const stats = await PlantModel.getStats(user);
      const provinceStats = await PlantModel.statsByProvince(user);
      const regionStats = await PlantModel.statsByRegion(user);

      res.render("nhamay/thongke", {
        stats,
        provinceStats,
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

      let stats, provinceStats, regionStats;

      if (user.role === "admin") {
        stats = await PlantModel.getStats();
        provinceStats = await PlantModel.statsByProvince();
        regionStats = await PlantModel.statsByRegion();
      } else {
        // owner → chỉ lấy của mình
        stats = await PlantModel.getStatsByOwner(user.id);
        provinceStats = await PlantModel.statsByProvinceByOwner(user.id);
        regionStats = await PlantModel.statsByRegionByOwner(user.id);
      }

      res.json({ stats, provinceStats, regionStats });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi thống kê" });
    }
  },
};

module.exports = PlantController;
