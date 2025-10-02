var express = require("express");
var router = express.Router();
const User = require("../schemas/user"); // Đảm bảo đường dẫn đúng
const Role = require("../schemas/role"); // Để kiểm tra role tồn tại

/* =========================
   GET ALL USERS
   ========================= */
router.get("/", async (req, res) => {
  try {
    const users = await User.find({ isDelete: false }).populate("role");
    res.send({ success: true, data: users });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

/* =========================
   GET USER BY ID
   ========================= */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      isDelete: false,
    }).populate("role");
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    res.send({ success: true, data: user });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

/* =========================
   CREATE USER
   ========================= */
router.post("/", async (req, res) => {
  try {
    const { username, password, email, fullname, avatarUrl, role } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!username || !password || !email || !role) {
      return res.status(400).send({
        success: false,
        message: "Username, password, email, and role are required",
      });
    }

    // Kiểm tra role tồn tại
    const roleExists = await Role.findById(role);
    if (!roleExists) {
      return res
        .status(400)
        .send({ success: false, message: "Role không tồn tại" });
    }

    const newUser = await User.create({
      username,
      password,
      email,
      fullname: fullname || "",
      avatarUrl: avatarUrl || "",
      role,
    });

    res.status(201).send({ success: true, data: newUser });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

/* =========================
   UPDATE USER (PUT)
   ========================= */
router.put("/:id", async (req, res) => {
  try {
    const updateData = {};
    if (req.body.username !== undefined)
      updateData.username = req.body.username;
    if (req.body.password !== undefined)
      updateData.password = req.body.password;
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.fullname !== undefined)
      updateData.fullname = req.body.fullname;
    if (req.body.avatarUrl !== undefined)
      updateData.avatarUrl = req.body.avatarUrl;
    if (req.body.status !== undefined) updateData.status = req.body.status; // Đã thêm vào schema
    if (req.body.role !== undefined) {
      const roleExists = await Role.findById(req.body.role);
      if (!roleExists) {
        return res
          .status(400)
          .send({ success: false, message: "Role không tồn tại" });
      }
      updateData.role = req.body.role;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser || updatedUser.isDelete) {
      return res
        .status(404)
        .send({ success: false, message: "User not found or deleted" });
    }

    res.send({ success: true, data: updatedUser });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

/* =========================
   SOFT DELETE USER
   ========================= */
router.put("/:id/delete", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isDelete: true },
      { new: true }
    );

    if (!deletedUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    res.send({ success: true, data: deletedUser });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

module.exports = router;
