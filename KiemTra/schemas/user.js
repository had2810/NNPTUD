let mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username khong duoc de trong"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password khong duoc de trong"],
    },
    email: {
      type: String,
      required: [true, "email khong duoc de trong"],
      unique: true,
    },
    fullname: {
      type: String,
      default: "",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: false, // Thêm trường status nếu cần
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true, // Bắt buộc
    },
    loginCount: {
      type: Number,
      default: 0,
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

module.exports = new mongoose.model("User", schema); // Đổi "user" thành "User" để khớp với router
