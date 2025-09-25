const express = require("express");
const router = express.Router();
const Category = require("../schemas/category");

/* GET all categories (only non-deleted) */
router.get("/", async function (req, res, next) {
  try {
    const categories = await Category.find({ isDelete: false });
    res.send({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      data: error.message,
    });
  }
});

/* GET category by ID */
router.get("/:id", async function (req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || category.isDelete) {
      return res.status(404).send({
        success: false,
        data: "Category not found or has been deleted",
      });
    }
    res.send({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      data: error.message,
    });
  }
});

/* POST create  */
router.post("/", async function (req, res, next) {
  try {
    const newCategory = new Category({
      name: req.body.name,
    });
    await newCategory.save();
    res.send({
      success: true,
      data: newCategory,
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
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!updatedCategory || updatedCategory.isDelete) {
      return res.status(404).send({
        success: false,
        data: "Category not found or has been deleted",
      });
    }
    res.send({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      data: error.message,
    });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    const deletedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { isDelete: true },
      { new: true }
    );
    if (!deletedCategory) {
      return res.status(404).send({
        success: false,
        data: "Category not found",
      });
    }
    res.send({
      success: true,
      data: deletedCategory,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      data: error.message,
    });
  }
});

module.exports = router;
