const PlantModel = require("../../models/plant/plantCrudModel");
const LogModel = require("../../models/plant/plantLogModel"); // ✅ thêm

module.exports = {
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
      const newPlant = await PlantModel.create(data);

      await LogModel.create({
        nhamay_id: newPlant.id,
        action: "Thêm mới",
        ghi_chu: `Nhà máy được tạo với công suất ${data.cong_suat} MW`,
        user_id: req.session.user.id,
      });

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

      await LogModel.create({
        nhamay_id: id,
        action: "Xoá",
        ghi_chu: `Xoá nhà máy: ${plant.ten_nha_may}`,
        user_id: user.id,
      });

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

      // ✅ Ghi log — ghi rõ nếu đổi trạng thái
      const ghi_chu =
        plant.trang_thai !== data.trang_thai
          ? `Đổi trạng thái: ${plant.trang_thai} → ${data.trang_thai}`
          : "Cập nhật thông tin";

      await LogModel.create({
        nhamay_id: id,
        action: "Cập nhật",
        ghi_chu,
        user_id: user.id,
      });

      res.send("Cập nhật thành công");
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi cập nhật");
    }
  },
};
