const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    department: { type: String, required: true },
    position: { type: String, required: true },

    salary: { type: Number },
    date_of_joining: { type: Date },

    // NEW: Profile image stored as file path
    profile_image: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
