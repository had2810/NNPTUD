const mongoose = require("mongoose");

const rolesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên vai trò không được để trống"],
      unique: true,
    },
    description: {
        type : String,
        default : ""
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

module.exports = mongoose.model("Role", rolesSchema);
