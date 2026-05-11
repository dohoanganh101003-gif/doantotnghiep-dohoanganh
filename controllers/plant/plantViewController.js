const PlantModel = require("../../models/plant/plantCrudModel");

module.exports = {
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
};
