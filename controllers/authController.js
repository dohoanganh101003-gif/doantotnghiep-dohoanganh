const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");

const AuthController = {
  register: async (req, res) => {
    try {
      const { username, password, email, phone } = req.body;

      if (!username || !password || !email || !phone) {
        return res.status(400).send("Vui lòng nhập đầy đủ thông tin");
      }

      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).send("Username đã tồn tại");
      }

      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) {
        return res.status(400).send("Email đã tồn tại");
      }

      const hash = await bcrypt.hash(password, 10);

      await UserModel.create(username, hash, email, phone, "user", "pending");

      res.send("Đăng ký thành công! Chờ admin duyệt.");
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi đăng ký");
    }
  },

  registerAdmin: async (req, res) => {
    try {
      const { username, password, email, phone } = req.body;
      const hash = await bcrypt.hash(password, 10);
      await UserModel.create(username, hash, email, phone, "admin", "active");

      res.send("Tạo admin thành công");
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi đăng ký admin");
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await UserModel.findByUsername(username);
      if (!user) return res.send("Sai tài khoản");

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.send("Sai mật khẩu");

      if (user.status !== "active") {
        return res.send("Tài khoản chưa được admin duyệt!");
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      res.send("Đăng nhập thành công");
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi login");
    }
  },

  pageUsers: async (req, res) => {
    try {
      const users = await UserModel.getAll();

      res.render("admin/users", {
        users,
        user: req.session.user,
      });
    } catch (err) {
      console.error(err);
      res.send("Lỗi load user");
    }
  },

  approveUser: async (req, res) => {
    try {
      const id = req.params.id;
      const { role } = req.body;

      await UserModel.approve(id, role);

      res.redirect("/auth/admin/users");
    } catch (err) {
      console.error(err);
      res.send("Lỗi duyệt");
    }
  },

  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;

      await UserModel.delete(id);

      res.redirect("/auth/admin/users");
    } catch (err) {
      console.error(err);
      res.send("Lỗi xoá");
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  },
};

module.exports = AuthController;
