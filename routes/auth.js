const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const { requireAdmin } = require("../middleware/auths");

router.post("/register", AuthController.register);
router.post("/register-admin", AuthController.registerAdmin);
router.post("/login", AuthController.login);
router.get("/logout", AuthController.logout);
router.get("/admin/users", requireAdmin, AuthController.pageUsers);
router.post("/admin/approve/:id", requireAdmin, AuthController.approveUser);
router.post("/admin/delete/:id", requireAdmin, AuthController.deleteUser);

module.exports = router;
