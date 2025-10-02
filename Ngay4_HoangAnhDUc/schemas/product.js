let mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "thang nay khong duoc de trong"],
      unique: true,
    },
    price: {
      type: Number,
      default: 1,
    },
    description: {
      type: String,
      default: "good product",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true, // 👈 bắt buộc
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = new mongoose.model("product", schema);
