const express = require("express");
const router = express.Router();
const Role = require("../schemas/role"); // Đảm bảo đường dẫn đúng với file schema

/* GET all roles (only non-deleted) */
router.get("/", async function (req, res, next) {
  try {
    const roles = await Role.find({ isDelete: false });
    res.send({
      success: true,
      data: roles,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      data: error.message,
    });
  }
});

/* GET role by ID */
router.get("/:id", async function (req, res, next) {
  try {
    const role = await Role.findById(req.params.id);
    if (!role || role.isDelete) {
      return res.status(404).send({
        success: false,
        data: "Role not found or has been deleted",
      });
    }
    res.send({
      success: true,
      data: role,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      data: error.message,
    });
  }
});

/* POST create */
router.post("/", async function (req, res, next) {
  try {
    const newRole = new Role({
      name: req.body.name,
      description: req.body.description || "",
    });
    await newRole.save();
    res.send({
      success: true,
      data: newRole,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      data: error.message,
    });
  }
});

/* PUT update */
router.put("/:id", async function (req, res, next) {
  try {
    // Chuẩn bị dữ liệu update, chỉ set nếu có gửi
    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined)
      updateData.description = req.body.description;

    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedRole || updatedRole.isDelete) {
      return res.status(404).send({
        success: false,
        data: "Role not found or has been deleted",
      });
    }

    res.send({
      success: true,
      data: updatedRole,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      data: error.message,
    });
  }
});

/* PUT soft delete role */
router.put("/:id/delete", async function (req, res, next) {
  try {
    const deletedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { isDelete: true },
      { new: true }
    );

    if (!deletedRole) {
      return res.status(404).send({
        success: false,
        data: "Role not found",
      });
    }

    res.send({
      success: true,
      data: deletedRole,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      data: error.message,
    });
  }
});

module.exports = router;
